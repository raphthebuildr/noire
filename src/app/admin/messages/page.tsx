import type { Metadata } from "next";
import Link from "next/link";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import { updateMessageStatusAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Messages",
};

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

const filters = ["new", "read", "replied"];

type SearchParams = Promise<{ status?: string | string[] }>;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const admin = createAdminClient();

  if (!admin) {
    return <AdminNotConfigured />;
  }

  const params = await searchParams;
  const rawStatus = Array.isArray(params.status)
    ? params.status[0]
    : params.status;
  const status = rawStatus && filters.includes(rawStatus) ? rawStatus : "new";

  const { data } = await admin
    .from("contact_messages")
    .select("id, name, email, subject, message, status, created_at")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(200);

  const messages = (data as Message[] | null) ?? [];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Admin</span>
          <h1 className="mt-2 font-serif text-[34px] leading-none">Messages</h1>
        </div>
        <p className="text-xs text-muted">{messages.length} shown</p>
      </header>

      <div className="mt-5 flex flex-wrap gap-1">
        {filters.map((filter) => (
          <Link
            key={filter}
            href={`/admin/messages?status=${filter}`}
            className={
              status === filter
                ? "label border border-ink bg-ink px-3 py-2 text-[9px] capitalize text-canvas"
                : "label border border-line px-3 py-2 text-[9px] capitalize text-muted hover:border-ink hover:text-ink"
            }
          >
            {filter}
          </Link>
        ))}
      </div>

      {messages.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No {status} messages.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {messages.map((message) => (
            <li key={message.id} className="border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-[20px]">{message.subject}</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {message.name} ·{" "}
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(
                        `Re: ${message.subject}`,
                      )}`}
                      className="underline underline-offset-4"
                    >
                      {message.email}
                    </a>{" "}
                    · {formatDate(message.created_at)}
                  </p>
                </div>
                <span className="border border-line px-2 py-1 text-[9px] uppercase tracking-[0.08em] text-muted">
                  {message.status}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                {message.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                {message.status !== "read" ? (
                  <form action={updateMessageStatusAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <input type="hidden" name="status" value="read" />
                    <button
                      type="submit"
                      className="label border border-line px-4 py-2 text-[9px] text-muted hover:border-ink hover:text-ink"
                    >
                      Mark read
                    </button>
                  </form>
                ) : null}
                {message.status !== "replied" ? (
                  <form action={updateMessageStatusAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <input type="hidden" name="status" value="replied" />
                    <button
                      type="submit"
                      className="label border border-ink px-4 py-2 text-[9px]"
                    >
                      Mark replied
                    </button>
                  </form>
                ) : null}
                {message.status !== "new" ? (
                  <form action={updateMessageStatusAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <input type="hidden" name="status" value="new" />
                    <button
                      type="submit"
                      className="label border border-line px-4 py-2 text-[9px] text-muted hover:border-ink hover:text-ink"
                    >
                      Mark new
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
