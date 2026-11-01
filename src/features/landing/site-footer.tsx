import { Logo } from "@/components/ui/logo";

const repoUrl = "https://github.com/SuperManEver/cloudboard";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Roadmap", href: `${repoUrl}#roadmap` },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Changelog", href: `${repoUrl}/commits/main` },
      { label: "Report an issue", href: `${repoUrl}/issues` },
    ],
  },
];

const linkClass =
  "rounded-sm text-sm text-neutral-600 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-neutral-400";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-pretty text-neutral-600 dark:text-neutral-400">
              Personal projects and tasks, organized on one calm board.
            </p>
            <a
              href={repoUrl}
              className={`mt-6 inline-flex items-center gap-2 ${linkClass}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-5 fill-current"
              >
                <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.9c.85 0 1.7.12 2.5.34 1.9-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.6.69.49A10.12 10.12 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
              </svg>
              View on GitHub
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:gap-16">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-medium">{group.title}</p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-neutral-200 pt-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
          <p>© {new Date().getFullYear()} CloudBoard</p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Built with Next.js · Hosted on AWS Amplify
          </p>
        </div>
      </div>
    </footer>
  );
}
