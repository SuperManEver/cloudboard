"use server";

import { revalidatePath } from "next/cache";

import { cookiesClient, unwrap } from "@/lib/amplify-server";
import type { ActionState, TaskStatus } from "@/types/data";
import { isTaskStatus } from "./task-statuses";

/*
 * As in the project actions, IDs come from the client but AppSync's owner
 * rules make sure a user can only touch their own tasks.
 */

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 2000;

type TaskFields = {
  title: string;
  description: string | null;
  dueDate: string | null;
};

function readTaskFields(formData: FormData): TaskFields | ActionState {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "");

  if (!title) return { error: "Enter a task title." };
  if (title.length > TITLE_MAX_LENGTH) {
    return { error: `Keep the title under ${TITLE_MAX_LENGTH} characters.` };
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return {
      error: `Keep the description under ${DESCRIPTION_MAX_LENGTH} characters.`,
    };
  }
  // AWSDate: YYYY-MM-DD, as sent by <input type="date">.
  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return { error: "Enter a valid due date." };
  }

  return {
    title,
    description: description || null,
    dueDate: dueDate || null,
  };
}

function isActionState(value: TaskFields | ActionState): value is ActionState {
  return "error" in value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function revalidateProject(projectId: string) {
  revalidatePath(`/dashboard/projects/${projectId}`);
  // The dashboard shows task counts per project.
  revalidatePath("/dashboard");
}

export async function createTask(
  projectId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fields = readTaskFields(formData);
  if (isActionState(fields)) return fields;

  try {
    unwrap(
      await cookiesClient.models.Task.create({
        ...fields,
        projectId,
        status: "TODO",
      }),
    );
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidateProject(projectId);
  return {};
}

export async function updateTask(
  taskId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fields = readTaskFields(formData);
  if (isActionState(fields)) return fields;

  const status = formData.get("status");
  if (!isTaskStatus(status)) return { error: "Choose a status." };

  try {
    const task = unwrap(
      await cookiesClient.models.Task.update({ id: taskId, ...fields, status }),
    );
    if (task) revalidateProject(task.projectId);
  } catch (error) {
    return { error: errorMessage(error) };
  }
  return {};
}

export async function setTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<ActionState> {
  if (!isTaskStatus(status)) return { error: "Choose a status." };

  try {
    const task = unwrap(
      await cookiesClient.models.Task.update({ id: taskId, status }),
    );
    if (task) revalidateProject(task.projectId);
  } catch (error) {
    return { error: errorMessage(error) };
  }
  return {};
}

export async function deleteTask(taskId: string): Promise<ActionState> {
  try {
    const task = unwrap(await cookiesClient.models.Task.delete({ id: taskId }));
    if (task) revalidateProject(task.projectId);
  } catch (error) {
    return { error: errorMessage(error) };
  }
  return {};
}
