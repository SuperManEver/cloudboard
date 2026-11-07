import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Amplify Data: an AppSync GraphQL API backed by one DynamoDB table per model.
 *
 * Every model uses owner-based authorization: AppSync stores the creator's
 * Cognito identity in `owner` and only lets that user read or change the
 * record. There are no guest, public or API-key rules.
 *
 * The explicit `owner` field is limited to read and delete, so nobody can
 * hand a record to another user by updating `owner`.
 *
 * `Project.tasks` / `Task.project` make Amplify add a global secondary index
 * on `Task.projectId`, so a project's tasks are read with a DynamoDB Query
 * instead of a Scan.
 *
 * @see https://docs.amplify.aws/nextjs/build-a-backend/data/
 */
const schema = a.schema({
  TaskStatus: a.enum(["TODO", "IN_PROGRESS", "DONE"]),

  Project: a
    .model({
      name: a.string().required(),
      tasks: a.hasMany("Task", "projectId"),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),

  Task: a
    .model({
      title: a.string().required(),
      description: a.string(),
      status: a.ref("TaskStatus").required(),
      dueDate: a.date(),
      projectId: a.id().required(),
      project: a.belongsTo("Project", "projectId"),
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
