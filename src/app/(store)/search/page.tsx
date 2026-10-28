import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { SearchIcon } from "@/components/ui/icons";
import { searchProducts } from "@/lib/catalog";

export const instant = false;

export const metadata: Metadata = {
  title: "Search",
  description: "Search the NOIRÉ collection.",
};

type SearchParams = Promise<{ q?: string | string[] }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";
  const results = query ? searchProducts(query) : [];

  return (
    <div className="page-shell py-12 lg:py-16">
      <div className="mx-auto max-w-[760px] text-center">
        <span className="eyebrow text-muted">Search</span>
        <h1 className="mt-3 font-serif text-[46px] leading-[1.0] tracking-[-0.02em] sm:text-[62px]">
          Find your piece.
        </h1>
        <form
          method="get"
          action="/search"
          className="mx-auto mt-8 flex max-w-[560px] items-center border-b border-ink pb-3"
        >
          <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
          <label htmlFor="search-query" className="sr-only">
            Search products
          </label>
          <input
            id="search-query"
            name="q"
            type="search"
            defaultValue={query}
            autoFocus
            placeholder="Search by piece, fabric or colour"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="label shrink-0 text-[10px] transition-opacity hover:opacity-60"
          >
            Search
          </button>
        </form>
      </div>

      {!query ? (
        <div className="mx-auto mt-14 max-w-[560px] text-center">
          <p className="text-sm text-muted">
            Try a piece, a category or a colour.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Tee", "Hoodie", "Trousers", "Linen", "Black", "Accessories"].map(
              (term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="border border-line px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-ink hover:text-ink"
                >
                  {term}
                </Link>
              ),
            )}
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <p className="text-sm text-muted">
            {results.length} {results.length === 1 ? "result" : "results"} for
            “{query}”
          </p>

          {results.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex min-h-[300px] flex-col items-center justify-center border border-line px-6 text-center">
              <h2 className="font-serif text-[32px]">No matches.</h2>
              <p className="mt-3 max-w-sm text-sm text-muted">
                Try a broader term, or explore the full collection.
              </p>
              <Link
                href="/shop"
                className="label mt-6 inline-flex border-b border-ink pb-1 text-[10px]"
              >
                Shop all pieces
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
