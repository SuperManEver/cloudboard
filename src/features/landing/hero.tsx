import { ArrowDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-120 w-240 max-w-none -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10"
      />

      <div className="mx-auto max-w-6xl px-6 pt-10 text-center sm:pt-12">
        <Logo />

        <div className="pt-16 sm:pt-24">
          <Badge variant="outline" className="bg-background/70">
            <span className="size-1.5 rounded-full bg-primary" />
            In development · Google sign-in is next
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Every project and task, on one calm board
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-pretty text-muted-foreground">
            CloudBoard keeps your personal projects and their tasks in one
            place, so you always know what&apos;s next, what&apos;s in progress
            and what&apos;s done.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#features">
                Explore features
                <ArrowDown data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">What&apos;s coming next</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pt-20">
        <BoardPreview />
      </div>
    </section>
  );
}
