import type { ReactNode } from "react";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

const variants = {
  primary:
    "bg-sky-600 text-white shadow-sm hover:bg-sky-700 dark:bg-sky-500 dark:text-neutral-950 dark:hover:bg-sky-400",
  secondary:
    "border border-neutral-300 bg-background text-foreground hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
};

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof variants;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: ButtonLinkProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </a>
  );
}
