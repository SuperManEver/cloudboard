"use client";

import "@/lib/amplify-client";

import { resendSignUpCode, signIn } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getAuthErrorMessage } from "../auth-errors";
import { ConfirmSignUpForm } from "./confirm-sign-up-form";
import { GoogleButton } from "./google-button";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function signInWithPassword() {
    const { nextStep } = await signIn({ username: email, password });

    if (nextStep.signInStep === "DONE") {
      router.replace("/dashboard");
      return;
    }
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      // The account exists but the email was never verified.
      await resendSignUpCode({ username: email });
      setNeedsConfirmation(true);
      setPending(false);
      return;
    }
    throw new Error("This account needs a step that isn't supported yet.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await signInWithPassword();
    } catch (err) {
      if (
        err instanceof Error &&
        err.name === "UserAlreadyAuthenticatedException"
      ) {
        router.replace("/dashboard");
        return;
      }
      setError(getAuthErrorMessage(err));
      setPending(false);
    }
  }

  if (needsConfirmation) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify your email</CardTitle>
          <CardDescription>
            Your account isn&apos;t verified yet. We sent you a new code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmSignUpForm
            email={email}
            onConfirmed={async () => {
              await signInWithPassword();
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your CloudBoard account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Field>
              <GoogleButton
                label="Continue with Google"
                disabled={pending}
                onError={setError}
              />
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with email
            </FieldSeparator>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            <Field>
              <Button type="submit" size="lg" disabled={pending}>
                {pending && <Spinner data-icon="inline-start" />}
                Sign in
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
