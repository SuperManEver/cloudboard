import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Origins allowed to start and finish OAuth sign-in. Cognito redirects back to
 * `/oauth/callback` after Google sign-in and to `/` after sign-out.
 */
const appOrigins = [
  "http://localhost:3000",
  "https://main.d3ampog09dkb7s.amplifyapp.com",
];

/**
 * Cognito user pool with email/password sign-in and Google federation.
 *
 * The Google OAuth client ID and secret are Amplify secrets, never stored in
 * the repository:
 * - sandbox: `npx ampx sandbox secret set GOOGLE_CLIENT_ID --profile default`
 *   (and `GOOGLE_CLIENT_SECRET`)
 * - deployed branches: Amplify console → Hosting → Secrets
 *
 * @see https://docs.amplify.aws/nextjs/build-a-backend/auth/concepts/external-identity-providers/
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes: ["openid", "email", "profile"],
        attributeMapping: {
          email: "email",
        },
      },
      callbackUrls: appOrigins.map((origin) => `${origin}/oauth/callback`),
      logoutUrls: appOrigins.map((origin) => `${origin}/`),
    },
  },
});
