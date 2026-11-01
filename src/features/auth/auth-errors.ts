const messages: Record<string, string> = {
  NotAuthorizedException: "Incorrect email or password.",
  UserNotFoundException: "Incorrect email or password.",
  UsernameExistsException:
    "An account with this email already exists. Sign in instead.",
  CodeMismatchException:
    "That code isn't right. Check the email we sent and try again.",
  ExpiredCodeException: "This code has expired. Request a new one.",
  LimitExceededException: "Too many attempts. Wait a moment and try again.",
  TooManyRequestsException: "Too many attempts. Wait a moment and try again.",
  TooManyFailedAttemptsException:
    "Too many attempts. Wait a moment and try again.",
  OAuthNotConfigureException:
    "Google sign-in isn't available right now. Use your email and password instead.",
};

/** Turns an Amplify/Cognito error into a message that's safe to show. */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return messages[error.name] ?? error.message;
  }
  return "Something went wrong. Please try again.";
}
