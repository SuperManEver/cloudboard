"use client";

import "@/lib/amplify-client";

import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

/**
 * Landing spot for Cognito after Google sign-in. Amplify's OAuth listener
 * exchanges the code for tokens; this waits for the result and moves on.
 */
export function OAuthCallback() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stopListening = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signInWithRedirect") {
        router.replace("/dashboard");
      }
      if (payload.event === "signInWithRedirect_failure") {
        setFailed(true);
      }
    });

    // The exchange may have finished before the listener was attached.
    getCurrentUser()
      .then(() => router.replace("/dashboard"))
      .catch(() => {});

    return stopListening;
  }, [router]);

  return (
    <Card>
      <CardContent>
        {failed ? (
          <div className="flex flex-col gap-4">
            <Alert variant="destructive">
              <AlertTitle>Google sign-in didn&apos;t complete</AlertTitle>
              <AlertDescription>
                The sign-in was cancelled or something went wrong. Please try
                again.
              </AlertDescription>
            </Alert>
            <Button asChild size="lg">
              <Link href="/sign-in">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <p className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <Spinner />
            Signing you in…
          </p>
        )}
      </CardContent>
    </Card>
  );
}
