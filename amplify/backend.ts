import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

/**
 * @see https://docs.amplify.aws/nextjs/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

// No guest (unauthenticated) AWS credentials from the identity pool.
backend.auth.resources.cfnResources.cfnIdentityPool.allowUnauthenticatedIdentities = false;
