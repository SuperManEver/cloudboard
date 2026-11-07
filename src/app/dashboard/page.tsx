import { Plus } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { createProject } from "@/features/projects/actions";
import { ProjectFormDialog } from "@/features/projects/components/project-form-dialog";
import { ProjectList } from "@/features/projects/components/project-list";
import { cookiesClient, unwrap } from "@/lib/amplify-server";

export const metadata: Metadata = {
  title: "Projects · CloudBoard",
};

export default async function DashboardPage() {
  // Owner rules mean this only returns the signed-in user's projects.
  // One page (up to 100 projects); there's no pagination UI yet.
  const projects = unwrap(
    await cookiesClient.models.Project.list({
      selectionSet: ["id", "name", "tasks.id"],
    }),
  );

  const summaries = projects
    .map((project) => ({
      id: project.id,
      name: project.name,
      taskCount: project.tasks.length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const newProjectDialog = (
    <ProjectFormDialog
      trigger={
        <Button>
          <Plus data-icon="inline-start" />
          New project
        </Button>
      }
      title="New project"
      description="Give your project a name. You can change it later."
      submitLabel="Create project"
      action={createProject}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        {summaries.length > 0 && newProjectDialog}
      </div>
      <ProjectList projects={summaries} emptyAction={newProjectDialog} />
    </div>
  );
}
