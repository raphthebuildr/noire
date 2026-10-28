import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/ui/icons";

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

export default function FaqPage() {
  return (
    <div className="page-shell py-12 lg:py-16">
      <header className="max-w-[720px]">
        <span className="eyebrow text-muted">Help</span>
        <h1 className="mt-3 font-serif text-[46px] leading-[1.0] tracking-[-0.02em] sm:text-[62px]">
          Frequently asked.
        </h1>
        <p className="mt-4 max-w-[540px] text-sm leading-relaxed text-muted sm:text-base">
          Practical answers about orders, shipping, returns, sizing and
          payments. If you cannot find what you need, our team is one message
          away.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav aria-label="FAQ sections" className="h-fit lg:sticky lg:top-28">
          <p className="label text-[11px]">On this page</p>
          <ul className="mt-4 space-y-2.5">
            {groups.map((group) => (
              <li key={group.title}>
                <a
                  href={`#${group.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line pt-5">
            <p className="text-sm text-muted">Still need help?</p>
            <Link
              href="/contact"
              className="mt-2 inline-block border-b border-ink pb-0.5 text-sm"
            >
              Contact us
            </Link>
          </div>
        </nav>

        <div className="space-y-12">
          {groups.map((group) => (
            <section
              key={group.title}
              id={group.title.toLowerCase().replace(/[^a-z]+/g, "-")}
              className="scroll-mt-28"
            >
              <h2 className="font-serif text-[30px] leading-tight sm:text-[36px]">
                {group.title}
              </h2>
              <div className="mt-4 border-t border-line">
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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
