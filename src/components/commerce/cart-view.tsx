"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/commerce/cart-provider";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  ReturnIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/ui/icons";
import {
  getColorImage,
  getDefaultVariant,
  isProductInStock,
  products,
  type Product,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING = 8;
const PAIRING_SLUGS = [
  "canvas-tote",
  "six-panel-cotton-cap",
  "everyday-crew-tee",
  "pleated-wide-trousers",
];

export function CartView() {
  const { lines, hydrated, subtotal, updateQuantity, removeItem, addItem } =
    useCart();
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [promoError, setPromoError] = useState("");

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
  const discount =
    appliedCode === "NOIRE10" ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);

  const pairings = PAIRING_SLUGS.map((slug) =>
    products.find((product) => product.slug === slug),
  )
    .filter((product): product is Product => Boolean(product))
    .filter(
      (product) => !lines.some((line) => line.productId === product.id),
    )
    .slice(0, 4);

  function applyPromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = promoInput.trim().toUpperCase();

    if (code === "NOIRE10") {
      setAppliedCode(code);
      setPromoError("");
      return;
    }

    setAppliedCode("");
    setPromoError("That code isn't valid. Try NOIRE10.");
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Shopping bag" }]} />

      <div className="page-shell py-10 lg:py-14">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <span className="eyebrow text-muted">Your bag</span>
            <h1 className="mt-2 font-serif text-[42px] leading-none sm:text-[54px]">
              Your bag
            </h1>
          </div>
          <span className="text-sm text-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </header>

        <div className="mt-6 border border-line bg-paper px-5 py-4">
          {remaining > 0 ? (
            <p className="text-sm text-muted">
              You&apos;re{" "}
              <span className="font-medium text-ink">
                {formatPrice(remaining)}
              </span>{" "}
              away from complimentary shipping.
            </p>
          ) : (
            <p className="text-sm text-ink">
              Your order qualifies for complimentary standard shipping.
            </p>
          )}
          <div className="mt-3 h-px w-full bg-line">
            <div
              className="h-px bg-ink transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-muted">
            Orders over $150 qualify for complimentary delivery.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] xl:gap-16">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted">
                Items are not reserved until checkout
              </p>
              <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-muted">
                <LockIcon className="h-3.5 w-3.5" />
                Secure checkout
              </p>
            </div>

            <div className="mt-6 hidden grid-cols-[1fr_110px_110px_30px] gap-4 border-b border-line pb-3 text-[10px] uppercase tracking-[0.1em] text-muted sm:grid">
              <span>Piece</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            <ul className="divide-y divide-line">
              {lines.map((line, index) => (
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
                      <p className="text-[9px] uppercase tracking-[0.14em] text-muted">
                        Essential {String(index + 1).padStart(2, "0")}
                      </p>
                      <Link
                        href={`/products/${line.productSlug}`}
                        className="mt-1 font-serif text-[20px] leading-snug hover:underline"
                      >
                        {line.productName}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        Colour: {line.color} · Size: {line.size}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                        In stock
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

            <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
              <TrustItem
                icon={<TruckIcon className="h-4 w-4" />}
                title="Complimentary delivery"
                copy="Free standard shipping on orders over $150."
              />
              <TrustItem
                icon={<ReturnIcon className="h-4 w-4" />}
                title="14-day returns"
                copy="Unworn pieces may be returned within 14 days."
              />
              <TrustItem
                icon={<LockIcon className="h-4 w-4" />}
                title="Secure checkout"
                copy="Payments are processed securely via Paystack."
              />
            </div>
          </div>

          <aside className="h-fit border border-line bg-paper p-6 lg:sticky lg:top-28">
            <h2 className="label text-[11px]">Order summary</h2>

            <div className="mt-5 border-b border-line pb-5">
              <label
                htmlFor="cart-promo"
                className="text-[10px] uppercase tracking-[0.12em] text-muted"
              >
                Promotional code
              </label>
              <form onSubmit={applyPromo} className="mt-2 flex gap-2">
                <input
                  id="cart-promo"
                  value={promoInput}
                  onChange={(event) => {
                    setPromoInput(event.target.value);
                    if (promoError) setPromoError("");
                  }}
                  placeholder="Enter code"
                  className="h-10 min-w-0 flex-1 border border-line bg-canvas px-3 text-sm outline-none focus:border-ink"
                />
                <button
                  type="submit"
                  className="border border-ink px-3 text-[10px] uppercase tracking-[0.1em] transition-colors hover:bg-ink hover:text-canvas"
                >
                  Apply
                </button>
              </form>
              {promoError ? (
                <p role="alert" className="mt-2 text-xs text-oxblood">
                  {promoError}
                </p>
              ) : null}
              {appliedCode ? (
                <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-ink">
                    <CheckIcon className="h-3.5 w-3.5" />
                    {appliedCode} applied
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCode("");
                      setPromoInput("");
                    }}
                    className="inline-flex items-center gap-1 text-muted hover:text-ink"
                  >
                    Remove
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 ? (
                <div className="flex items-center justify-between text-oxblood">
                  <dt>Discount ({appliedCode})</dt>
                  <dd>−{formatPrice(discount)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <dt className="text-muted">Shipping estimate</dt>
                <dd>
                  {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Estimated tax</dt>
                <dd>$0</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-medium">Total</dt>
                <dd className="text-lg">
                  {formatPrice(total)}{" "}
                  <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                    USD
                  </span>
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted">
              Shipping and taxes are confirmed at checkout.
            </p>
            <Link
              href={
                appliedCode
                  ? `/checkout?coupon=${encodeURIComponent(appliedCode)}`
                  : "/checkout"
              }
              className="label mt-6 flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-[11px] text-canvas transition-opacity hover:opacity-90"
            >
              Proceed to checkout
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-[11px] text-muted">
              Secure checkout via Paystack
            </p>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.12em] text-muted">
              Visa · Mastercard · Amex · Verve
            </p>
          </aside>
        </div>

        {pairings.length > 0 ? (
          <section className="mt-16 border-t border-line pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow text-muted">Curated pairings</span>
                <h2 className="mt-2 font-serif text-[34px] leading-none sm:text-[42px]">
                  Complete the uniform.
                </h2>
                <p className="mt-3 max-w-[540px] text-sm leading-relaxed text-muted">
                  Complementary garments tailored to pair seamlessly with your
                  current selections.
                </p>
              </div>
              <Link
                href="/shop"
                className="label inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px]"
              >
                Shop all
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {pairings.map((product) => (
                <PairingCard
                  key={product.id}
                  product={product}
                  onAdd={() => {
                    const variant = getDefaultVariant(product);
                    if (variant && variant.stock > 0) {
                      addItem(product, variant, 1);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-16 grid gap-6 border-t border-line pt-12 lg:grid-cols-2">
          <div className="border border-line bg-paper p-7">
            <span className="eyebrow text-muted">Client care</span>
            <h2 className="mt-2 font-serif text-[30px] leading-tight">
              Need styling advice?
            </h2>
            <p className="mt-3 max-w-[420px] text-sm leading-relaxed text-muted">
              Atelier Client Care: Mon–Fri 9am–6pm EST. Our team can help with
              fit, fabric and building a considered wardrobe.
            </p>
            <Link
              href="/contact"
              className="label mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px]"
            >
              Speak with our team
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-[#e9e2d5] p-7">
            <span className="eyebrow text-muted">Newsletter</span>
            <h2 className="mt-2 font-serif text-[30px] leading-tight">
              Stay in the know.
            </h2>
            <p className="mt-3 max-w-[420px] text-sm leading-relaxed text-ink/70">
              Receive directional previews, seasonal lookbooks, and private
              release invitations directly to your inbox.
            </p>
            <div className="mt-5">
              <NewsletterForm boxed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-muted">{icon}</span>
      <div>
        <p className="text-[11px] font-medium">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{copy}</p>
      </div>
    </div>
  );
}

function PairingCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  const inStock = isProductInStock(product);

  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-surface"
      >
        <Image
          src={getColorImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="image-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm leading-snug">
            <Link
              href={`/products/${product.slug}`}
              className="hover:opacity-60"
            >
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted">{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!inStock}
          className="shrink-0 border border-ink px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] transition-colors hover:bg-ink hover:text-canvas disabled:cursor-not-allowed disabled:border-line disabled:text-muted"
        >
          {inStock ? "+ Quick Add" : "Sold out"}
        </button>
      </div>
    </article>
  );
}
