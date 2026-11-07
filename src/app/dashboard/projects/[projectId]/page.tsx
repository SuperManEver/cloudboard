import { ChevronLeft, Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { renameProject } from "@/features/projects/actions";
import { DeleteProjectDialog } from "@/features/projects/components/delete-project-dialog";
import { ProjectFormDialog } from "@/features/projects/components/project-form-dialog";
import { AddTaskButton } from "@/features/tasks/components/add-task-button";
import { Board } from "@/features/tasks/components/board";
import { cookiesClient, isUnauthorized, unwrap } from "@/lib/amplify-server";
import type { TaskItem } from "@/types/data";

export const metadata: Metadata = {
  title: "Project · CloudBoard",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // One GraphQL request: the project plus its tasks (read through the GSI on
  // Task.projectId). Nested lists return one page of up to 100 tasks.
  const result = await cookiesClient.models.Project.get(
    { id: projectId },
    {
      selectionSet: [
        "id",
        "name",
        "tasks.id",
        "tasks.title",
        "tasks.description",
        "tasks.status",
        "tasks.dueDate",
      ],
    },
  );

  // Another user's project comes back as an Unauthorized error; treat it the
  // same as a project that doesn't exist.
  if (isUnauthorized(result.errors)) notFound();
  const project = unwrap(result);
  if (!project) notFound();

  const tasks: TaskItem[] = project.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    status: task.status ?? "TODO",
    dueDate: task.dueDate ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/dashboard">
            <ChevronLeft data-icon="inline-start" />
            Projects
          </Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <div className="flex flex-wrap gap-2">
            <ProjectFormDialog
              trigger={
                <Button variant="outline">
                  <Pencil data-icon="inline-start" />
                  Rename
                </Button>
              }
              title="Rename project"
              description="Choose a new name for this project."
              submitLabel="Save"
              defaultName={project.name}
              action={renameProject.bind(null, project.id)}
            />
            <DeleteProjectDialog
              projectId={project.id}
              projectName={project.name}
              taskCount={tasks.length}
            />
            <AddTaskButton projectId={project.id} />
          </div>
        </div>
      </div>

      <Board tasks={tasks} />
    </div>
  );
}
