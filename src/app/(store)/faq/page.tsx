import type { Metadata } from "next";
import Link from "next/link";
import { SizeGuideDialog } from "@/components/faq/size-guide-dialog";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  PackageIcon,
  ReturnIcon,
  RulerIcon,
  SearchIcon,
  SparkIcon,
} from "@/components/ui/icons";

export const instant = false;

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about NOIRÉ orders, shipping, returns, sizing and payments.",
};

const groups = [
  {
    title: "Orders & shipping",
    items: [
      {
        question: "When will my order ship?",
        answer:
          "Orders are processed within 1–2 business days. You will receive a confirmation email once your order is on its way.",
      },
      {
        question: "How much does shipping cost?",
        answer:
          "Standard shipping is $8 and is complimentary on orders over $150. Express shipping is $18.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "This concept store is configured for US delivery only. International shipping is planned for a later release.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes. Tracking details are included in your shipping confirmation. If you have an account, you can also view your orders from your account page.",
      },
    ],
  },
  {
    title: "Returns & exchanges",
    items: [
      {
        question: "What is your returns policy?",
        answer:
          "Unworn, unwashed pieces with original tags may be returned within 14 days of delivery. Final sale items are not eligible.",
      },
      {
        question: "How do I start a return?",
        answer:
          "Contact us with your order number and the piece you would like to return. We will send return instructions within 1–2 business days.",
      },
      {
        question: "Can I exchange for another size?",
        answer:
          "If the size you need is available, we can arrange an exchange. Contact us before returning the piece so we can hold it for you.",
      },
    ],
  },
  {
    title: "Sizing & fit",
    items: [
      {
        question: "How do NOIRÉ pieces fit?",
        answer:
          "Most pieces are designed with a relaxed fit. Product pages include fit notes and model measurements. If you are between sizes, size down for a closer fit.",
      },
      {
        question: "Where can I find measurements?",
        answer:
          "Our size guide includes body measurements and garment measurements for tops and trousers. You can also contact us for advice.",
      },
      {
        question: "Do you offer extended sizes?",
        answer:
          "Our tops currently run S–XXL and trousers 28–36. We are working toward a broader size range.",
      },
    ],
  },
  {
    title: "Products & care",
    items: [
      {
        question: "How should I care for my pieces?",
        answer:
          "Care instructions are listed on each product page and on the garment label. We recommend cold washing and air drying to preserve shape and colour.",
      },
      {
        question: "Will my piece soften over time?",
        answer:
          "Yes. Our cotton, linen and wool blends are chosen to soften with wear while keeping their structure.",
      },
      {
        question: "Are your products restocked?",
        answer:
          "Core pieces are restocked when possible. New arrivals are produced in limited runs. Join the newsletter for restock notes.",
      },
    ],
  },
  {
    title: "Payment & account",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "Checkout is powered by Paystack and accepts major debit and credit cards. All payments are processed securely.",
      },
      {
        question: "Do I need an account to order?",
        answer:
          "No. Guest checkout is available. Creating an account lets you save addresses and view order history.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "We never store card details. Payment information is handled directly by Paystack and is never saved on our servers.",
      },
    ],
  },
];

const careNotes = [
  {
    icon: SparkIcon,
    title: "Cold wash",
    body: "30°C or lower, gentle cycle.",
  },
  {
    icon: ReturnIcon,
    title: "Inside out",
    body: "Turn the garment before washing.",
  },
  {
    icon: PackageIcon,
    title: "Hang dry",
    body: "Air dry away from direct heat.",
  },
];

type SearchParams = Promise<{ q?: string | string[] }>;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z]+/g, "-");
}

export default async function FaqPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim();
  const normalizedQuery = query.toLowerCase();

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: normalizedQuery
        ? group.items.filter((item) =>
            `${item.question} ${item.answer}`
              .toLowerCase()
              .includes(normalizedQuery),
          )
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div>
      <Breadcrumbs items={[{ label: "FAQ" }]} />

      <div className="page-shell py-12 lg:py-20">
        <header className="max-w-[760px]">
          <span className="eyebrow text-muted">Client guide</span>
          <h1 className="mt-4 font-serif text-[50px] leading-[0.96] tracking-[-0.025em] sm:text-[68px]">
            Frequently asked.
          </h1>
          <p className="mt-5 max-w-[560px] text-sm leading-relaxed text-muted sm:text-base">
            Practical answers about orders, shipping, returns, sizing and
            payments. If you cannot find what you need, our team is one message
            away.
          </p>

          <form
            action="/faq"
            method="get"
            className="mt-8 flex max-w-[560px] items-center border border-line bg-paper"
          >
            <SearchIcon className="ml-4 h-4 w-4 shrink-0 text-muted" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search the client guide"
              aria-label="Search frequently asked questions"
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted"
            />
            {query ? (
              <Link
                href="/faq"
                className="px-3 text-[9px] uppercase tracking-[0.14em] text-muted hover:text-ink"
              >
                Clear
              </Link>
            ) : null}
            <button
              type="submit"
              className="label h-12 shrink-0 bg-ink px-5 text-[10px] text-canvas transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <aside className="h-fit lg:sticky lg:top-28">
            <nav aria-label="FAQ topics">
              <p className="label text-[11px]">Topics</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {groups.map((group) => (
                  <li key={group.title}>
                    <a
                      href={`#${slugify(group.title)}`}
                      className="flex items-center justify-between gap-3 py-3 text-sm text-muted transition-colors hover:text-ink"
                    >
                      <span>{group.title}</span>
                      <span className="text-[10px] tabular-nums text-muted">
                        {String(group.items.length).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 border border-line bg-paper p-5">
              <RulerIcon className="h-4 w-4 text-muted" />
              <p className="mt-3 font-serif text-[22px] leading-tight">
                Measurement desk
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Not sure of your size? Compare body and garment measurements
                before you order.
              </p>
              <SizeGuideDialog />
            </div>

            <div className="mt-4 bg-[#e9e2d5] p-5">
              <p className="font-serif text-[22px] leading-tight">
                Direct inquiry
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink/70">
                A real person will reply within 1–2 business days.
              </p>
              <Link
                href="/contact"
                className="label mt-4 inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px]"
              >
                Contact concierge
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>

          <div className="space-y-14">
            {filteredGroups.length === 0 ? (
              <div className="border border-line bg-paper p-8">
                <SearchIcon className="h-5 w-5 text-muted" />
                <h2 className="mt-4 font-serif text-[30px] leading-tight">
                  No answers found.
                </h2>
                <p className="mt-2 max-w-[440px] text-sm leading-relaxed text-muted">
                  Try a broader search, or send the concierge a note and we will
                  help directly.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/faq"
                    className="label border border-ink px-5 py-3 text-[10px]"
                  >
                    Clear search
                  </Link>
                  <Link
                    href="/contact"
                    className="label bg-ink px-5 py-3 text-[10px] text-canvas"
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            ) : null}

            {filteredGroups.map((group, groupIndex) => (
              <section
                key={group.title}
                id={slugify(group.title)}
                className="scroll-mt-28"
              >
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                      0{groupIndex + 1}
                    </span>
                    <h2 className="mt-2 font-serif text-[32px] leading-tight sm:text-[40px]">
                      {group.title}
                    </h2>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted">
                    {String(group.items.length).padStart(2, "0")} questions
                  </span>
                </div>

                <div className="mt-5 border-t border-line">
                  {group.items.map((item) => (
                    <details
                      key={item.question}
                      className="group border-b border-line py-5"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-medium [&::-webkit-details-marker]:hidden sm:text-base">
                        {item.question}
                        <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 max-w-[720px] text-sm leading-relaxed text-muted">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>

                {group.title === "Sizing & fit" ? (
                  <div
                    id="size-guide"
                    className="mt-8 scroll-mt-28 border border-line bg-paper p-6 sm:p-8"
                  >
                    <span className="eyebrow text-muted">Measurement desk</span>
                    <h3 className="mt-2 font-serif text-[28px] leading-tight">
                      Find your size.
                    </h3>
                    <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-muted">
                      Compare chest, waist, hip and inseam measurements. If you
                      are between sizes, size down for a closer fit.
                    </p>
                    <SizeGuideDialog />
                  </div>
                ) : null}

                {group.title === "Products & care" ? (
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {careNotes.map((note) => {
                      const Icon = note.icon;
                      return (
                        <div
                          key={note.title}
                          className="border border-line bg-paper p-5"
                        >
                          <Icon className="h-4 w-4 text-muted" />
                          <p className="mt-3 text-[10px] uppercase tracking-[0.14em]">
                            {note.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-muted">
                            {note.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>

        <section className="mt-16 grid gap-0 border-t border-line pt-12 lg:mt-24 lg:grid-cols-[1fr_0.9fr]">
          <div className="bg-[#e9e2d5] p-8 sm:p-12">
            <span className="eyebrow text-muted">Concierge</span>
            <h2 className="mt-3 max-w-[460px] font-serif text-[36px] leading-[1.02] sm:text-[50px]">
              Still looking for an answer?
            </h2>
            <p className="mt-4 max-w-[420px] text-sm leading-relaxed text-ink/70">
              Tell us what you need. The studio team replies personally, usually
              within 1–2 business days.
            </p>
          </div>
          <div className="flex flex-col justify-center border border-line border-t-0 bg-paper p-8 sm:p-12 lg:border-l-0 lg:border-t">
            <p className="font-serif text-[26px] leading-tight">
              Speak with a client advisor.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              For order details, fit questions or private fitting requests.
            </p>
            <Link
              href="/contact"
              className="label mt-6 inline-flex w-fit items-center gap-2 bg-ink px-7 py-4 text-[11px] text-canvas transition-opacity hover:opacity-90"
            >
              Contact us
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
