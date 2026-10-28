import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SparkIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the NOIRÉ team for order, shipping, returns or product questions.",
};

export default function ContactPage() {
  return (
    <div className="page-shell py-12 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <span className="eyebrow text-muted">Contact</span>
          <h1 className="mt-3 font-serif text-[46px] leading-[1.0] tracking-[-0.02em] sm:text-[62px]">
            We are here to help.
          </h1>
          <p className="mt-5 max-w-[440px] text-sm leading-relaxed text-muted sm:text-base">
            Questions about an order, a fit or a fabric? Send us a note. We
            answer every message personally, usually within 1–2 business days.
          </p>

          <div className="mt-10 space-y-6 border-t border-line pt-8">
            <ContactDetail
              icon={<MailIcon className="h-4 w-4" />}
              label="Email"
              value="hello@noire.example"
              note="For general enquiries and order support."
            />
            <ContactDetail
              icon={<PhoneIcon className="h-4 w-4" />}
              label="Studio"
              value="+1 (000) 000-0000"
              note="Monday–Friday, 9am–5pm EST."
            />
            <ContactDetail
              icon={<MapPinIcon className="h-4 w-4" />}
              label="Studio address"
              value="Concept project"
              note="NOIRÉ is a fictional concept store created for portfolio purposes."
            />
          </div>

          <div className="mt-10 bg-[#e9e2d5] p-6">
            <SparkIcon className="h-5 w-5" />
            <p className="mt-3 font-serif text-[22px] leading-snug">
              Looking for a quick answer?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Our FAQ covers shipping, returns, sizing and payment in more
              detail.
            </p>
            <a
              href="/faq"
              className="label mt-4 inline-block border-b border-ink pb-1 text-[10px]"
            >
              Read the FAQ
            </a>
          </div>
        </div>

        <div className="border border-line bg-paper p-6 sm:p-10">
          <h2 className="font-serif text-[30px] leading-tight">
            Send a message
          </h2>
          <p className="mt-2 text-sm text-muted">
            Fields marked with an asterisk are required.
          </p>
          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactDetail({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-line text-muted">
        {icon}
      </span>
      <div>
        <p className="label text-[10px] text-muted">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>
      </div>
    </div>
  );
}
