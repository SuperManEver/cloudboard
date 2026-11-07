import type { TaskStatus } from "@/types/data";

/** Board columns, in display order. */
export const TASK_STATUSES: {
  value: TaskStatus;
  label: string;
  dot: string;
}[] = [
  { value: "TODO", label: "To do", dot: "bg-muted-foreground" },
  { value: "IN_PROGRESS", label: "In progress", dot: "bg-primary" },
  { value: "DONE", label: "Done", dot: "bg-emerald-500" },
];

export function isTaskStatus(value: unknown): value is TaskStatus {
  return TASK_STATUSES.some((status) => status.value === value);
}
