import Link from "next/link";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import {
  InstagramIcon,
  PinterestIcon,
  TikTokIcon,
} from "@/components/ui/icons";

const shopLinks = [
  { label: "All pieces", href: "/shop" },
  { label: "T-Shirts", href: "/shop?category=t-shirts" },
  { label: "Hoodies", href: "/shop?category=hoodies" },
  { label: "Trousers", href: "/shop?category=trousers" },
  { label: "Accessories", href: "/shop?category=accessories" },
];

const helpLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping & Returns", href: "/policies#shipping" },
  { label: "Size Guide", href: "/policies#size-guide" },
  { label: "Track your order", href: "/account/orders" },
];

const companyLinks = [
  { label: "About NOIRÉ", href: "/about" },
  { label: "Policies", href: "/policies" },
  { label: "Search", href: "/search" },
  { label: "My account", href: "/account" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-canvas">
      <div className="page-shell pt-16 lg:pt-20">
        <div className="grid gap-14 border-b border-canvas/15 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-block font-sans text-[22px] font-medium uppercase tracking-[0.2em]"
            >
              Noiré
            </Link>
            <p className="mt-5 max-w-[330px] text-sm leading-relaxed text-canvas/60">
              Contemporary essentials designed for everyday movement. Clean
              silhouettes, considered materials and pieces made to move with
              you.
            </p>
            <div className="mt-8">
              <p className="label mb-2 text-[11px]">Stay in the know</p>
              <NewsletterForm
                compact
                inverted
                hint="Unsubscribe at any moment. Respecting your privacy unconditionally."
              />
            </div>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Help" links={helpLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="select-none overflow-hidden py-8" aria-hidden="true">
          <span className="block whitespace-nowrap text-center font-serif text-[18vw] uppercase leading-none tracking-[0.18em] text-canvas/[0.07]">
            Noiré
          </span>
        </div>

        <div className="flex flex-col gap-6 border-t border-canvas/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] uppercase tracking-[0.1em] text-canvas/50">
            © 2026 NOIRÉ. Concept project. Not a real
            store.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.12em] text-canvas/45">
              Secure checkout
            </span>
            <span className="text-[11px] font-medium tracking-[0.06em] text-canvas/55">
              VISA · MASTERCARD · PAYSTACK
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SocialLink href="https://instagram.com" label="Instagram">
              <InstagramIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink href="https://tiktok.com" label="TikTok">
              <TikTokIcon className="h-4 w-4" />
            </SocialLink>
            <SocialLink href="https://pinterest.com" label="Pinterest">
              <PinterestIcon className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="label text-[11px] text-canvas">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-canvas/55 transition-colors hover:text-canvas"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center border border-canvas/20 text-canvas/55 transition-colors hover:border-canvas/60 hover:text-canvas"
    >
      {children}
    </a>
  );
}
