import { defineAuth } from '@aws-amplify/backend';

/**
 * Cognito user pool scaffold (default email sign-in).
 * Google federation is configured in Phase 2.
 *
 * @see https://docs.amplify.aws/nextjs/build-a-backend/auth/
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
