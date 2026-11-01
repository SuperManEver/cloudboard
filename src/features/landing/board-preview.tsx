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

const columns: { name: string; dot: string; tasks: Task[] }[] = [
  {
    name: "To do",
    dot: "bg-neutral-400",
    tasks: [
      { title: "Draft pricing page copy", tag: "Content", due: "Fri" },
      { title: "Collect feedback from beta users", tag: "Research" },
      { title: "Pick an icon set", tag: "Design", due: "Mon" },
    ],
  },
  {
    name: "In progress",
    dot: "bg-sky-500",
    tasks: [
      { title: "Build the new navigation", tag: "Frontend", due: "Today" },
      { title: "Write release notes", tag: "Content" },
    ],
  },
  {
    name: "Done",
    dot: "bg-emerald-500",
    tasks: [
      { title: "Set up hosting", tag: "Infra" },
      { title: "Choose a color palette", tag: "Design" },
    ],
  },
];

export function BoardPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of a CloudBoard project board with To do, In progress and Done columns"
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-background text-left shadow-2xl shadow-sky-900/10 dark:border-neutral-800 dark:shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <span className="size-3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <span className="size-3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <span className="size-3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <span className="ml-3 font-mono text-xs text-neutral-500">Preview</span>
      </div>

      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r border-neutral-200 p-4 md:block dark:border-neutral-800">
          <p className="px-2 text-xs font-medium tracking-wide text-neutral-500 uppercase">
            Projects
          </p>
          <ul className="mt-3 space-y-1">
            {projects.map((project) => (
              <li
                key={project.name}
                className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm ${
                  project.active
                    ? "bg-sky-50 font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {project.name}
                <span className="text-xs text-neutral-400">
                  {project.count}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 bg-neutral-50 p-4 sm:p-6 dark:bg-neutral-900/50">
          <p className="font-medium">Website redesign</p>
          <p className="mt-0.5 text-xs text-neutral-500">7 tasks · 2 done</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {columns.map((column, index) => (
              <div
                key={column.name}
                className={index > 0 ? "hidden sm:block" : undefined}
              >
                <p className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  <span className={`size-2 rounded-full ${column.dot}`} />
                  {column.name}
                  <span className="text-neutral-400">
                    {column.tasks.length}
                  </span>
                </p>
                <ul className="mt-3 space-y-2">
                  {column.tasks.map((task) => (
                    <li
                      key={task.title}
                      className="rounded-lg border border-neutral-200 bg-background p-3 shadow-xs dark:border-neutral-800"
                    >
                      <p
                        className={`text-sm ${
                          column.name === "Done"
                            ? "text-neutral-400 line-through"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          {task.tag}
                        </span>
                        {task.due && (
                          <span className="font-mono text-[11px] text-neutral-500">
                            {task.due}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
