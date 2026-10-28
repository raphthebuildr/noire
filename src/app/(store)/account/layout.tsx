import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";
import { logoutAction } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/auth";

export const instant = false;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const name =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "there";

  return (
    <div className="page-shell py-10 lg:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="eyebrow text-muted">Account</span>
          <h1 className="mt-2 font-serif text-[38px] leading-none sm:text-[48px]">
            Hello, {name}.
          </h1>
        </div>
        <Link href="/shop" className="text-sm text-muted hover:text-ink">
          Continue shopping
        </Link>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-16">
        <aside>
          <AccountNav />
          <div className="mt-6 hidden border-t border-line pt-5 lg:block">
            <p className="text-xs text-muted">{user.email}</p>
            <form action={logoutAction} className="mt-3">
              <button
                type="submit"
                className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
