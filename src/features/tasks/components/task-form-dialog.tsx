"use client";

import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState, TaskItem } from "@/types/data";
import { TASK_STATUSES } from "../task-statuses";

type TaskFormDialogProps = {
  title: string;
  submitLabel: string;
  /** A Server Action from `../actions`, with any IDs already bound. */
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>;
  /** When set, the form edits this task and shows the status field. */
  task?: TaskItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional button that opens the dialog; omit to control it with `open`. */
  trigger?: React.ReactNode;
};

/** Create or edit a task. */
export function TaskFormDialog({
  title,
  open,
  onOpenChange,
  trigger,
  ...formProps
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {formProps.task
              ? "Change the task's details or status."
              : "New tasks start in the To do column."}
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so fields and errors reset each time. */}
        <TaskForm {...formProps} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TaskForm({
  submitLabel,
  action,
  task,
  onSuccess,
}: Pick<TaskFormDialogProps, "submitLabel" | "action" | "task"> & {
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    async (previous: ActionState, formData: FormData) => {
      const result = await action(previous, formData);
      if (!result.error) onSuccess();
      return result;
    },
    {},
  );

  return (
    <form action={formAction}>
      <FieldGroup>
        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <Field>
          <FieldLabel htmlFor="task-title">Title</FieldLabel>
          <Input
            id="task-title"
            name="title"
            required
            maxLength={200}
            autoComplete="off"
            placeholder="Draft pricing page copy"
            defaultValue={task?.title}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="task-description">Description</FieldLabel>
          <Textarea
            id="task-description"
            name="description"
            maxLength={2000}
            rows={4}
            placeholder="Optional"
            defaultValue={task?.description ?? ""}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="task-due-date">Due date</FieldLabel>
            <Input
              id="task-due-date"
              name="dueDate"
              type="date"
              defaultValue={task?.dueDate ?? ""}
            />
          </Field>
          {task && (
            <Field>
              <FieldLabel htmlFor="task-status">Status</FieldLabel>
              {/* With `name`, Radix renders a hidden <select> for the form. */}
              <Select name="status" defaultValue={task.status}>
                <SelectTrigger id="task-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
