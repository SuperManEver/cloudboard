import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession } from "aws-amplify/auth/server";
import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import outputs from "../../amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

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
