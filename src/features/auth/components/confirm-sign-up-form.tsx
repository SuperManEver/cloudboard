"use client";

import "@/lib/amplify-client";

import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { getAuthErrorMessage } from "../auth-errors";

const CODE_LENGTH = 6;

type ConfirmSignUpFormProps = {
  email: string;
  /** Called after Cognito accepts the code. */
  onConfirmed: (
    nextStep: Awaited<ReturnType<typeof confirmSignUp>>["nextStep"],
  ) => Promise<void>;
};

export function ConfirmSignUpForm({
  email,
  onConfirmed,
}: ConfirmSignUpFormProps) {
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      const { nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      await onConfirmed(nextStep);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setPending(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);
    try {
      await resendSignUpCode({ username: email });
      setNotice("We sent a new code.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {notice && (
          <Alert>
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        )}
        <Field>
          <FieldLabel htmlFor="code">Verification code</FieldLabel>
          <InputOTP
            id="code"
            maxLength={CODE_LENGTH}
            pattern={REGEXP_ONLY_DIGITS}
            value={code}
            onChange={setCode}
            autoComplete="one-time-code"
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription className="text-center">
            Enter the 6-digit code we sent to {email}.
          </FieldDescription>
        </Field>
        <Field>
          <Button
            type="submit"
            size="lg"
            disabled={pending || code.length < CODE_LENGTH}
          >
            {pending && <Spinner data-icon="inline-start" />}
            Verify email
          </Button>
          <Button
            type="button"
            variant="link"
            disabled={pending}
            onClick={handleResend}
          >
            Resend code
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
