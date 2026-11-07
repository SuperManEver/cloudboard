"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { cookiesClient, unwrap } from "@/lib/amplify-server";
import type { ActionState } from "@/types/data";

/*
 * Server Actions are public HTTP endpoints, so IDs from the client are not
 * trusted here. They don't need to be: every call goes through AppSync as
 * the signed-in user, and the owner rules reject records that aren't theirs.
 */

const NAME_MAX_LENGTH = 80;

function readName(formData: FormData): string | ActionState {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Enter a project name." };
  if (name.length > NAME_MAX_LENGTH) {
    return { error: `Keep the name under ${NAME_MAX_LENGTH} characters.` };
  }
  return name;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createProject(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = readName(formData);
  if (typeof name !== "string") return name;

  let projectId: string;
  try {
    const project = unwrap(await cookiesClient.models.Project.create({ name }));
    if (!project) throw new Error("The project wasn't created.");
    projectId = project.id;
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/projects/${projectId}`);
}

export async function renameProject(
  projectId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = readName(formData);
  if (typeof name !== "string") return name;

  try {
    unwrap(await cookiesClient.models.Project.update({ id: projectId, name }));
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${projectId}`);
  return {};
}

/**
 * Deletes the project's tasks, then the project. DynamoDB has no foreign keys
 * or cascading deletes, so the app does it. This isn't atomic: if a request
 * fails halfway, some tasks can be left without a project. A transactional
 * delete (DynamoDB TransactWriteItems in a Lambda) belongs to a later phase.
 */
export async function deleteProject(projectId: string): Promise<ActionState> {
  try {
    const project = unwrap(
      await cookiesClient.models.Project.get({ id: projectId }),
    );
    if (project) {
      let nextToken: string | null | undefined;
      do {
        // Reads the tasks through the GSI on Task.projectId, one page at a time.
        const page = await project.tasks({ nextToken });
        const tasks = unwrap(page);
        await Promise.all(
          tasks.map(async (task) =>
            unwrap(await cookiesClient.models.Task.delete({ id: task.id })),
          ),
        );
        nextToken = page.nextToken;
      } while (nextToken);

      unwrap(await cookiesClient.models.Project.delete({ id: projectId }));
    }
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
