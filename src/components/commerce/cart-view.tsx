"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/commerce/cart-provider";
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING = 8;

export function CartView() {
  const { lines, hydrated, subtotal, updateQuantity, removeItem } = useCart();

  if (!hydrated) {
    return (
      <div className="page-shell py-20">
        <div className="h-[320px] animate-pulse bg-surface" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="page-shell flex min-h-[58vh] flex-col items-center justify-center py-20 text-center">
        <span className="eyebrow text-muted">Your bag</span>
        <h1 className="mt-4 font-serif text-[44px] leading-none sm:text-[56px]">
          Your bag is empty.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          Start with the pieces you reach for most. Considered essentials, made
          to be worn on repeat.
        </p>
        <Link
          href="/shop"
          className="label mt-8 inline-flex items-center gap-2 bg-ink px-7 py-4 text-[11px] text-canvas transition-opacity hover:opacity-90"
        >
          Shop all pieces
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  return (
    <div className="page-shell py-12 lg:py-16">
      <header className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="eyebrow text-muted">Your bag</span>
          <h1 className="mt-2 font-serif text-[40px] leading-none sm:text-[52px]">
            Shopping bag
          </h1>
        </div>
        <span className="text-sm text-muted">
          {lines.reduce((count, line) => count + line.quantity, 0)} items
        </span>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] xl:gap-16">
        <div>
          <div className="hidden grid-cols-[1fr_110px_110px_30px] gap-4 border-b border-line pb-3 text-[10px] uppercase tracking-[0.1em] text-muted sm:grid">
            <span>Piece</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          <ul className="divide-y divide-line">
            {lines.map((line) => (
              <li
                key={line.variantId}
                className="grid grid-cols-[92px_1fr] gap-4 py-5 sm:grid-cols-[1fr_110px_110px_30px] sm:items-center"
              >
                <div className="col-span-2 flex gap-4 sm:col-span-1">
                  <Link
                    href={`/products/${line.productSlug}`}
                    className="relative block h-[116px] w-[92px] shrink-0 overflow-hidden bg-surface"
                  >
                    <Image
                      src={line.image}
                      alt={line.productName}
                      fill
                      sizes="92px"
                      className="image-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-col justify-center">
                    <Link
                      href={`/products/${line.productSlug}`}
                      className="font-serif text-[20px] leading-snug hover:underline"
                    >
                      {line.productName}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {line.color} / {line.size}
                    </p>
                    <p className="mt-2 text-sm">{formatPrice(line.price)}</p>
                  </div>
                </div>

                <div className="col-start-2 flex items-center sm:col-start-auto sm:justify-center">
                  <div className="flex items-center border border-line">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.variantId, line.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center hover:bg-surface"
                      aria-label={`Decrease quantity of ${line.productName}`}
                    >
                      <MinusIcon className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.variantId, line.quantity + 1)
                      }
                      disabled={line.quantity >= line.maxQuantity}
                      className="flex h-8 w-8 items-center justify-center hover:bg-surface disabled:opacity-30"
                      aria-label={`Increase quantity of ${line.productName}`}
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="col-start-2 text-sm sm:col-start-auto sm:text-right">
                  {formatPrice(line.price * line.quantity)}
                </p>

                <button
                  type="button"
                  onClick={() => removeItem(line.variantId)}
                  className="col-start-2 w-fit p-2 text-muted hover:text-ink sm:col-start-auto sm:justify-self-end"
                  aria-label={`Remove ${line.productName}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/shop"
              className="label inline-flex items-center gap-2 border-b border-ink pb-1 text-[11px]"
            >
              Continue shopping
            </Link>
            <p className="text-xs text-muted">
              Complimentary standard shipping over $150.
            </p>
          </div>
        </div>

        <aside className="h-fit border border-line bg-paper p-6 lg:sticky lg:top-28">
          <h2 className="label text-[11px]">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="text-lg">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-muted">
            Taxes calculated at checkout. This concept store charges $0 tax.
          </p>
          <Link
            href="/checkout"
            className="label mt-6 flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-[11px] text-canvas transition-opacity hover:opacity-90"
          >
            Continue to checkout
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-[11px] text-muted">
            Secure checkout via Paystack
          </p>
        </aside>
      </div>
    </div>
  );
}
