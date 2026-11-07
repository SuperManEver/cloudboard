import type { Schema } from "../../amplify/data/resource";

export type { Schema };

export type TaskStatus = Schema["TaskStatus"]["type"];

/**
 * Plain, serializable shapes passed from Server Components to Client
 * Components. Model types from the Amplify client include lazy-loader
 * functions for relationships, which can't cross that boundary.
 */
export type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
};

/** Return value of Server Actions used with `useActionState`. */
export type ActionState = {
  error?: string;
};
