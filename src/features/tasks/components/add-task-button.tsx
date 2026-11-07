"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createTask } from "../actions";
import { TaskFormDialog } from "./task-form-dialog";

export function AddTaskButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <TaskFormDialog
      title="New task"
      submitLabel="Add task"
      action={createTask.bind(null, projectId)}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <Plus data-icon="inline-start" />
          Add task
        </Button>
      }
    />
  );
}
