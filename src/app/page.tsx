const roadmap = [
  {
    phase: "Phase 2",
    title: "Authentication",
    description: "Sign in with Google through Amazon Cognito.",
  },
  {
    phase: "Phase 3",
    title: "Projects and tasks",
    description: "Create and organize personal projects and their tasks.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16 sm:px-8">
      <header>
        <p className="font-mono text-sm tracking-wide text-sky-600 dark:text-sky-400">
          CloudBoard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Personal project and task management
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:text-lg">
          A small SaaS application built on Next.js and AWS Amplify Gen 2.
        </p>
      </header>

      <section
        aria-labelledby="status-heading"
        className="mt-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h2 id="status-heading" className="text-sm font-medium">
          In development
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          The project foundation is in place. Authentication and project
          management arrive in upcoming phases.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {roadmap.map((item) => (
            <li
              key={item.phase}
              className="rounded-lg border border-neutral-200 bg-background p-4 dark:border-neutral-800"
            >
              <p className="font-mono text-xs text-neutral-500">{item.phase}</p>
              <p className="mt-1 font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
