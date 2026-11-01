# CloudBoard

CloudBoard is an app for managing personal projects and tasks. It's a learning project, but it's structured like production SaaS. The main goal is hands-on experience with AWS: Amplify Gen 2, Cognito, DynamoDB, Lambda, API Gateway, and infrastructure as code with TypeScript and CDK.

The app is built in phases. **Phase 1 (current)** sets up the foundation only: no authentication flows and no application data yet.

## Tech stack

| Area     | Technology                                             |
| -------- | ------------------------------------------------------ |
| Runtime  | Node.js 24 (via NVM), npm                              |
| Frontend | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling  | Tailwind CSS 4                                         |
| Backend  | AWS Amplify Gen 2 (TypeScript, built on AWS CDK)       |
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

Open http://localhost:3000. The frontend runs locally without AWS until it needs backend resources (Phase 2 onwards).

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
│   ├── auth/resource.ts     # Cognito user pool (default email sign-in scaffold)
│   ├── data/resource.ts     # Placeholder: no data models yet
│   ├── backend.ts           # Backend entry point: registers resources
│   ├── package.json         # Marks the backend as an ES module
│   └── tsconfig.json
├── src/
│   ├── app/                 # App Router: layout.tsx, page.tsx, globals.css
│   ├── components/ui/       # Reusable, feature-agnostic UI components
│   ├── features/            # Feature modules (auth, projects, tasks, ...)
│   ├── lib/                 # Non-UI code, e.g. Amplify client configuration
│   └── types/               # Shared TypeScript types
├── .nvmrc                   # Node.js 24
└── package.json
```

Conventions:

- Server Components by default. Add `"use client"` only when a component needs interactivity or browser APIs.
- AWS/Amplify configuration goes in `src/lib`, never inside UI components.

### Amplify backend in Phase 1

- **Auth:** `defineAuth` with the default email login. This is scaffolding only: no sign-in UI and no custom configuration. Guest (unauthenticated) identities in the Cognito identity pool are disabled in `backend.ts`.
- **Data:** the initializer's sample `Todo` model let any unauthenticated user create, read, update and delete records, so it was removed. `defineData` needs at least one model, so `data` isn't registered in `backend.ts` yet. The real models will come with owner-based authorization.

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

This deploys a per-developer stack (`amplify-cloudboard-<user>-sandbox-<hash>`), watches `amplify/` for changes and redeploys them, and writes `amplify_outputs.json` to the project root. That file is git-ignored. The frontend reads it from Phase 2 onwards.

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

### Phase 2 — Google authentication with Amazon Cognito

- Create a Google OAuth client in Google Cloud.
- Store the client ID and secret as Amplify sandbox secrets (`npx ampx sandbox secret set`), never in the repository.
- Add Google as an external provider in `amplify/auth/resource.ts`, with callback and logout URLs.
- Configure Amplify on the frontend (`src/lib`) using `amplify_outputs.json` and `@aws-amplify/adapter-nextjs` for server-side auth.
- Add sign-in and sign-out, and protected routes.

Later phases add project and task data models (DynamoDB via Amplify Data), Lambda functions, and API Gateway.
