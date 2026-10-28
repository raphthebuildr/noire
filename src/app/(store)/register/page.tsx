import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthAside, AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentUser } from "@/lib/auth";

export const instant = false;

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a NOIRÉ account.",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/account");
  }

  return (
    <AuthShell
      eyebrow="New membership"
      title="Create an account."
      intro="A quieter way to keep track of what you wear. Save addresses and view your order history."
      aside={<AuthAside mode="register" />}
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
