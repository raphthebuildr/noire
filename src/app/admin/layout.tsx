import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/lib/actions/auth";
import { getAdminUser } from "@/lib/auth";

export const instant = false;

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · NOIRÉ Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-paper">
        <div className="page-shell flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="label text-[13px] tracking-[0.2em]">
              NOIRÉ
            </Link>
            <span className="hidden text-[10px] uppercase tracking-[0.14em] text-muted sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <Link href="/" className="text-muted hover:text-ink">
              View store
            </Link>
            <span className="hidden text-muted sm:inline">{user.email}</span>
            <form action={logoutAction}>
              <button type="submit" className="text-muted hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="page-shell">
          <AdminNav />
        </div>
      </header>

      <main className="page-shell py-8 lg:py-10">{children}</main>
    </div>
  );
}
