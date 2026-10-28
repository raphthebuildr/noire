import Link from "next/link";
import { CartProvider } from "@/components/commerce/cart-provider";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="page-shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
            <span className="eyebrow text-muted">404</span>
            <p className="mt-4 font-serif text-[110px] leading-none tracking-[-0.04em] sm:text-[160px]">
              404
            </p>
            <h1 className="mt-4 font-serif text-[32px] leading-tight sm:text-[44px]">
              This page has moved on.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              The page you are looking for does not exist or is no longer
              available. Let us point you back to the collection.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/shop"
                className="label inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[11px] text-canvas transition-opacity hover:opacity-90"
              >
                Shop all pieces
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="label inline-flex items-center gap-2 border border-line px-6 py-3.5 text-[11px] transition-colors hover:border-ink"
              >
                <SearchIcon className="h-4 w-4" />
                Search
              </Link>
            </div>
            <Link
              href="/"
              className="mt-8 border-b border-ink pb-1 text-sm"
            >
              Return home
            </Link>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
