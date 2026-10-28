"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/commerce/cart-provider";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  ReturnIcon,
  RulerIcon,
  StarIcon,
  TruckIcon,
} from "@/components/ui/icons";
import {
  getCategory,
  getColorSizes,
  getDefaultVariant,
  getProductGallery,
  getVariant,
  type Product,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { discountPercent, formatPrice } from "@/lib/format";

export function ProductDetail({ product }: { product: Product }) {
  const defaultVariant = getDefaultVariant(product);
  const [color, setColor] = useState(
    defaultVariant?.color ?? product.colors[0].name,
  );
  const [size, setSize] = useState(
    defaultVariant?.size ?? product.sizes[0],
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const category = getCategory(product.category);
  const variant = getVariant(product, color, size);
  const colorSizes = getColorSizes(product, color);
  const images = getProductGallery(product, color);
  const discount = product.compareAtPrice
    ? discountPercent(product.price, product.compareAtPrice)
    : 0;
  const maxQuantity = variant?.stock ?? 0;
  const displayQuantity = Math.min(quantity, Math.max(1, maxQuantity));

  function handleColorChange(nextColor: string) {
    setColor(nextColor);
    const sizes = getColorSizes(product, nextColor);
    const current = sizes.find((item) => item.size === size);
    if (!current || current.stock === 0) {
      const available = sizes.find((item) => item.stock > 0);
      if (available) setSize(available.size);
    }
  }

  function handleAddToCart() {
    if (!variant || variant.stock === 0) return;
    addItem(product, variant, displayQuantity);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] xl:gap-16">
      <ProductGallery key={color} images={images} productName={product.name} />

      <div className="lg:pt-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          {category ? (
            <Link
              href={`/shop?category=${category.slug}`}
              className="hover:text-ink"
            >
              {category.name}
            </Link>
          ) : null}
        </div>

        <h1 className="mt-4 font-serif text-[38px] leading-[1.02] tracking-[-0.02em] sm:text-[46px]">
          {product.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={cn(
                  "h-3.5 w-3.5",
                  index < Math.round(product.rating)
                    ? "text-ink"
                    : "text-stone",
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted">
            {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-[22px] font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <>
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <span className="bg-oxblood px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-canvas">
                {discount}% off
              </span>
            </>
          ) : null}
        </div>

        <p className="mt-5 max-w-[520px] text-sm leading-relaxed text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-8 border-t border-line pt-6">
          <div className="flex items-center justify-between">
            <span className="label text-[11px]">Colour</span>
            <span className="text-xs text-muted">{color}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.colors.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleColorChange(item.name)}
                aria-label={item.name}
                aria-pressed={color === item.name}
                className={cn(
                  "h-8 w-8 rounded-full border-2 p-0.5 transition-colors",
                  color === item.name
                    ? "border-ink"
                    : "border-transparent hover:border-line",
                )}
              >
                <span
                  className="block h-full w-full rounded-full shadow-[inset_0_0_0_1px_rgba(28,28,28,0.12)]"
                  style={{ backgroundColor: item.hex }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="label text-[11px]">Size</span>
            <Link
              href="/policies#size-guide"
              className="inline-flex items-center gap-1.5 text-xs text-muted underline underline-offset-4 hover:text-ink"
            >
              <RulerIcon className="h-3.5 w-3.5" />
              Size guide
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {colorSizes.map((item) => {
              const soldOut = item.stock === 0;
              return (
                <button
                  key={item.size}
                  type="button"
                  disabled={soldOut}
                  onClick={() => setSize(item.size)}
                  aria-pressed={size === item.size}
                  className={cn(
                    "relative flex h-11 items-center justify-center border text-xs uppercase tracking-[0.06em] transition-colors",
                    size === item.size
                      ? "border-ink bg-ink text-canvas"
                      : "border-line text-ink hover:border-ink",
                    soldOut &&
                      "cursor-not-allowed border-line/60 text-muted/50 line-through hover:border-line/60",
                  )}
                >
                  {item.size}
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 min-h-[18px] text-xs text-muted" aria-live="polite">
            {maxQuantity === 0
              ? "This combination is currently sold out."
              : maxQuantity <= 3
                ? `Only ${maxQuantity} left in this size.`
                : "In stock. Ships within 1–2 business days."}
          </p>
        </div>

        <div className="mt-6 flex items-stretch gap-3">
          <div className="flex items-center border border-line">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={displayQuantity <= 1}
              className="flex h-12 w-11 items-center justify-center transition-colors hover:bg-surface disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-9 text-center text-sm">{displayQuantity}</span>
            <button
              type="button"
              onClick={() =>
                setQuantity((value) =>
                  Math.min(maxQuantity, Math.max(1, value + 1)),
                )
              }
              disabled={displayQuantity >= maxQuantity}
              className="flex h-12 w-11 items-center justify-center transition-colors hover:bg-surface disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!variant || variant.stock === 0}
            className="label flex h-12 flex-1 items-center justify-center bg-ink px-6 text-[11px] text-canvas transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted"
          >
            {variant && variant.stock > 0 ? "Add to bag" : "Sold out"}
          </button>
        </div>

        <div className="mt-5 grid gap-2 text-xs text-muted">
          <p className="flex items-center gap-2">
            <TruckIcon className="h-4 w-4 shrink-0" />
            Free standard shipping over $150. Express available at checkout.
          </p>
          <p className="flex items-center gap-2">
            <ReturnIcon className="h-4 w-4 shrink-0" />
            Easy 14-day returns on unworn pieces.
          </p>
        </div>

        <div className="mt-8 border-t border-line">
          <DetailAccordion title="Details" defaultOpen>
            <ul className="space-y-1.5">
              {product.details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <span className="mt-[9px] h-px w-2.5 shrink-0 bg-muted" />
                  {detail}
                </li>
              ))}
            </ul>
          </DetailAccordion>
          <DetailAccordion title="Composition & care">
            <p>{product.material}</p>
            <p className="mt-2">{product.care}</p>
          </DetailAccordion>
          <DetailAccordion title="Fit">
            <p>{product.fit}</p>
          </DetailAccordion>
          <DetailAccordion title="Shipping & returns">
            <p>
              Standard shipping is $8, or complimentary on orders over $150.
              Express shipping is $18. Orders ship within 1–2 business days.
            </p>
            <p className="mt-2">
              Unworn pieces may be returned within 14 days of delivery. Read
              our full policy for details.
            </p>
          </DetailAccordion>
        </div>
      </div>
    </div>
  );
}

function DetailAccordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-line py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}
