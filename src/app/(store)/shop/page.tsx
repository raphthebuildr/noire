import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  categories,
  collections,
  products,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";

export const instant = false;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Explore the NOIRÉ collection of considered everyday essentials.",
};

type SearchParams = Promise<{
  category?: string | string[];
  collection?: string | string[];
  sort?: string | string[];
}>;

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function shopHref({
  category,
  collection,
  sort,
}: {
  category?: string;
  collection?: string;
  sort?: string;
}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (collection) params.set("collection", collection);
  if (sort && sort !== "featured") params.set("sort", sort);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = first(params.category);
  const collection = first(params.collection);
  const sort = first(params.sort) ?? "featured";

  let filtered = [...products];

  if (category && categories.some((item) => item.slug === category)) {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (
    collection &&
    collections.some((item) => item.slug === collection)
  ) {
    filtered = filtered.filter((product) => product.collection === collection);
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  } else {
    filtered.sort((a, b) => a.featuredRank - b.featuredRank);
  }

  const activeCategory = categories.find((item) => item.slug === category);
  const activeCollection = collections.find((item) => item.slug === collection);
  const heading = activeCategory?.name ?? activeCollection?.name ?? "All pieces";

  return (
    <div className="page-shell pb-20 pt-12 lg:pb-28 lg:pt-16">
      <header className="max-w-[720px]">
        <span className="eyebrow text-muted">The collection</span>
        <h1 className="mt-3 font-serif text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[58px]">
          {heading}
        </h1>
        <p className="mt-4 max-w-[540px] text-sm leading-relaxed text-muted sm:text-base">
          {activeCategory?.description ??
            activeCollection?.description ??
            "Considered essentials for everyday movement. Clean silhouettes, quiet materials and pieces made to be worn on repeat."}
        </p>
      </header>

      <div className="mt-10 border-y border-line py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <nav
            aria-label="Filter by category"
            className="hide-scrollbar flex items-center gap-1 overflow-x-auto"
          >
            <FilterLink
              href={shopHref({ collection, sort })}
              active={!category}
            >
              All
            </FilterLink>
            {categories.map((item) => (
              <FilterLink
                key={item.slug}
                href={shopHref({ category: item.slug, collection, sort })}
                active={category === item.slug}
              >
                {item.name}
              </FilterLink>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] uppercase tracking-[0.1em] text-muted">
              Collection
            </span>
            <FilterLink
              href={shopHref({ category, sort })}
              active={!collection}
              subtle
            >
              All
            </FilterLink>
            {collections.map((item) => (
              <FilterLink
                key={item.slug}
                href={shopHref({
                  category,
                  collection: item.slug,
                  sort,
                })}
                active={collection === item.slug}
                subtle
              >
                {item.name}
              </FilterLink>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          {category || collection ? (
            <>
              {" · "}
              <Link
                href="/shop"
                className="underline underline-offset-4 hover:text-ink"
              >
                Clear filters
              </Link>
            </>
          ) : null}
        </p>

        <form method="get" action="/shop" className="flex items-center gap-2">
          {category ? (
            <input type="hidden" name="category" value={category} />
          ) : null}
          {collection ? (
            <input type="hidden" name="collection" value={collection} />
          ) : null}
          <label htmlFor="sort" className="text-xs text-muted">
            Sort
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="border border-line bg-transparent px-2 py-1.5 text-xs outline-none focus:border-ink"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="border border-ink px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] transition-colors hover:bg-ink hover:text-canvas"
          >
            Apply
          </button>
        </form>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 border border-line px-6 text-center">
          <h2 className="font-serif text-[32px]">Nothing here yet.</h2>
          <p className="max-w-sm text-sm text-muted">
            Try another category or return to the full collection.
          </p>
          <Link
            href="/shop"
            className="label mt-2 inline-flex items-center gap-2 border-b border-ink pb-1 text-[11px]"
          >
            Shop all pieces
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <div className="mt-20 flex flex-col items-center border-t border-line pt-12 text-center">
        <span className="eyebrow text-muted">A slower wardrobe</span>
        <h2 className="mt-3 max-w-[620px] font-serif text-[34px] leading-[1.08] sm:text-[44px]">
          Fewer, better pieces. Worn again and again.
        </h2>
        <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-muted">
          Every NOIRÉ piece is designed around a simple idea: clothing should
          make the day easier, not more complicated.
        </p>
        <Link
          href="/about"
          className="label mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-[11px] transition-opacity hover:opacity-60"
        >
          Our approach
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  subtle = false,
  children,
}: {
  href: string;
  active: boolean;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 border px-3 py-2 text-[10px] uppercase tracking-[0.1em] transition-colors",
        subtle ? "border-transparent" : "border-line",
        active
          ? "border-ink bg-ink text-canvas"
          : "text-muted hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
