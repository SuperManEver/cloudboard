import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { fetchAuthSession } from "aws-amplify/auth/server";
import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Schema } from "@/types/data";
import outputs from "../../amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

/**
 * Amplify Data (AppSync) client for Server Components and Server Actions.
 * Requests are signed with the user's Cognito tokens from the auth cookies,
 * so AppSync's owner rules decide what each call can see or change.
 */
export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

type DataResult<T> = {
  data: T;
  errors?: readonly { message: string; errorType: string }[];
};

/**
 * Amplify Data calls report GraphQL errors in `errors` instead of throwing.
 * Returns `data`, or throws with the first error's message.
 */
export function unwrap<T>({ data, errors }: DataResult<T>): T {
  if (errors?.length) {
    throw new Error(errors[0].message);
  }
  return data;
}

/** True when AppSync rejected the call because the record isn't the user's. */
export function isUnauthorized(errors: DataResult<unknown>["errors"]) {
  return errors?.some((error) => error.errorType === "Unauthorized") ?? false;
}

/**
 * Checks the session in middleware. Pass the outgoing `response` so refreshed
 * tokens are written back as cookies.
 */
export async function isSignedInFromRequest(
  request: NextRequest,
  response: NextResponse,
): Promise<boolean> {
  return runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch {
        return false;
      }
    },
  });
}

/** Returns the signed-in user's email in Server Components, or null. */
export async function getSignedInEmail(): Promise<string | null> {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        const email = session.tokens?.idToken?.payload.email;
        return typeof email === "string" ? email : null;
      } catch {
        return null;
      }
    },
  });
}
