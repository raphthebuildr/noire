import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/account/profile-form";
import { logoutAction } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Account settings",
  description: "Update your NOIRÉ account details.",
};

type Profile = {
  full_name: string | null;
  phone: string | null;
};

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();
  let profile: Profile | null = null;

  if (supabase && user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    profile = (data as Profile | null) ?? null;
  }

  const fullName =
    profile?.full_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    "";

  return (
    <div>
      <div className="border-b border-line pb-4">
        <span className="eyebrow text-muted">Account</span>
        <h2 className="mt-2 font-serif text-[32px] leading-none">Settings</h2>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <section>
          <h3 className="label text-[10px] text-muted">Personal details</h3>
          <div className="mt-4 max-w-[520px]">
            <ProfileForm
              fullName={fullName}
              phone={profile?.phone ?? ""}
              email={user?.email ?? ""}
            />
          </div>
        </section>

        <aside className="h-fit space-y-4">
          <div className="border border-line p-5">
            <h3 className="font-serif text-[22px]">Password</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Request a secure link to choose a new password.
            </p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-block text-xs underline underline-offset-4"
            >
              Reset password
            </Link>
          </div>

          <div className="border border-line p-5">
            <h3 className="font-serif text-[22px]">Session</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sign out of this device. Your bag stays saved locally.
            </p>
            <form action={logoutAction} className="mt-4">
              <button
                type="submit"
                className="text-xs text-oxblood underline underline-offset-4"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
