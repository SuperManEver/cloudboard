import type { ReactNode } from "react";

type Status = "Live" | "Next" | "Phase 3";

type Feature = {
  title: string;
  description: string;
  status: Status;
  icon: ReactNode;
};

const statusStyles: Record<Status, string> = {
  Live: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  Next: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
  "Phase 3":
    "bg-neutral-100 text-neutral-600 ring-neutral-500/20 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-400/20",
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      {children}
    </svg>
  );
}

const features: Feature[] = [
  {
    title: "Projects that stay organized",
    description:
      "Group related work into projects and see everything you're juggling at a glance.",
    status: "Phase 3",
    icon: (
      <Icon>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </Icon>
    ),
  },
  {
    title: "Tasks with clear status",
    description:
      "Move tasks from to do to in progress to done, and always know what to pick up next.",
    status: "Phase 3",
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m8 12 2.5 2.5L16 9" />
      </Icon>
    ),
  },
  {
    title: "Sign in with Google",
    description:
      "One click to get started. Accounts are handled by Amazon Cognito, with no new password to remember.",
    status: "Next",
    icon: (
      <Icon>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </Icon>
    ),
  },
  {
    title: "Private by default",
    description:
      "Every project and task belongs to your account. Nobody else can read or change your data.",
    status: "Phase 3",
    icon: (
      <Icon>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </Icon>
    ),
  },
  {
    title: "Serverless on AWS",
    description:
      "Hosted on AWS Amplify with Amazon Cognito accounts, so there are no servers to maintain and it scales on demand.",
    status: "Live",
    icon: (
      <Icon>
        <path d="M7 18a4 4 0 0 1-.6-7.95 6 6 0 0 1 11.5-1.6A4.5 4.5 0 0 1 17.5 18Z" />
      </Icon>
    ),
  },
  {
    title: "Fast by default",
    description:
      "Pages are rendered on the server with Next.js, so the app loads quickly on any device.",
    status: "Live",
    icon: (
      <Icon>
        <path d="M13 3 5 14h6l-1 7 8-11h-6Z" />
      </Icon>
    ),
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-8 border-t border-neutral-200 py-24 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm text-sky-600 dark:text-sky-400">
            Features
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Everything you need to finish what you start
          </h2>
          <p className="mt-4 text-lg leading-8 text-pretty text-neutral-600 dark:text-neutral-400">
            CloudBoard is being built in phases. The foundation is live, and
            each card shows when its feature arrives.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                  {feature.icon}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[feature.status]}`}
                >
                  {feature.status}
                </span>
              </div>
              <h3 className="mt-5 font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
