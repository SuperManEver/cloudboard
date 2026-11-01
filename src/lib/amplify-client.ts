import { Amplify } from "aws-amplify";
// Completes Google sign-in when Cognito redirects back to the app.
import "aws-amplify/auth/enable-oauth-listener";

import outputs from "../../amplify_outputs.json";

/**
 * Browser-side Amplify configuration. Import this module for its side effect
 * from Client Components that call Amplify APIs. Keeping it out of the root
 * layout means pages that don't use auth (like the landing page) don't load
 * the Amplify bundle.
 *
 * `ssr: true` stores tokens in cookies so the server (middleware, Server
 * Components) can read the session through `amplify-server.ts`.
 */
Amplify.configure(outputs, { ssr: true });
