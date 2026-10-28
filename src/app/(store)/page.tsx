import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRightIcon, StarIcon } from "@/components/ui/icons";
import { categories, products } from "@/lib/catalog";

const newArrivalSlugs = [
  "heavyweight-oversized-tee",
  "heavyweight-pullover-hoodie",
  "linen-blend-overshirt",
  "coach-jacket",
];

const newArrivals = newArrivalSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter((product): product is (typeof products)[number] => Boolean(product));

const categoryMeta = [
  { label: "01 / Essential", size: "large" },
  { label: "02 / Fleece", size: "large" },
  { label: "03 / Shirting", size: "small" },
  { label: "04 / Tailoring", size: "small" },
  { label: "05 / Outerwear", size: "small" },
  { label: "06 / Objects", size: "small" },
] as const;

const reviews = [
  {
    quote:
      "The oversized tee has real weight to it. Holds its shape after washing.",
    name: "Daniel O.",
    rating: 5,
  },
  {
    quote:
      "The hoodie fits exactly how I hoped, roomy without looking sloppy.",
    name: "Amara E.",
    rating: 5,
  },
  {
    quote:
      "Great overshirt. I sized down once and it still works for layering.",
    name: "Tobi A.",
    rating: 5,
  },
];

const heroCommon = {
  alt: "Two models in NOIRÉ essentials against a warm plaster studio",
  loading: "eager" as const,
  fetchPriority: "high" as const,
};

const heroDesktop = getImageProps({
  ...heroCommon,
  src: "/images/editorial/home-b-01-editorial-fashion-photography-of-a-poised-male-and-female-mo.jpg",
  width: 2752,
  height: 1536,
  sizes: "(max-aspect-ratio: 2752/1536) 170vh, 100vw",
});

const heroMobile = getImageProps({
  ...heroCommon,
  src: "/images/editorial/home-b-01-portrait-two-models-in-noire-essentials.jpg",
  width: 1792,
  height: 2400,
  sizes: "(max-aspect-ratio: 1792/2400) 70vh, 100vw",
});

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-surface pb-16 pt-32 sm:pb-20 lg:pb-24">
        <picture>
          <source
            media="(min-width: 640px)"
            srcSet={heroDesktop.props.srcSet}
            sizes={heroDesktop.props.sizes}
          />
          <img
            {...heroMobile.props}
            alt={heroCommon.alt}
            className="absolute inset-0 h-full w-full object-cover object-center saturate-[0.9] contrast-[1.03]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
        <div className="page-shell relative z-10">
          <div className="max-w-3xl text-canvas">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-canvas/60" />
              <span className="eyebrow text-canvas/90">The new standard</span>
            </div>
            <h1 className="mt-6 max-w-[760px] font-serif text-[48px] leading-[0.98] tracking-[-0.025em] sm:text-[68px] lg:text-[92px]">
              Made for the way
              <br className="hidden sm:block" /> you move.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-canvas/80 sm:text-lg">
              Contemporary essentials designed for everyday movement, built
              around clean silhouettes, considered details and effortless
              versatility.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/shop?collection=new-arrivals"
                className="label inline-flex h-12 items-center justify-center bg-ink px-8 text-[11px] text-canvas ring-1 ring-canvas/35 transition-colors hover:bg-canvas hover:text-ink"
              >
                Shop new arrivals
              </Link>
              <Link
                href="/shop"
                className="label inline-flex h-12 items-center justify-center border border-canvas/60 px-8 text-[11px] text-canvas transition-colors hover:bg-canvas hover:text-ink"
              >
                Explore collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 lg:py-28">
        <SectionHeading
          eyebrow="Autumn / Winter 2026"
          title="New arrivals"
          description="Discover the latest pieces from NOIRÉ."
          href="/shop?collection=new-arrivals"
          linkLabel="View all"
        />
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-[#e9e2d5] px-4 py-24 text-center lg:py-32">
        <div className="mx-auto max-w-[920px]">
          <span className="eyebrow text-muted">The NOIRÉ manifesto</span>
          <h2 className="mx-auto mt-4 max-w-[760px] font-serif text-[40px] leading-[1.04] tracking-[-0.02em] sm:text-[56px] lg:text-[68px]">
            Less noise. More intention.
          </h2>
          <p className="mx-auto mt-6 max-w-[660px] text-base leading-relaxed text-ink/75 sm:text-lg">
            We create clothing designed to become part of your everyday
            uniform. Clean forms, considered materials and pieces made to move
            with you.
          </p>
          <Link
            href="/about"
            className="label mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-[11px] transition-opacity hover:opacity-60"
          >
            Our story
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="page-shell py-20 lg:py-28">
        <SectionHeading
          eyebrow="Curated archive"
          title="Find your everyday"
        />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {categories.map((category, index) => {
            const meta = categoryMeta[index];
            const large = meta.size === "large";

            return (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className={`group relative block overflow-hidden bg-surface ${
                  large
                    ? "h-[460px] sm:h-[540px] lg:col-span-6"
                    : "h-[360px] lg:col-span-3"
                } ${index === 1 ? "lg:col-span-6" : ""}`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes={
                    large
                      ? "(max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 1024px) 100vw, 25vw"
                  }
                  className="image-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-canvas sm:inset-x-7 sm:bottom-7">
                  <div>
                    <span className="eyebrow text-canvas/65">{meta.label}</span>
                    <h3 className="mt-1 font-serif text-[30px] leading-none sm:text-[34px]">
                      {category.name}
                    </h3>
                  </div>
                  {index < 2 ? (
                    <span className="label flex shrink-0 items-center gap-2 border-b border-canvas/60 pb-1 text-[10px] transition-colors group-hover:border-canvas">
                      Explore
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-shell pb-20 lg:pb-28">
        <div className="relative flex min-h-[560px] items-center overflow-hidden bg-ink">
          <Image
            src="/images/editorial/home-b-16-cinematic-wide-aspect-editorial-image-of-two-models-walking.jpg"
            alt="Two models walking through a brutalist courtyard in charcoal tailoring"
            fill
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover object-center saturate-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" />
          <div className="relative z-10 max-w-xl p-8 text-canvas sm:p-16 lg:p-24">
            <span className="eyebrow text-canvas/65">Series 04 / Campaign</span>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.04] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]">
              Designed to be lived in.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-canvas/80 sm:text-lg">
              From slow mornings to late nights, NOIRÉ is built around the
              pieces you reach for again and again.
            </p>
            <Link
              href="/about"
              className="label mt-8 inline-flex h-12 items-center justify-center bg-canvas px-8 text-[11px] text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              Discover NOIRÉ
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f3ed] py-20 lg:py-28">
        <div className="page-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Community notes" title="Worn by you." />
            <p className="text-[13px] text-muted">
              Sample reviews written for a fictional concept store.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.name}
                className="flex flex-col justify-between bg-canvas p-7 shadow-[inset_0_0_0_1px_#d8d2c7] sm:p-8"
              >
                <div>
                  <div className="flex items-center gap-1 text-ink">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`h-4 w-4 ${
                          index < review.rating ? "text-ink" : "text-stone"
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-6 font-serif text-[23px] italic leading-[1.3]">
                    “{review.quote}”
                  </blockquote>
                </div>
                <figcaption className="mt-8 flex items-center justify-between border-t border-line pt-5">
                  <span className="label text-[11px]">{review.name}</span>
                  <span className="text-xs text-muted">Verified customer</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-20 lg:py-28">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="eyebrow text-muted">Correspondence</span>
          <h2 className="mt-3 font-serif text-[38px] leading-[1.05] sm:text-[48px]">
            Stay in the know.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            New releases, collections and occasional offers. Delivered without
            the noise.
          </p>
          <div className="mt-8">
            <NewsletterForm boxed center />
          </div>
        </div>
      </section>
    </>
  );
}
