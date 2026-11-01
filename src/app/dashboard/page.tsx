import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getSignedInEmail } from "@/lib/amplify-server";

export const metadata: Metadata = {
  title: "Dashboard · CloudBoard",
};

/** Protected by middleware. Projects and tasks arrive in Phase 3. */
export default async function DashboardPage() {
  const email = await getSignedInEmail();

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="CloudBoard home">
            <Logo />
          </Link>
          <SignOutButton />
        </div>
        <Separator />
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">You&apos;re signed in</CardTitle>
            <CardDescription>
              {email ? <>Signed in as {email}. </> : null}
              Projects and tasks are coming in the next phase.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
