import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getSignedInEmail } from "@/lib/amplify-server";

/**
 * Every page here reads the signed-in user's data. `cookiesClient` reads the
 * auth cookies lazily, so Next.js can't detect that on its own and would
 * prerender the pages at build time. This applies to all routes below.
 */
export const dynamic = "force-dynamic";

/** Shared shell for `/dashboard` and project pages. Protected by middleware. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getSignedInEmail();

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" aria-label="CloudBoard dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            {email && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {email}
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
        <Separator />
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
