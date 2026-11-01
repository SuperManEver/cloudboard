import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 shrink-0">
        <rect width="24" height="24" rx="6" className="fill-primary" />
        <path
          d="M8 17.5a3 3 0 0 1-.4-5.97 4.5 4.5 0 0 1 8.65-1.2A3.5 3.5 0 0 1 16 17.5Z"
          className="fill-primary-foreground"
        />
      </svg>
      CloudBoard
    </span>
  );
}
