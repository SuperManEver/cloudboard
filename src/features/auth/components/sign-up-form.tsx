"use client";

import "@/lib/amplify-client";

import { autoSignIn, signUp } from "aws-amplify/auth";
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

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
          // Signs the user in right after they confirm their email.
          autoSignIn: true,
        },
      });
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setNeedsConfirmation(true);
        setPending(false);
        return;
      }
      router.replace("/sign-in");
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setPending(false);
    }
  }

  if (needsConfirmation) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            One last step: confirm it&apos;s really you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmSignUpForm
            email={email}
            onConfirmed={async (nextStep) => {
              if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
                const { isSignedIn } = await autoSignIn();
                if (isSignedIn) {
                  router.replace("/dashboard");
                  return;
                }
              }
              router.replace("/sign-in");
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Start organizing your projects in minutes
        </CardDescription>
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
                label="Sign up with Google"
                disabled={pending}
                onError={setError}
              />
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or sign up with email
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
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <FieldDescription>
                At least 8 characters, with upper and lower case letters, a
                number and a symbol.
              </FieldDescription>
            </Field>
            <Field>
              <Button type="submit" size="lg" disabled={pending}>
                {pending && <Spinner data-icon="inline-start" />}
                Create account
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/sign-in">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
