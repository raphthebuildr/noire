import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export const instant = false;

export const metadata: Metadata = {
  title: "Payment not completed",
  description: "Your NOIRÉ payment was not completed.",
};

type SearchParams = Promise<{
  reference?: string | string[];
  message?: string | string[];
  reason?: string | string[];
}>;

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const reference = Array.isArray(params.reference)
    ? params.reference[0]
    : params.reference;
  const message = Array.isArray(params.message)
    ? params.message[0]
    : params.message;
  const reason = Array.isArray(params.reason) ? params.reason[0] : params.reason;

  return (
    <div className="page-shell flex min-h-[64vh] flex-col items-center justify-center py-16 text-center">
      <span className="eyebrow text-muted">Payment</span>
      <h1 className="mt-4 max-w-2xl font-serif text-[44px] leading-[0.95] sm:text-[58px]">
        Payment not completed.
      </h1>
      <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
        {message ??
          (reason === "missing-reference"
            ? "We could not find a payment reference."
            : "The payment was cancelled or could not be confirmed. Your bag is still saved so you can try again.")}
      </p>

      {reference ? (
        <p className="label mt-5 border border-line px-4 py-2 text-[10px] text-muted">
          Ref {reference}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/checkout"
          className="label inline-flex items-center gap-2 bg-ink px-7 py-4 text-[11px] text-canvas"
        >
          Try checkout again
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <Link
          href="/cart"
          className="label border border-ink px-7 py-4 text-[11px]"
        >
          Return to bag
        </Link>
      </div>
    </div>
  );
}
