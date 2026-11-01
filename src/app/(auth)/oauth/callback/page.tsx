import type { Metadata } from "next";

import { OAuthCallback } from "@/features/auth/components/oauth-callback";

export const metadata: Metadata = {
  title: "Signing in · CloudBoard",
};

export default function OAuthCallbackPage() {
  return <OAuthCallback />;
}
