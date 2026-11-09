"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/components/commerce/cart-provider";
import {
  ArrowRightIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 150;

export function CartDrawer() {
  const {
    lines,
    isOpen,
    closeCart,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <div key="cart-drawer" className="fixed inset-0 z-50">
        <motion.button
          type="button"
          aria-label="Close cart"
          onClick={closeCart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full cursor-default bg-ink/40"
        />
        <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label="Shopping bag"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-paper shadow-[-12px_0_40px_rgba(28,28,28,0.08)]"
        >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-[26px] leading-none">Your bag</h2>
            <span className="text-sm text-muted">
              ({lines.reduce((total, line) => total + line.quantity, 0)})
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            className="p-2 text-ink transition-opacity hover:opacity-60"
            aria-label="Close cart"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="font-serif text-[30px] leading-tight">
              Your bag is empty.
            </p>
            <p className="max-w-[260px] text-sm leading-relaxed text-muted">
              Start with the pieces you reach for most. Considered essentials,
              made to be worn on repeat.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="label mt-2 inline-flex items-center gap-2 border border-ink px-6 py-3.5 transition-colors hover:bg-ink hover:text-canvas"
            >
              Shop all
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              {remaining > 0 ? (
                <p className="text-sm text-muted">
                  You are{" "}
                  <span className="font-medium text-ink">
                    {formatPrice(remaining)}
                  </span>{" "}
                  away from free standard shipping.
                </p>
              ) : (
                <p className="text-sm text-ink">
                  Your order qualifies for free standard shipping.
                </p>
              )}
              <div className="mt-3 h-px w-full bg-line">
                <div
                  className="h-px bg-ink transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6">
              <ul className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.variantId}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 py-5">
                        <Link
                          href={`/products/${line.productSlug}`}
                          onClick={closeCart}
                          className="relative block h-[132px] w-[104px] shrink-0 overflow-hidden bg-surface"
                        >
                          <Image
                            src={line.image}
                            alt={line.productName}
                            fill
                            sizes="104px"
                            className="image-cover"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                href={`/products/${line.productSlug}`}
                                onClick={closeCart}
                                className="font-serif text-[19px] leading-snug hover:underline"
                              >
                                {line.productName}
                              </Link>
                              <p className="mt-1 text-xs text-muted">
                                {line.color} / {line.size}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm">
                              {formatPrice(line.price * line.quantity)}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-4">
                            <div className="flex items-center border border-line">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    line.variantId,
                                    line.quantity - 1,
                                  )
                                }
                                className="press flex h-8 w-8 items-center justify-center hover:bg-surface"
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
                                  updateQuantity(
                                    line.variantId,
                                    line.quantity + 1,
                                  )
                                }
                                disabled={line.quantity >= line.maxQuantity}
                                className="press flex h-8 w-8 items-center justify-center hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label={`Increase quantity of ${line.productName}`}
                              >
                                <PlusIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(line.variantId)}
                              className="press p-2 text-muted hover:text-ink"
                              aria-label={`Remove ${line.productName} from bag`}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <div className="border-t border-line bg-canvas px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="label">Subtotal</span>
                <span className="text-lg">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="label mt-5 flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-canvas transition-opacity hover:opacity-90"
              >
                Checkout
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="label mt-3 flex w-full items-center justify-center border border-line px-6 py-3.5 transition-colors hover:border-ink"
              >
                View bag
              </Link>
            </div>
          </>
        )}
        </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
