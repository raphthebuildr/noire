import type { Metadata } from "next";
import Link from "next/link";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";
import { updateReviewStatusAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Reviews",
};

type Review = {
  id: string;
  product_slug: string;
  name: string;
  email: string | null;
  rating: number;
  title: string | null;
  body: string;
  status: string;
  created_at: string;
};

const filters = ["pending", "approved", "rejected"];

type SearchParams = Promise<{ status?: string | string[] }>;

export default async function AdminReviewsPage({
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
  const status = rawStatus && filters.includes(rawStatus) ? rawStatus : "pending";

  const { data } = await admin
    .from("reviews")
    .select(
      "id, product_slug, name, email, rating, title, body, status, created_at",
    )
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(200);

  const reviews = (data as Review[] | null) ?? [];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="eyebrow text-muted">Admin</span>
          <h1 className="mt-2 font-serif text-[34px] leading-none">Reviews</h1>
        </div>
        <p className="text-xs text-muted">{reviews.length} shown</p>
      </header>

      <div className="mt-5 flex flex-wrap gap-1">
        {filters.map((filter) => (
          <Link
            key={filter}
            href={`/admin/reviews?status=${filter}`}
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

      {reviews.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No {status} reviews.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm tracking-[0.1em]">
                      {"★".repeat(review.rating)}
                      <span className="text-line">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.08em] text-muted">
                      {review.status}
                    </span>
                  </div>
                  <p className="mt-2 font-serif text-[20px]">
                    {review.title || "Untitled review"}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {review.name}
                    {review.email ? ` · ${review.email}` : ""} ·{" "}
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <Link
                  href={`/products/${review.product_slug}`}
                  className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  {review.product_slug}
                </Link>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {review.body}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                {review.status !== "approved" ? (
                  <form action={updateReviewStatusAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button
                      type="submit"
                      className="label border border-ink px-4 py-2 text-[9px]"
                    >
                      Approve
                    </button>
                  </form>
                ) : null}
                {review.status !== "rejected" ? (
                  <form action={updateReviewStatusAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button
                      type="submit"
                      className="label border border-line px-4 py-2 text-[9px] text-muted hover:border-ink hover:text-ink"
                    >
                      Reject
                    </button>
                  </form>
                ) : null}
                {review.status !== "pending" ? (
                  <form action={updateReviewStatusAction}>
                    <input type="hidden" name="id" value={review.id} />
                    <input type="hidden" name="status" value="pending" />
                    <button
                      type="submit"
                      className="label border border-line px-4 py-2 text-[9px] text-muted hover:border-ink hover:text-ink"
                    >
                      Reset to pending
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
