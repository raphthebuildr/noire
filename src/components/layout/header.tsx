"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/commerce/cart-provider";
import {
  BagIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?collection=new-arrivals" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count, hydrated, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink px-4 py-2.5 text-center text-canvas">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em]">
          Complimentary standard shipping on orders over $150
        </p>
      </div>

      <div className="border-b border-line bg-canvas/95 backdrop-blur-sm">
        <div className="page-shell flex h-[72px] items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center gap-5">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="-ml-2 shrink-0 p-2 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
            <Link
              href="/"
              aria-label="NOIRÉ home"
              className="shrink-0 font-sans text-[19px] font-medium uppercase tracking-[0.2em] sm:text-[21px]"
            >
              Noiré
            </Link>
          </div>

          <nav
            aria-label="Main navigation"
            className="hidden items-center justify-center gap-7 lg:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "label whitespace-nowrap text-[12px] transition-opacity hover:opacity-60",
                  pathname === item.href.split("?")[0] && "underline underline-offset-8",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-3">
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 transition-opacity hover:opacity-60"
            >
              <SearchIcon className="h-[19px] w-[19px]" />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden p-2 transition-opacity hover:opacity-60 sm:block"
            >
              <UserIcon className="h-[19px] w-[19px]" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping bag${hydrated && count > 0 ? `, ${count} items` : ""}`}
              className="relative p-2 transition-opacity hover:opacity-60"
            >
              <BagIcon className="h-[19px] w-[19px]" />
              {hydrated && count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium leading-none text-canvas">
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="absolute inset-x-0 top-full border-b border-line bg-canvas px-4 pb-8 pt-4 shadow-[0_12px_30px_rgba(28,28,28,0.05)] lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col"
            onClick={() => setMenuOpen(false)}
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-4 font-serif text-[28px] leading-none"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              className="border-b border-line py-4 font-serif text-[28px] leading-none"
            >
              My Account
            </Link>
          </nav>
          <div
            className="mt-6 flex items-center gap-5 text-xs text-muted"
            onClick={() => setMenuOpen(false)}
          >
            <Link href="/contact" className="hover:text-ink">
              Contact
            </Link>
            <Link href="/policies" className="hover:text-ink">
              Policies
            </Link>
            <Link href="/search" className="hover:text-ink">
              Search
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
