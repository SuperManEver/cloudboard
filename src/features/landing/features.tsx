import {
  Cloud,
  Folder,
  Lock,
  SquareCheck,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Status = "Live" | "Phase 3";

const statusVariant: Record<Status, ComponentProps<typeof Badge>["variant"]> = {
  Live: "default",
  "Phase 3": "outline",
};

type Feature = {
  title: string;
  description: string;
  status: Status;
  icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: "Projects that stay organized",
    description:
      "Group related work into projects and see everything you're juggling at a glance.",
    status: "Phase 3",
    icon: Folder,
  },
  {
    title: "Tasks with clear status",
    description:
      "Move tasks from to do to in progress to done, and always know what to pick up next.",
    status: "Phase 3",
    icon: SquareCheck,
  },
  {
    title: "Sign in with Google or email",
    description:
      "Continue with your Google account in one click, or use an email and password. Accounts are handled by Amazon Cognito.",
    status: "Live",
    icon: User,
  },
  {
    title: "Private by default",
    description:
      "Every project and task belongs to your account. Nobody else can read or change your data.",
    status: "Phase 3",
    icon: Lock,
  },
  {
    title: "Serverless on AWS",
    description:
      "Hosted on AWS Amplify with Amazon Cognito accounts, so there are no servers to maintain and it scales on demand.",
    status: "Live",
    icon: Cloud,
  },
  {
    title: "Fast by default",
    description:
      "Pages are rendered on the server with Next.js, so the app loads quickly on any device.",
    status: "Live",
    icon: Zap,
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-8 border-t py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline">Features</Badge>
          <h2
            id="features-heading"
            className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Everything you need to finish what you start
          </h2>
          <p className="mt-4 text-lg leading-8 text-pretty text-muted-foreground">
            CloudBoard is being built in phases. The foundation is live, and
            each card shows when its feature arrives.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, status, icon: Icon }) => (
            <li key={title}>
              <Card className="h-full">
                <CardHeader>
                  <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <CardAction>
                    <Badge variant={statusVariant[status]}>{status}</Badge>
                  </CardAction>
                  <CardTitle>
                    <h3>{title}</h3>
                  </CardTitle>
                  <CardDescription className="col-span-full leading-6">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
