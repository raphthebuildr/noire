import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";

export const instant = false;

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your NOIRÉ account.",
};

type SearchParams = Promise<{ next?: string | string[] }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/account");
  }

  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back."
      intro="Sign in to track orders, save addresses and return to your favourites."
      footer={
        <p>
          New to NOIRÉ?{" "}
          <Link href="/register" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
        </p>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
