import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Policies",
  description:
    "NOIRÉ shipping, returns, sizing, privacy and terms information.",
};

const sections = [
  { id: "shipping", label: "Shipping & delivery" },
  { id: "returns", label: "Returns & exchanges" },
  { id: "size-guide", label: "Size guide" },
  { id: "privacy", label: "Privacy" },
  { id: "terms", label: "Terms" },
];

const topSizes = [
  { size: "S", chest: "36–38", length: "27", shoulder: "18.5" },
  { size: "M", chest: "38–40", length: "28", shoulder: "19" },
  { size: "L", chest: "40–42", length: "29", shoulder: "19.5" },
  { size: "XL", chest: "42–44", length: "30", shoulder: "20" },
  { size: "XXL", chest: "44–46", length: "31", shoulder: "20.5" },
];

const trouserSizes = [
  { size: "28", waist: "28–29", hip: "36–37", inseam: "30" },
  { size: "30", waist: "30–31", hip: "38–39", inseam: "30" },
  { size: "32", waist: "32–33", hip: "40–41", inseam: "31" },
  { size: "34", waist: "34–35", hip: "42–43", inseam: "31" },
  { size: "36", waist: "36–37", hip: "44–45", inseam: "32" },
];

export default function PoliciesPage() {
  return (
    <div className="page-shell py-12 lg:py-16">
      <header className="max-w-[760px]">
        <span className="eyebrow text-muted">Customer care</span>
        <h1 className="mt-3 font-serif text-[46px] leading-[1.0] tracking-[-0.02em] sm:text-[62px]">
          Policies.
        </h1>
        <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-muted sm:text-base">
          The practical details behind ordering from NOIRÉ. This is a concept
          store, so policies are illustrative and not a real commercial offer.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav aria-label="Policy sections" className="h-fit lg:sticky lg:top-28">
          <p className="label text-[11px]">On this page</p>
          <ul className="mt-4 space-y-2.5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line pt-5">
            <p className="text-sm text-muted">Need something else?</p>
            <Link
              href="/contact"
              className="mt-2 inline-block border-b border-ink pb-0.5 text-sm"
            >
              Contact us
            </Link>
          </div>
        </nav>

        <div className="max-w-[780px] space-y-14">
          <PolicySection
            id="shipping"
            title="Shipping & delivery"
            intro="Orders are processed within 1–2 business days, Monday through Friday. You will receive a confirmation email when your order is placed and tracking details when it ships."
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>Standard shipping: $8, delivered in 3–5 business days.</li>
              <li>
                Complimentary standard shipping on orders over $150.
              </li>
              <li>Express shipping: $18, delivered in 1–2 business days.</li>
              <li>
                We currently ship within the United States only. International
                delivery is planned for a later release.
              </li>
            </ul>
            <p>
              Delivery estimates begin once your order has shipped. NOIRÉ is
              not responsible for delays caused by carriers, weather or
              incorrect addresses. Please check your address carefully at
              checkout.
            </p>
          </PolicySection>

          <PolicySection
            id="returns"
            title="Returns & exchanges"
            intro="If a piece is not right, you may return it within 14 days of delivery. Returns must be unworn, unwashed and in original condition with tags attached."
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Start a return by contacting us with your order number and the
                piece you would like to return.
              </li>
              <li>
                Return shipping is the customer&apos;s responsibility unless the
                item arrived damaged or incorrect.
              </li>
              <li>
                Refunds are issued to the original payment method within 5–10
                business days of inspection.
              </li>
              <li>
                Final sale pieces and worn or altered garments are not
                eligible for return.
              </li>
            </ul>
            <p>
              Exchanges depend on availability. If you need another size,
              contact us before returning the piece so we can hold it for you.
            </p>
          </PolicySection>

          <PolicySection
            id="size-guide"
            title="Size guide"
            intro="Our tops are designed with a relaxed fit and our trousers with a clean, straight or wide line. If you are between sizes, size down for a closer fit."
          >
            <h3 className="mt-2 font-serif text-[24px]">Tops (inches)</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink text-[10px] uppercase tracking-[0.1em]">
                    <th className="py-3 pr-4 font-medium">Size</th>
                    <th className="py-3 pr-4 font-medium">Chest</th>
                    <th className="py-3 pr-4 font-medium">Body length</th>
                    <th className="py-3 font-medium">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {topSizes.map((row) => (
                    <tr key={row.size} className="border-b border-line">
                      <td className="py-3 pr-4">{row.size}</td>
                      <td className="py-3 pr-4 text-muted">{row.chest}</td>
                      <td className="py-3 pr-4 text-muted">{row.length}</td>
                      <td className="py-3 text-muted">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-8 font-serif text-[24px]">Trousers (inches)</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink text-[10px] uppercase tracking-[0.1em]">
                    <th className="py-3 pr-4 font-medium">Size</th>
                    <th className="py-3 pr-4 font-medium">Waist</th>
                    <th className="py-3 pr-4 font-medium">Hip</th>
                    <th className="py-3 font-medium">Inseam</th>
                  </tr>
                </thead>
                <tbody>
                  {trouserSizes.map((row) => (
                    <tr key={row.size} className="border-b border-line">
                      <td className="py-3 pr-4">{row.size}</td>
                      <td className="py-3 pr-4 text-muted">{row.waist}</td>
                      <td className="py-3 pr-4 text-muted">{row.hip}</td>
                      <td className="py-3 text-muted">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted">
              Measurements are taken flat and may vary by up to 0.5 inch. Need
              help? Contact us with your usual size and fit preference.
            </p>
          </PolicySection>

          <PolicySection
            id="privacy"
            title="Privacy"
            intro="We collect only the information needed to process orders, provide support and send updates you have asked for."
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Account and order information is stored securely with our
                commerce platform.
              </li>
              <li>
                Payment details are handled by Paystack. NOIRÉ never stores card
                numbers.
              </li>
              <li>
                Newsletter subscribers may unsubscribe at any time using the
                link in any email.
              </li>
              <li>
                We do not sell personal information. Data is shared only with
                service providers needed to fulfil your order.
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            id="terms"
            title="Terms"
            intro="By using this site, you agree to these illustrative terms. NOIRÉ is a fictional concept store created for portfolio purposes."
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Product availability, pricing and delivery estimates may change
                without notice.
              </li>
              <li>
                Orders are subject to acceptance and stock availability.
              </li>
              <li>
                All content, imagery and branding are presented for
                demonstration only.
              </li>
              <li>
                These terms are not legal advice and do not constitute a real
                commercial agreement.
              </li>
            </ul>
          </PolicySection>
        </div>
      </div>
    </div>
  );
}

function PolicySection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-serif text-[32px] leading-tight sm:text-[38px]">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">{intro}</p>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}
