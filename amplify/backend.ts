import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

/**
 * @see https://docs.amplify.aws/nextjs/build-a-backend/ to add storage, functions, and more
 *
 * `data` (./data/resource.ts) is registered once the first model is defined.
 */
const backend = defineBackend({
  auth,
});

// No guest (unauthenticated) AWS credentials from the identity pool.
backend.auth.resources.cfnResources.cfnIdentityPool.allowUnauthenticatedIdentities =
  false;
