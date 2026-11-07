# CloudBoard

CloudBoard is an app for managing personal projects and tasks. It's a learning project, but it's structured like production SaaS. The main goal is hands-on experience with AWS: Amplify Gen 2, Cognito, DynamoDB, Lambda, API Gateway, and infrastructure as code with TypeScript and CDK.

The app is built in phases. **Phase 2 (current)** adds authentication with Amazon Cognito: email/password and Google sign-in, sign-out, and a protected dashboard. There is no application data yet.

## Tech stack

| Area     | Technology                                             |
| -------- | ------------------------------------------------------ |
| Runtime  | Node.js 24 (via NVM), npm                              |
| Frontend | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling  | Tailwind CSS 4, shadcn/ui (Radix, Lucide icons)        |
| Backend  | AWS Amplify Gen 2 (TypeScript, built on AWS CDK)       |
| Auth     | Amazon Cognito (email/password, Google federation)     |
| Linting  | ESLint 9 (`eslint-config-next`)                        |
| Format   | Prettier 3 (default options)                           |

## Prerequisites

- [NVM](https://github.com/nvm-sh/nvm)
- AWS CLI v2. You only need it for the cloud sandbox.
- An AWS account you're allowed to deploy to, signed in with `aws login` as a non-root IAM user. Don't use the root account or long-lived access keys. See [AWS profile](#aws-profile).

## Setup

```bash
# Node.js 24, as pinned in .nvmrc. Only affects the current shell.
nvm install
nvm use
node -v   # v24.x

# Dependencies (use the committed package-lock.json)
npm install
```

## Local development

```bash
npm run dev
```

Open http://localhost:3000. The frontend runs locally, but auth talks to the Cognito user pool in your [cloud sandbox](#cloud-sandbox). The app reads that sandbox's IDs from `amplify_outputs.json`, so deploy the sandbox once before the first `npm run dev`. `npm run build` and `npm run typecheck` also need the file.

### Day-to-day workflow

The Next.js dev server runs locally, while the backend runs in your [cloud sandbox](#cloud-sandbox). You only need the sandbox watcher running when you're changing the backend.

**Working on the backend (`amplify/`):** use two terminals.

```bash
# Terminal 1: redeploys the sandbox on every change in amplify/
nvm use
npx ampx sandbox --profile default

# Terminal 2: frontend with hot reload
nvm use
npm run dev
```

After each redeploy the sandbox rewrites `amplify_outputs.json`, and the dev server picks up the change.

**Working on the frontend only:** run just `npm run dev`. Stopping the sandbox watcher (`Ctrl+C`) leaves the deployed resources and `amplify_outputs.json` in place, so the app keeps using the same backend.

Start the sandbox again when:

- you change anything in `amplify/`;
- you pull or check out backend changes;
- `amplify_outputs.json` is missing (fresh clone or new machine).

Things to watch:

- **Region:** the sandbox deploys to the region of the profile you pass. If the profile has no region or the wrong one, set it with `aws configure set region us-east-1 --profile default`, or prefix a single command with `AWS_REGION=us-east-1`. The sandbox banner shows the region it's using.
- **Expired session:** when the sandbox fails with a credentials error, run `aws login --profile default` and start it again.

## Quality checks

```bash
npm run lint          # ESLint
npm run format:check  # Prettier, check only
npm run format        # Prettier, rewrite files
npm run typecheck     # tsc --noEmit
npm run build         # production build
```

## Project structure

```text
.
├── amplify/                 # Amplify Gen 2 backend (TypeScript / CDK)
│   ├── auth/resource.ts     # Cognito: email/password + Google, OAuth redirect URLs
│   ├── data/resource.ts     # Placeholder: no data models yet
│   ├── backend.ts           # Backend entry point: registers resources
│   ├── package.json         # Marks the backend as an ES module
│   └── tsconfig.json
├── src/
│   ├── app/                 # App Router routes
│   │   ├── (auth)/          # /sign-in, /sign-up, /oauth/callback
│   │   ├── dashboard/       # Protected page
│   │   └── page.tsx         # Landing page
│   ├── components/ui/       # shadcn/ui and other feature-agnostic UI components
│   ├── features/            # Feature modules (landing, auth, ...)
│   ├── lib/                 # Amplify client and server configuration, utils
│   ├── middleware.ts        # Route protection
│   └── types/               # Shared TypeScript types
├── .nvmrc                   # Node.js 24
└── package.json
```

Conventions:

- Server Components by default. Add `"use client"` only when a component needs interactivity or browser APIs.
- AWS/Amplify configuration goes in `src/lib`, never inside UI components.
- UI components come from shadcn/ui (`npx shadcn@latest add <name>`), not hand-written equivalents.

## Authentication

### Backend

- **Auth:** `amplify/auth/resource.ts` sets up a Cognito user pool with email/password sign-in and Google as a federated identity provider. The Google client ID and secret are Amplify secrets (see [Google sign-in setup](#google-sign-in-setup)). Guest (unauthenticated) identities in the Cognito identity pool are disabled in `backend.ts`.
- **Data:** the initializer's sample `Todo` model let any unauthenticated user create, read, update and delete records, so it was removed. `defineData` needs at least one model, so `data` isn't registered in `backend.ts` yet. The real models will come with owner-based authorization.

### Frontend

- `src/lib/amplify-client.ts` configures Amplify in the browser with `ssr: true`, so tokens are stored in cookies. Client Components that call Amplify import it for its side effect.
- `src/lib/amplify-server.ts` reads the session on the server (middleware, Server Components) through `@aws-amplify/adapter-nextjs`.
- `src/middleware.ts` sends signed-out users from `/dashboard` to `/sign-in`, and signed-in users from `/sign-in` and `/sign-up` to `/dashboard`.

### Flows

- **Email/password:** `/sign-up` → Cognito emails a confirmation code → enter it → signed in and sent to `/dashboard`.
- **Google:** the app redirects to the Cognito domain, Cognito redirects to Google, and Google returns to Cognito at `https://<cognito-domain>/oauth2/idpresponse`. Cognito exchanges Google's code for its own tokens and redirects to `/oauth/callback`, which finishes sign-in and opens `/dashboard`. The app only ever receives Cognito tokens.
- **Sign-out** clears the session (and the Cognito domain session for Google users) and returns to `/`.

Google users appear in the user pool as `google_<id>` with status `EXTERNAL_PROVIDER`. Cognito doesn't link accounts automatically: signing up with email/password using the same address as a Google account creates a second, separate user.

## Google sign-in setup

One-time setup per environment. The sandbox deploy fails until both secrets exist.

1. **Consent screen.** In Google Cloud console → Google Auth Platform, click **Get started**. Choose audience **External**. While the app's publishing status is "Testing", only accounts listed under **Audience → Test users** can sign in, so add yourself there.
2. **OAuth client.** Under **Clients → Create client**, choose **Web application**. Add `http://localhost:3000` as an authorized JavaScript origin. Copy the client secret when the client is created, because Google shows it only once.
3. **Secrets.** Each command prompts for the value. The ID ends in `.apps.googleusercontent.com`, and the secret starts with `GOCSPX-`. If the two are swapped, Google answers `Error 401: invalid_client`.

   ```bash
   npx ampx sandbox secret set GOOGLE_CLIENT_ID --profile default
   npx ampx sandbox secret set GOOGLE_CLIENT_SECRET --profile default
   npx ampx sandbox secret list --profile default   # names only
   ```

   Secrets are stored in SSM Parameter Store and read only at deploy time, so redeploy the sandbox after changing them.

4. **Deploy** the sandbox, then copy the Cognito domain from `auth.oauth.domain` in `amplify_outputs.json`.
5. **Redirect URI.** Add `https://<cognito-domain>/oauth2/idpresponse` to the Google client's authorized redirect URIs. If Google rejects the domain, add `amazoncognito.com` under **Branding → Authorized domains**.

**Deployed branches** (Amplify Hosting) use their own Cognito user pool:

- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Amplify console → Hosting → Secrets.
- Add that pool's `/oauth2/idpresponse` URL to the Google client.
- Any new app origin (branch domain, custom domain) must be added to `appOrigins` in `amplify/auth/resource.ts` and to the client's JavaScript origins.

## AWS profile

Amplify deploys with your local AWS credentials. This project uses the `default` profile, signed in with `aws login` as a non-root IAM user (console credentials). `aws login` issues short-lived credentials, so no access keys are stored on disk.

```bash
aws login --profile default                        # sign in; run again when the session expires
aws configure set region us-east-1 --profile default
aws sts get-caller-identity --profile default      # check account and user
```

The user needs permission to deploy CloudFormation stacks and create the resources they define, including IAM roles. Amplify's documentation recommends the `AmplifyBackendDeployFullAccess` managed policy. A read-only or service-specific role is not enough.

Always pass `--profile default` explicitly. If `AWS_PROFILE` is set in your shell (for example to another organization's read-only profile), it would otherwise take priority.

## Cloud sandbox

> **The Amplify sandbox is not a local emulator.** It deploys real resources (CloudFormation, Cognito and so on) to your AWS account. They can cost money and stay until you delete them.

The first deployment to an account/region may ask you to bootstrap CDK. The CLI links to the console flow for this.

```bash
npx ampx sandbox --profile default
```

This deploys a per-developer stack (`amplify-cloudboard-<user>-sandbox-<hash>`), watches `amplify/` for changes and redeploys them, and writes `amplify_outputs.json` to the project root. That file is git-ignored, and the frontend reads it. Add `--once` to deploy a single time and exit without watching.

Verify the stack:

```bash
aws cloudformation list-stacks --profile default \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --query "StackSummaries[?starts_with(StackName, 'amplify-cloudboard')].StackName"
```

### Stopping vs. deleting

- **Stop the sandbox process:** press `Ctrl+C` in the terminal running `npx ampx sandbox`. This only stops the file watcher. **The AWS resources keep running.**
- **Delete the cloud resources** when you intentionally want to clean up:

  ```bash
  npx ampx sandbox delete --profile default
  ```

  This destroys the sandbox stack and everything in it.

## Roadmap

### Phase 1 — Foundation (done)

- Next.js, TypeScript, Tailwind, ESLint and Prettier setup; Amplify Gen 2 backend scaffold; Amplify Hosting build spec.

### Phase 2 — Google authentication with Amazon Cognito (current)

- Create a Google OAuth client in Google Cloud.
- Store the client ID and secret as Amplify sandbox secrets (`npx ampx sandbox secret set`), never in the repository.
- Add Google as an external provider in `amplify/auth/resource.ts`, with callback and logout URLs.
- Configure Amplify on the frontend (`src/lib`) using `amplify_outputs.json` and `@aws-amplify/adapter-nextjs` for server-side auth.
- Add sign-in and sign-out, and protected routes.

Later phases add project and task data models (DynamoDB via Amplify Data), Lambda functions, and API Gateway.
