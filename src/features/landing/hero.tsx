import { ButtonLink } from "@/components/ui/button-link";
import { Logo } from "@/components/ui/logo";
import { BoardPreview } from "./board-preview";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-120 w-240 max-w-none -translate-x-1/2 -translate-y-1/3 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10"
      />

      <div className="mx-auto max-w-6xl px-6 pt-10 text-center sm:pt-12">
        <Logo />

        <div className="pt-16 sm:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-background/70 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            <span className="size-1.5 rounded-full bg-sky-500" />
            In development · Google sign-in is next
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Every project and task, on one calm board
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-pretty text-neutral-600 dark:text-neutral-400">
            CloudBoard keeps your personal projects and their tasks in one
            place, so you always know what&apos;s next, what&apos;s in progress
            and what&apos;s done.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="#features">Explore features</ButtonLink>
            <ButtonLink href="#features" variant="secondary">
              What&apos;s coming next
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pt-20">
        <BoardPreview />
      </div>
    </section>
  );
}
