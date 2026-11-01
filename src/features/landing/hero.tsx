import { ArrowRight } from "lucide-react";
import Link from "next/link";

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

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <Link href="/" aria-label="CloudBoard home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="pt-20 sm:pt-28">
          <Badge variant="outline" className="bg-background/70">
            <span className="size-1.5 rounded-full bg-primary" />
            Early access · Sign in with Google or email
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
              <Link href="/sign-up">
                Get started for free
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Explore features</a>
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
