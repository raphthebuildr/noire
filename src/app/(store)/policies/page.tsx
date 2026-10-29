import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArrowRightIcon, MailIcon } from "@/components/ui/icons";
import { PoliciesAccordion } from "@/components/policies/policies-accordion";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "NOIRÉ shipping, returns, privacy, terms and cookie information.",
};

const sections = [
  { id: "shipping", label: "Shipping & delivery" },
  { id: "returns", label: "Returns & refunds" },
  { id: "privacy", label: "Privacy" },
  { id: "terms", label: "Terms of use" },
  { id: "cookies", label: "Cookies" },
];

const shippingOptions = [
  {
    name: "Standard delivery",
    price: "$8",
    detail: "3–5 business days",
    note: "Complimentary on orders over $150.",
  },
  {
    name: "Express delivery",
    price: "$18",
    detail: "1–3 business days",
    note: "Priority dispatch where available.",
  },
  {
    name: "Dispatch window",
    price: "1–2 days",
    detail: "Monday–Friday",
    note: "Orders placed after 2pm EST begin next business day.",
  },
];

const returnTags = [
  "14-day window",
  "Original tags required",
  "Unworn and unwashed",
  "Final sale excluded",
];

const cookieTiles = [
  {
    title: "Essential",
    body: "Required for the bag, checkout, authentication and secure sessions. These cannot be switched off.",
  },
  {
    title: "Analytics",
    body: "Helps us understand which pieces and pages are useful. Aggregated and never sold.",
  },
  {
    title: "Preferences",
    body: "Remembers small choices such as recently viewed pieces and dismissed notices.",
  },
];

const policyData = [
  {
    id: "shipping",
    number: "01",
    title: "Shipping & delivery",
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted sm:text-base">
          Orders are processed within 1–2 business days, Monday through
          Friday. You will receive a confirmation email when your order is
          placed and tracking details when it ships.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {shippingOptions.map((option) => (
            <div
              key={option.name}
              className="border border-line bg-paper p-5"
            >
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted">
                {option.name}
              </p>
              <p className="mt-3 font-serif text-[30px] leading-none">
                {option.price}
              </p>
              <p className="mt-2 text-xs">{option.detail}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {option.note}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          This concept store currently ships within the United States
          only. International delivery is planned for a later release.
        </p>
      </>
    ),
  },
  {
    id: "returns",
    number: "02",
    title: "Returns & refunds",
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted sm:text-base">
          Unworn, unwashed pieces with original tags may be returned
          within 14 days of delivery. Contact us with your order number
          and the piece you would like to return; we will send
          instructions within 1–2 business days.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {returnTags.map((tag) => (
            <span
              key={tag}
              className="border border-line px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium">Refunds</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Approved returns are refunded to the original payment method
              within 5–10 business days after inspection. Original
              shipping is non-refundable.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Exchanges</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              If the size you need is available, we can arrange an
              exchange. Contact us before returning the piece so we can
              hold it for you.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "privacy",
    number: "03",
    title: "Privacy",
    content: (
      <>
        <div className="bg-ink p-6 text-canvas">
          <p className="text-[9px] uppercase tracking-[0.16em] text-canvas/60">
            Our position
          </p>
          <p className="mt-3 max-w-[560px] font-serif text-[26px] leading-tight">
            We do not sell, rent or broker personal data.
          </p>
        </div>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            We collect only what is needed to process an order, provide
            client care and keep the store secure: name, email, shipping
            address, order history and limited device information.
          </p>
          <p>
            Payment details are handled directly by Paystack. NOIRÉ does
            not store card numbers or security codes. You may request
            access, correction or deletion of your data by contacting the
            concierge.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "terms",
    number: "04",
    title: "Terms of use",
    content: (
      <>
        <div className="border border-line bg-[#e9e2d5] p-5">
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
            Concept notice
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            NOIRÉ is a design portfolio project. Products, prices, stock
            and policies are illustrative and may change without notice.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Portfolio concept", "Illustrative terms", "No commercial offer"].map(
            (tag) => (
              <span
                key={tag}
                className="border border-line px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-muted"
              >
                {tag}
              </span>
            ),
          )}
        </div>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            By using this site you agree not to misuse it, attempt to
            disrupt checkout, or reproduce the studio’s editorial and
            product imagery without permission.
          </p>
          <p>
            All content, marks and designs remain the property of NOIRÉ.
            Orders may be declined or cancelled where stock, pricing or
            payment cannot be verified.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    number: "05",
    title: "Cookies",
    content: (
      <>
        <p className="text-sm leading-relaxed text-muted sm:text-base">
          We use a small set of cookies to keep the bag, checkout and
          account session working. No advertising cookies are set by
          default.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {cookieTiles.map((tile) => (
            <div
              key={tile.title}
              className="border border-line bg-paper p-5"
            >
              <p className="text-[9px] uppercase tracking-[0.14em]">
                {tile.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {tile.body}
              </p>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

export default function PoliciesPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Policies" }]} />

      <div className="page-shell py-12 lg:py-20">
        <header className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[720px]">
            <span className="eyebrow text-muted">Legal framework & terms</span>
            <h1 className="mt-4 font-serif text-[54px] leading-[0.94] tracking-[-0.03em] sm:text-[74px]">
              Policies.
            </h1>
            <p className="mt-5 max-w-[560px] text-sm leading-relaxed text-muted sm:text-base">
              The practical details behind ordering from NOIRÉ. Written plainly,
              kept short, and reviewed when the studio changes.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 border-t border-line pt-4 text-[10px] uppercase tracking-[0.14em] lg:border-t-0 lg:pt-0">
            <div>
              <dt className="text-muted">Last updated</dt>
              <dd className="mt-1">October 2026</dd>
            </div>
            <div>
              <dt className="text-muted">Document ref</dt>
              <dd className="mt-1">PL-2026.10</dd>
            </div>
          </dl>
        </header>

        <div className="mt-9 border border-line bg-[#e9e2d5] px-5 py-4 text-sm leading-relaxed text-ink/75">
          <span className="label mr-3 text-[9px] text-ink">Notice</span>
          NOIRÉ is a portfolio concept. These policies are illustrative and do
          not form a real commercial offer.
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="border border-line bg-paper">
              <p className="label border-b border-line px-5 py-4 text-[10px]">
                Contents
              </p>
              <ol className="divide-y divide-line">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-center justify-between gap-4 px-5 py-3.5 text-sm text-muted transition-colors hover:text-ink"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[9px] tabular-nums text-muted">
                          0{index + 1}
                        </span>
                        {section.label}
                      </span>
                      <ArrowRightIcon className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 bg-[#e9e2d5] p-5">
              <MailIcon className="h-4 w-4 text-muted" />
              <p className="mt-3 font-serif text-[22px] leading-tight">
                Questions about our terms?
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                The concierge team can clarify anything on this page.
              </p>
              <Link
                href="/contact"
                className="label mt-4 inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px]"
              >
                Contact us
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 border border-line p-5 text-center">
              <p className="font-serif text-[34px] leading-none">PL</p>
              <p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-muted">
                Authenticity archive
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em]">
                PL-2026.10
              </p>
            </div>
          </aside>

          <PoliciesAccordion sections={policyData} />
        </div>

        <section className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center lg:mt-24">
          <div>
            <span className="eyebrow text-muted">Need clarity?</span>
            <h2 className="mt-2 font-serif text-[34px] leading-tight">
              Read the FAQ or ask us directly.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="label border border-ink px-6 py-3.5 text-[10px]"
            >
              Read the FAQ
            </Link>
            <Link
              href="/contact"
              className="label inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[10px] text-canvas"
            >
              Contact us
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
