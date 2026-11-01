"use client";

import "@/lib/amplify-client";

import { signOut } from "aws-amplify/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    // Google sessions also sign out of the Cognito domain, which redirects
    // back to "/". Email sessions resolve here.
    await signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <Button variant="outline" disabled={pending} onClick={handleClick}>
      {pending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <LogOut data-icon="inline-start" />
      )}
      Sign out
    </Button>
  );
}
