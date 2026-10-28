import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  ArrowRightIcon,
  PackageIcon,
  ReturnIcon,
  TruckIcon,
} from "@/components/ui/icons";

const privileges = [
  "Early access to new releases",
  "Saved addresses and order history",
  "Private fitting requests",
  "Priority client care",
];

export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
  aside,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumbs items={[{ label: "My account" }]} />

      <div className="page-shell py-10 lg:py-16">
        <header className="max-w-[760px]">
          <span className="eyebrow text-muted">Client portal — 001</span>
          <h1 className="mt-3 font-serif text-[48px] leading-[0.96] tracking-[-0.025em] sm:text-[64px]">
            My Account
          </h1>
          <p className="mt-4 max-w-[540px] text-sm leading-relaxed text-muted sm:text-base">
            Sign in to your client file, or open a new account. Both paths lead
            to the same quiet place: saved addresses, order history and private
            fitting requests.
          </p>
        </header>

        <div className="mt-10 grid overflow-hidden border border-line lg:grid-cols-[1.02fr_0.98fr]">
          <div className="bg-paper p-6 sm:p-10 lg:p-12">
            <span className="eyebrow text-muted">{eyebrow}</span>
            <h2 className="mt-3 font-serif text-[36px] leading-[1.02] sm:text-[44px]">
              {title}
            </h2>
            <p className="mt-3 max-w-[440px] text-sm leading-relaxed text-muted">
              {intro}
            </p>
            <div className="mt-8">{children}</div>
            {footer ? (
              <div className="mt-8 border-t border-line pt-6 text-sm text-muted">
                {footer}
              </div>
            ) : null}
          </div>

          <aside className="bg-surface p-6 sm:p-10 lg:p-12">
            {aside ?? <ClientPrivileges />}
          </aside>
        </div>

        <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-3">
          <ReassuranceItem
            icon={<TruckIcon className="h-4 w-4" />}
            title="Complimentary delivery"
            body="On orders over $150."
          />
          <ReassuranceItem
            icon={<ReturnIcon className="h-4 w-4" />}
            title="14-day returns"
            body="Unworn, with original tags."
          />
          <ReassuranceItem
            icon={<PackageIcon className="h-4 w-4" />}
            title="Secure checkout"
            body="Payments handled by Paystack."
          />
        </div>
      </div>
    </div>
  );
}

export function AuthAside({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";

  return (
    <div className="flex h-full flex-col justify-between gap-10">
      <div>
        <span className="eyebrow text-muted">
          {isLogin ? "New membership" : "Returning client"}
        </span>
        <h2 className="mt-3 max-w-[360px] font-serif text-[34px] leading-[1.04] sm:text-[42px]">
          {isLogin ? "Open a client file." : "Welcome back to the studio."}
        </h2>
        <p className="mt-4 max-w-[380px] text-sm leading-relaxed text-muted">
          {isLogin
            ? "A quieter way to keep track of what you wear. Save addresses, view order history and request private fittings."
            : "Sign in to return to your saved pieces, addresses and order history without starting over."}
        </p>
        <Link
          href={isLogin ? "/register" : "/login"}
          className="label mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px]"
        >
          {isLogin ? "Create an account" : "Sign in"}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="border-t border-line pt-6">
        <p className="label text-[9px] text-muted">Client privileges</p>
        <ul className="mt-4 space-y-3">
          {privileges.map((privilege) => (
            <li
              key={privilege}
              className="flex items-start gap-3 text-sm leading-relaxed text-muted"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink" />
              {privilege}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ClientPrivileges() {
  return (
    <div>
      <span className="eyebrow text-muted">Client privileges</span>
      <h2 className="mt-3 max-w-[360px] font-serif text-[34px] leading-[1.04] sm:text-[42px]">
        Fewer pieces. Worn more often.
      </h2>
      <p className="mt-4 max-w-[380px] text-sm leading-relaxed text-muted">
        Save addresses, track orders and return to your favourites without
        starting over.
      </p>
      <ul className="mt-6 space-y-3 border-t border-line pt-6">
        {privileges.map((privilege) => (
          <li
            key={privilege}
            className="flex items-start gap-3 text-sm leading-relaxed text-muted"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink" />
            {privilege}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReassuranceItem({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-paper p-5">
      <span className="mt-0.5 text-muted">{icon}</span>
      <div>
        <p className="text-[9px] uppercase tracking-[0.14em]">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}
