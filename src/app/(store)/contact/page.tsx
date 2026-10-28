import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the NOIRÉ team for order, shipping, returns or product questions.",
};

export default function ContactPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <div className="page-shell py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow text-muted">
                Concierge & client services
              </span>
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4f6b4a]" />
                Concierge desk online
              </span>
            </div>
            <h1 className="mt-4 font-serif text-[50px] leading-[0.96] tracking-[-0.025em] sm:text-[68px]">
              We’re here to help.
            </h1>
            <p className="mt-6 max-w-[460px] text-sm leading-relaxed text-muted sm:text-base">
              Questions about an order, a fit or a fabric? Send us a note. We
              answer every message personally, usually within 1–2 business days.
            </p>

            <div className="mt-10 divide-y divide-line border-y border-line">
              <ContactRow
                label="Support inquiries"
                value="support@noire.example"
                note="For order support, sizing and product questions."
                href="mailto:support@noire.example"
              />
              <ContactRow
                label="Response window"
                value="1–2 business days"
                note="Every message is read and answered by the studio team."
              />
              <ContactRow
                label="Atelier concierge hours"
                value="Mon–Fri, 9am–6pm EST"
                note="Closed weekends and public holidays."
              />
              <ContactRow
                label="Follow NOIRÉ"
                value="Instagram / TikTok / Pinterest"
                note="Studio notes, new releases and quiet daily details."
                href="https://instagram.com"
              />
            </div>

            <div className="mt-8 bg-[#e9e2d5] p-6 sm:p-8">
              <span className="eyebrow text-muted">Private fittings</span>
              <h2 className="mt-3 font-serif text-[30px] leading-tight">
                By appointment.
              </h2>
              <p className="mt-3 max-w-[380px] text-sm leading-relaxed text-ink/70">
                A quiet hour with the atelier team for fit, fabric and wardrobe
                guidance. Available in the New York studio.
              </p>
              <a
                href="#inquiry"
                className="label mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px]"
              >
                Request an appointment
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div id="inquiry" className="border border-line bg-paper">
            <div className="border-b border-line p-6 sm:p-8">
              <span className="eyebrow text-muted">Direct inquiry</span>
              <h2 className="mt-3 font-serif text-[32px] leading-tight">
                Send an inquiry
              </h2>
              <p className="mt-2 max-w-[460px] text-sm leading-relaxed text-muted">
                Please provide precise order details where applicable. Fields
                marked with an asterisk are required.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-0 border-t border-line pt-12 lg:mt-24 lg:grid-cols-[1.15fr_0.85fr]">
          <figure className="relative aspect-[16/10] overflow-hidden bg-surface">
            <Image
              src="/images/editorial/about-02-atelier.jpg"
              alt="Inside the NOIRÉ atelier"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="image-cover"
            />
          </figure>
          <div className="flex flex-col justify-center bg-[#e9e2d5] p-8 sm:p-12">
            <span className="eyebrow text-muted">The atelier</span>
            <h2 className="mt-4 max-w-[420px] font-serif text-[36px] leading-[1.02] sm:text-[48px]">
              A slower kind of client care.
            </h2>
            <p className="mt-5 max-w-[400px] text-sm leading-relaxed text-ink/70">
              No scripts, no queues. Just a small team who know the collection
              and can help you choose well.
            </p>
            <Link
              href="/faq"
              className="label mt-8 inline-flex w-fit items-center gap-2 bg-ink px-7 py-4 text-[11px] text-canvas transition-opacity hover:opacity-90"
            >
              Read the FAQ
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string;
  note: string;
  href?: string;
}) {
  return (
    <div className="grid gap-2 py-5 sm:grid-cols-[0.78fr_1.22fr] sm:gap-6">
      <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <div>
        {href ? (
          <a
            href={href}
            className="text-sm font-medium transition-opacity hover:opacity-60"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
        <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>
      </div>
    </div>
  );
}
