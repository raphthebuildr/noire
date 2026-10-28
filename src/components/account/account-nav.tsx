"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const items = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account navigation">
      <ul className="flex gap-1 overflow-x-auto border-b border-line lg:flex-col lg:gap-0 lg:border-b-0">
        {items.map((item) => {
          const active =
            item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block whitespace-nowrap px-3 py-3 text-sm transition-colors lg:border-l lg:px-4",
                  active
                    ? "border-ink text-ink lg:border-l-2"
                    : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
