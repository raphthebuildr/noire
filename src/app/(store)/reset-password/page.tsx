import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/auth";

export const instant = false;

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Choose a new password for your NOIRÉ account.",
};

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <AuthShell
        eyebrow="Account"
        title="Link expired."
        intro="This password reset link is no longer valid. Request a new link to continue."
        footer={
          <p>
            Need help?{" "}
            <Link href="/contact" className="text-ink underline underline-offset-4">
              Contact us
            </Link>
          </p>
        }
      >
        <Link
          href="/forgot-password"
          className="label inline-flex h-12 items-center justify-center bg-ink px-6 text-[11px] text-canvas transition-opacity hover:opacity-90"
        >
          Request a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Choose a new password."
      intro="Use at least 8 characters. A longer, unique password is best."
      footer={
        <p>
          Changed your mind?{" "}
          <Link href="/account" className="text-ink underline underline-offset-4">
            Back to account
          </Link>
        </p>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
