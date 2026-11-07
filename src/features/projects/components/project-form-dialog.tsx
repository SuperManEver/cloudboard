"use client";

import { useActionState, useState } from "react";

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
import { Spinner } from "@/components/ui/spinner";
import type { ActionState } from "@/types/data";

type ProjectFormDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  submitLabel: string;
  defaultName?: string;
  /** A Server Action from `../actions`, with any IDs already bound. */
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>;
};

/** Create or rename a project. */
export function ProjectFormDialog({
  trigger,
  title,
  description,
  ...formProps
}: ProjectFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so errors reset each time it opens. */}
        <ProjectForm {...formProps} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ProjectForm({
  submitLabel,
  defaultName,
  action,
  onSuccess,
}: Pick<ProjectFormDialogProps, "submitLabel" | "defaultName" | "action"> & {
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
          <FieldLabel htmlFor="project-name">Name</FieldLabel>
          <Input
            id="project-name"
            name="name"
            required
            maxLength={80}
            autoComplete="off"
            placeholder="Website redesign"
            defaultValue={defaultName}
          />
        </Field>
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
