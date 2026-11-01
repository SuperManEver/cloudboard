import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="self-center" aria-label="CloudBoard home">
          <Logo />
        </Link>
        {children}
      </div>
    </div>
  );
}
