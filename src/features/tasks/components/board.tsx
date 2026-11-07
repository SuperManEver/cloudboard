import type { TaskItem } from "@/types/data";
import { TASK_STATUSES } from "../task-statuses";
import { TaskCard } from "./task-card";

/** Tasks with a due date first (soonest first), then the rest by title. */
function compareTasks(a: TaskItem, b: TaskItem) {
  if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
    return a.dueDate < b.dueDate ? -1 : 1;
  }
  if (a.dueDate && !b.dueDate) return -1;
  if (!a.dueDate && b.dueDate) return 1;
  return a.title.localeCompare(b.title);
}

/** Three status columns, styled like the landing page's board preview. */
export function Board({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks
          .filter((task) => task.status === status.value)
          .sort(compareTasks);

        return (
          <section
            key={status.value}
            aria-labelledby={`column-${status.value}`}
            className="rounded-xl bg-muted/60 p-3"
          >
            <h2
              id={`column-${status.value}`}
              className="flex items-center gap-2 px-1 pb-3 text-sm font-medium"
            >
              <span className={`size-2 rounded-full ${status.dot}`} />
              {status.label}
              <span className="text-muted-foreground">
                {columnTasks.length}
              </span>
            </h2>
            {columnTasks.length === 0 ? (
              <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                No tasks
              </p>
            ) : (
              <ul className="space-y-2">
                {columnTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
