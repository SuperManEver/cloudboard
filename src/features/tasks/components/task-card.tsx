"use client";

import {
  ArrowRight,
  CalendarDays,
  Ellipsis,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ActionState, TaskItem } from "@/types/data";
import { deleteTask, setTaskStatus, updateTask } from "../actions";
import { TASK_STATUSES } from "../task-statuses";
import { TaskFormDialog } from "./task-form-dialog";

/**
 * `dueDate` is an AWSDate ("2026-11-08") with no time zone. Formatting it as
 * UTC keeps the server and browser output identical.
 */
const dueDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function TaskCard({ task }: { task: TaskItem }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const done = task.status === "DONE";

  function run(action: () => Promise<ActionState>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
    });
  }

  return (
    <Card
      size="sm"
      className={cn("gap-2 px-3 transition-opacity", pending && "opacity-60")}
      aria-busy={pending}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "text-sm font-medium break-words",
            done && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        {/* Not modal: a modal menu that opens a dialog can leave the page
            unclickable when both close. */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="-mt-0.5 -mr-1 shrink-0"
              aria-label={`Actions for ${task.title}`}
              disabled={pending}
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            {TASK_STATUSES.filter((status) => status.value !== task.status).map(
              (status) => (
                <DropdownMenuItem
                  key={status.value}
                  onSelect={() =>
                    run(() => setTaskStatus(task.id, status.value))
                  }
                >
                  <ArrowRight />
                  {status.label}
                </DropdownMenuItem>
              ),
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => run(() => deleteTask(task.id))}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="line-clamp-3 text-xs whitespace-pre-line text-muted-foreground">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <div>
          <Badge variant="secondary">
            <CalendarDays data-icon="inline-start" />
            {dueDateFormat.format(new Date(`${task.dueDate}T00:00:00Z`))}
          </Badge>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}

      <TaskFormDialog
        title="Edit task"
        submitLabel="Save"
        action={updateTask.bind(null, task.id)}
        task={task}
        open={editing}
        onOpenChange={setEditing}
      />
    </Card>
  );
}
