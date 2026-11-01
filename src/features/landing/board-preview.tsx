import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const projects = [
  { name: "Website redesign", count: 7, active: true },
  { name: "Learn AWS", count: 5, active: false },
  { name: "Home office", count: 3, active: false },
];

type Task = {
  title: string;
  tag: string;
  due?: string;
};

const columns: { name: string; dot: string; done?: boolean; tasks: Task[] }[] =
  [
    {
      name: "To do",
      dot: "bg-muted-foreground",
      tasks: [
        { title: "Draft pricing page copy", tag: "Content", due: "Fri" },
        { title: "Collect feedback from beta users", tag: "Research" },
        { title: "Pick an icon set", tag: "Design", due: "Mon" },
      ],
    },
    {
      name: "In progress",
      dot: "bg-primary",
      tasks: [
        { title: "Build the new navigation", tag: "Frontend", due: "Today" },
        { title: "Write release notes", tag: "Content" },
      ],
    },
    {
      name: "Done",
      dot: "bg-emerald-500",
      done: true,
      tasks: [
        { title: "Set up hosting", tag: "Infra" },
        { title: "Choose a color palette", tag: "Design" },
      ],
    },
  ];

export function BoardPreview() {
  return (
    <Card
      role="img"
      aria-label="Preview of a CloudBoard project board with To do, In progress and Done columns"
      className="gap-0 rounded-2xl py-0 text-left shadow-2xl shadow-primary/10 dark:shadow-black/40"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="size-3 rounded-full bg-muted" />
        <span className="size-3 rounded-full bg-muted" />
        <span className="size-3 rounded-full bg-muted" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          Preview
        </span>
      </div>
      <Separator />

      <div className="flex">
        <aside className="hidden w-56 shrink-0 p-4 md:block">
          <p className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Projects
          </p>
          <ul className="mt-3 space-y-1">
            {projects.map((project) => (
              <li
                key={project.name}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5",
                  project.active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                {project.name}
                <span className="text-xs text-muted-foreground">
                  {project.count}
                </span>
              </li>
            ))}
          </ul>
        </aside>
        <Separator orientation="vertical" className="hidden md:block" />

        <div className="flex-1 bg-muted/40 p-4 sm:p-6">
          <p className="font-medium">Website redesign</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            7 tasks · 2 done
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {columns.map((column, index) => (
              <div
                key={column.name}
                className={index > 0 ? "hidden sm:block" : undefined}
              >
                <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className={cn("size-2 rounded-full", column.dot)} />
                  {column.name}
                  <span className="opacity-70">{column.tasks.length}</span>
                </p>
                <ul className="mt-3 space-y-2">
                  {column.tasks.map((task) => (
                    <li key={task.title}>
                      <Card size="sm">
                        <CardContent>
                          <p
                            className={cn(
                              column.done &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            {task.title}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <Badge variant="secondary">{task.tag}</Badge>
                            {task.due && (
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {task.due}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
