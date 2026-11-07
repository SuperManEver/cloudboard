import { FolderKanban } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ProjectSummary = {
  id: string;
  name: string;
  taskCount: number;
};

export function ProjectList({
  projects,
  emptyAction,
}: {
  projects: ProjectSummary[];
  /** Shown in the empty state, e.g. a "New project" button. */
  emptyAction: React.ReactNode;
}) {
  if (projects.length === 0) {
    return (
      <Card className="items-center py-16 text-center">
        <FolderKanban className="size-10 text-muted-foreground" />
        <CardHeader className="w-full">
          <CardTitle>No projects yet</CardTitle>
          <CardDescription>
            Create a project to start organizing your tasks.
          </CardDescription>
        </CardHeader>
        {emptyAction}
      </Card>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="block rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Card className="h-full transition-shadow hover:ring-primary/40">
              <CardHeader>
                <CardTitle className="truncate">{project.name}</CardTitle>
                <CardDescription>
                  {project.taskCount === 1
                    ? "1 task"
                    : `${project.taskCount} tasks`}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
