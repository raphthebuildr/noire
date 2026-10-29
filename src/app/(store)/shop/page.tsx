import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
} from "@/components/ui/icons";
import {
  allColors,
  allSizes,
  categories,
  collections,
  isProductInStock,
  products,
} from "@/lib/catalog";
import { FilterGroup } from "@/components/shop/collapsible-filter-group";
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
  size?: string | string[];
  color?: string | string[];
  price?: string | string[];
  availability?: string | string[];
  sort?: string | string[];
}>;

type Filters = {
  category?: string;
  collection?: string;
  size?: string;
  color?: string;
  price?: string;
  availability?: string;
  sort?: string;
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const priceOptions = [
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "100-150", label: "$100 – $150" },
  { value: "over-150", label: "$150+" },
];

const availabilityOptions = [
  { value: "in-stock", label: "In stock" },
  { value: "sold-out", label: "Sold out" },
];

const colorSwatches = allColors.map((name) => ({
  name,
  hex:
    products
      .flatMap((product) => product.colors)
      .find((color) => color.name === name)?.hex ?? "#cfc8bc",
}));

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function shopHref(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.size) params.set("size", filters.size);
  if (filters.color) params.set("color", filters.color);
  if (filters.price) params.set("price", filters.price);
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

function matchesPrice(price: number, bucket: string) {
  if (bucket === "under-50") return price < 50;
  if (bucket === "50-100") return price >= 50 && price < 100;
  if (bucket === "100-150") return price >= 100 && price < 150;
  if (bucket === "over-150") return price >= 150;
  return true;
}

function hasActiveFilters(filters: Filters) {
  return Boolean(
    filters.category ||
      filters.collection ||
      filters.size ||
      filters.color ||
      filters.price ||
      filters.availability,
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters: Filters = {
    category: first(params.category),
    collection: first(params.collection),
    size: first(params.size),
    color: first(params.color),
    price: first(params.price),
    availability: first(params.availability),
    sort: first(params.sort) ?? "featured",
  };

  let filtered = [...products];

  if (
    filters.category &&
    categories.some((item) => item.slug === filters.category)
  ) {
    filtered = filtered.filter(
      (product) => product.category === filters.category,
    );
  }

  if (
    filters.collection &&
    collections.some((item) => item.slug === filters.collection)
  ) {
    filtered = filtered.filter(
      (product) => product.collection === filters.collection,
    );
  }

  if (filters.size) {
    filtered = filtered.filter((product) =>
      product.colors.some(
        (color) => (product.stock[color.name]?.[filters.size!] ?? 0) > 0,
      ),
    );
  }

  if (filters.color) {
    filtered = filtered.filter((product) =>
      product.colors.some((color) => color.name === filters.color),
    );
  }

  if (filters.price) {
    filtered = filtered.filter((product) =>
      matchesPrice(product.price, filters.price!),
    );
  }

  if (filters.availability === "in-stock") {
    filtered = filtered.filter(isProductInStock);
  } else if (filters.availability === "sold-out") {
    filtered = filtered.filter((product) => !isProductInStock(product));
  }

  if (filters.sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "newest") {
    filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  } else if (filters.sort === "best-selling") {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  } else {
    filtered.sort((a, b) => a.featuredRank - b.featuredRank);
  }

  const activeCategory = categories.find(
    (item) => item.slug === filters.category,
  );
  const activeCollection = collections.find(
    (item) => item.slug === filters.collection,
  );
  const heading =
    activeCategory?.name ?? activeCollection?.name ?? "Shop all";

  const activeChips = [
    filters.category
      ? {
          key: "category" as const,
          label: activeCategory?.name ?? filters.category,
        }
      : null,
    filters.collection
      ? {
          key: "collection" as const,
          label: activeCollection?.name ?? filters.collection,
        }
      : null,
    filters.size
      ? { key: "size" as const, label: `Size ${filters.size}` }
      : null,
    filters.color
      ? { key: "color" as const, label: filters.color }
      : null,
    filters.price
      ? {
          key: "price" as const,
          label:
            priceOptions.find((option) => option.value === filters.price)
              ?.label ?? filters.price,
        }
      : null,
    filters.availability
      ? {
          key: "availability" as const,
          label:
            availabilityOptions.find(
              (option) => option.value === filters.availability,
            )?.label ?? filters.availability,
        }
      : null,
  ].filter(Boolean) as Array<{ key: keyof Filters; label: string }>;

  const firstSix = filtered.slice(0, 6);
  const remaining = filtered.slice(6);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Shop" }]} />

      <div className="page-shell pb-20 pt-10 lg:pb-28 lg:pt-14">
        <header className="max-w-[760px]">
          <span className="eyebrow text-muted">The collection</span>
          <h1 className="mt-3 font-serif text-[46px] leading-[1.0] tracking-[-0.02em] sm:text-[64px]">
            {heading}
          </h1>
          <p className="mt-4 max-w-[560px] text-sm leading-relaxed text-muted sm:text-base">
            {activeCategory?.description ??
              activeCollection?.description ??
              "Everyday essentials in considered cuts."}
          </p>
        </header>

        <div className="mt-9 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="flex items-center justify-between border-b border-ink pb-3">
              <p className="label text-[10px]">Filter</p>
              {hasActiveFilters(filters) ? (
                <Link
                  href="/shop"
                  className="text-[10px] uppercase tracking-[0.12em] text-muted hover:text-ink"
                >
                  Clear all
                </Link>
              ) : null}
            </div>

            <FilterGroup title="Category">
              <FilterRow
                href={shopHref({ ...filters, category: undefined })}
                active={!filters.category}
                label="All pieces"
                count={products.length}
              />
              {categories.map((item) => (
                <FilterRow
                  key={item.slug}
                  href={shopHref({ ...filters, category: item.slug })}
                  active={filters.category === item.slug}
                  label={item.name}
                  count={
                    products.filter(
                      (product) => product.category === item.slug,
                    ).length
                  }
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Size">
              {allSizes.map((size) => (
                <FilterRow
                  key={size}
                  href={shopHref({ ...filters, size })}
                  active={filters.size === size}
                  label={size}
                  count={
                    products.filter((product) =>
                      product.colors.some(
                        (color) =>
                          (product.stock[color.name]?.[size] ?? 0) > 0,
                      ),
                    ).length
                  }
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Colour">
              {colorSwatches.map((color) => (
                <FilterRow
                  key={color.name}
                  href={shopHref({ ...filters, color: color.name })}
                  active={filters.color === color.name}
                  label={color.name}
                  count={
                    products.filter((product) =>
                      product.colors.some(
                        (item) => item.name === color.name,
                      ),
                    ).length
                  }
                  swatch={color.hex}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Price">
              {priceOptions.map((option) => (
                <FilterRow
                  key={option.value}
                  href={shopHref({ ...filters, price: option.value })}
                  active={filters.price === option.value}
                  label={option.label}
                  count={
                    products.filter((product) =>
                      matchesPrice(product.price, option.value),
                    ).length
                  }
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Availability">
              {availabilityOptions.map((option) => (
                <FilterRow
                  key={option.value}
                  href={shopHref({
                    ...filters,
                    availability: option.value,
                  })}
                  active={filters.availability === option.value}
                  label={option.label}
                  count={
                    option.value === "in-stock"
                      ? products.filter(isProductInStock).length
                      : products.filter((product) => !isProductInStock(product))
                          .length
                  }
                />
              ))}
            </FilterGroup>
          </aside>

          <div>
            <div className="flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">
                {hasActiveFilters(filters)
                  ? `Showing ${filtered.length} ${
                      filtered.length === 1 ? "piece" : "pieces"
                    }`
                  : `Showing all ${filtered.length} essentials`}
                <span className="ml-3 text-[10px] uppercase tracking-[0.12em]">
                  Page 1 of 1
                </span>
              </p>

              <form method="get" action="/shop" className="flex items-center gap-2">
                {filters.category ? (
                  <input type="hidden" name="category" value={filters.category} />
                ) : null}
                {filters.collection ? (
                  <input
                    type="hidden"
                    name="collection"
                    value={filters.collection}
                  />
                ) : null}
                {filters.size ? (
                  <input type="hidden" name="size" value={filters.size} />
                ) : null}
                {filters.color ? (
                  <input type="hidden" name="color" value={filters.color} />
                ) : null}
                {filters.price ? (
                  <input type="hidden" name="price" value={filters.price} />
                ) : null}
                {filters.availability ? (
                  <input
                    type="hidden"
                    name="availability"
                    value={filters.availability}
                  />
                ) : null}
                <label htmlFor="sort" className="text-xs text-muted">
                  Sort
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={filters.sort}
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

            {activeChips.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <Link
                    key={chip.key}
                    href={shopHref({ ...filters, [chip.key]: undefined })}
                    className="inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-ink hover:text-ink"
                  >
                    {chip.label}
                    <CloseIcon className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            ) : null}

            {filtered.length > 0 ? (
              <>
                <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {firstSix.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {remaining.length > 0 ? (
                  <div className="my-10 grid gap-6 border-y border-line bg-[#e9e2d5] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <span className="eyebrow text-muted">
                        Manifesto // 01
                      </span>
                      <h2 className="mt-2 max-w-[560px] font-serif text-[30px] leading-[1.05] sm:text-[38px]">
                        Designed to be lived in.
                      </h2>
                      <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-ink/70">
                        We create unhurried garments prioritizing honest
                        materials and architectural proportions over seasonal
                        disposability.
                      </p>
                    </div>
                    <Link
                      href="/about"
                      className="label inline-flex w-fit items-center gap-2 border-b border-ink pb-1 text-[10px]"
                    >
                      Discover NOIRÉ
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : null}

                {remaining.length > 0 ? (
                  <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                    {remaining.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : null}

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted">
                    Showing all {filtered.length} essentials
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center border border-line text-[11px] text-muted">
                      1
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      Page 1 of 1
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6 flex min-h-[360px] flex-col items-center justify-center gap-4 border border-line px-6 text-center">
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
          </div>
        </div>

      </div>
    </div>
  );
}



function FilterRow({
  href,
  active,
  label,
  count,
  swatch,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
  swatch?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center justify-between gap-3 text-sm transition-colors",
        active ? "text-ink" : "text-muted hover:text-ink",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {swatch ? (
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_0_1px_rgba(207,200,188,0.9)]"
            style={{ backgroundColor: swatch }}
          />
        ) : null}
        {active ? <CheckIcon className="h-3 w-3 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 text-[10px] tabular-nums text-muted">
        {String(count).padStart(2, "0")}
      </span>
    </Link>
  );
}
