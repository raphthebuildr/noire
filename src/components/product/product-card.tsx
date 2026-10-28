"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/commerce/cart-provider";
import { formatPrice, discountPercent } from "@/lib/format";
import {
  getColorImage,
  getDefaultVariant,
  isProductInStock,
  type Product,
} from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const inStock = isProductInStock(product);
  const defaultVariant = getDefaultVariant(product);
  const hoverImage = product.gallery[0]?.src;
  const discount = product.compareAtPrice
    ? discountPercent(product.price, product.compareAtPrice)
    : 0;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={getColorImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="image-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {hoverImage ? (
            <Image
              src={hoverImage}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="image-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col gap-1">
          {!inStock ? (
            <span className="bg-ink px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-canvas">
              Sold out
            </span>
          ) : product.isNew ? (
            <span className="bg-canvas px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-ink">
              New
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="bg-oxblood px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-canvas">
              {discount}% off
            </span>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!inStock || !defaultVariant}
          onClick={() => {
            if (defaultVariant) addItem(product, defaultVariant, 1);
          }}
          className="absolute inset-x-0 bottom-0 z-20 flex h-11 translate-y-full items-center justify-center bg-ink text-[10px] font-medium uppercase tracking-[0.12em] text-canvas transition-transform duration-200 group-hover:translate-y-0 disabled:cursor-not-allowed disabled:bg-muted"
        >
          {inStock ? "Add to bag" : "Sold out"}
        </button>
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[14px] leading-snug">
            <Link
              href={`/products/${product.slug}`}
              className="transition-opacity hover:opacity-60"
            >
              {product.name}
            </Link>
          </h3>
          <div className="flex shrink-0 items-baseline gap-1.5">
            {product.compareAtPrice ? (
              <span className="text-[11px] text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
            <span className="text-[14px] font-medium">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_0_1px_rgba(207,200,188,0.9)]"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
