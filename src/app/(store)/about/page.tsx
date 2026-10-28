import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "NOIRÉ is a study in quieter dressing: clean forms, considered materials and pieces made to move with you.",
};

const values = [
  {
    title: "Considered materials",
    body: "We choose fabrics for the way they feel, fall and wear over time. Dense cotton, washed linen, dry twill and soft wool blends.",
  },
  {
    title: "Everyday utility",
    body: "Each piece is designed around a real day: the commute, the studio, the long lunch, the late train home. Nothing extra.",
  },
  {
    title: "A longer view",
    body: "We favour fewer, better pieces over constant newness. Clothes that earn their place and stay in rotation.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="page-shell grid gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:py-16">
        <div className="max-w-[540px]">
          <span className="eyebrow text-muted">Our story</span>
          <h1 className="mt-4 font-serif text-[48px] leading-[0.98] tracking-[-0.025em] sm:text-[64px] lg:text-[76px]">
            A quieter way to dress.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            NOIRÉ began with a simple question: what if the clothes we reach for
            every day were the most considered pieces we own?
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            We design around clean forms, honest materials and the kind of
            details you notice only after wearing something for a season. The
            result is a wardrobe that feels less like a statement and more like
            a second skin.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-surface lg:aspect-[5/6]">
          <Image
            src="/images/editorial/about-01-editorial-coat.jpg"
            alt="NOIRÉ editorial coat photographed in warm studio light"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="image-cover"
          />
        </div>
      </section>

      <section className="bg-[#e9e2d5] px-4 py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <span className="eyebrow text-muted">The approach</span>
            <h2 className="mt-3 font-serif text-[38px] leading-[1.04] sm:text-[50px]">
              Built around the everyday.
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-ink/75 sm:text-base">
            <p>
              Our starting point is always the ordinary day. A t-shirt that
              holds its shape. Trousers that move without fuss. A layer that
              works over everything. We begin with those pieces and refine them
              until nothing is left to remove.
            </p>
            <p>
              The palette stays quiet: charcoal, bone, stone, slate and warm
              sand. Silhouettes are relaxed but deliberate. Fabrics are chosen
              to soften with wear, not to look new forever.
            </p>
            <p>
              This is not a season-by-season story. It is a slowly evolving
              wardrobe, designed to be lived in.
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 lg:py-28">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="border-t border-ink pt-5"
            >
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                0{index + 1}
              </span>
              <h2 className="mt-4 font-serif text-[28px] leading-tight">
                {value.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell grid gap-5 pb-20 md:grid-cols-2 lg:pb-28">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface md:aspect-[3/4]">
          <Image
            src="/images/editorial/about-02-atelier.jpg"
            alt="Inside the NOIRÉ atelier"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="image-cover"
          />
        </div>
        <div className="grid gap-5">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            <Image
              src="/images/editorial/about-03-jersey-macro.jpg"
              alt="Close-up of jersey fabric and stitching"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="image-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            <Image
              src="/images/editorial/about-04-twill-detail.jpg"
              alt="Close-up of twill and horn button detailing"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="image-cover"
            />
          </div>
        </div>
      </section>

      <section className="page-shell pb-20 lg:pb-28">
        <div className="flex flex-col items-center border-t border-line pt-16 text-center">
          <span className="eyebrow text-muted">The collection</span>
          <h2 className="mt-3 max-w-[640px] font-serif text-[36px] leading-[1.06] sm:text-[48px]">
            Pieces designed to become part of your everyday uniform.
          </h2>
          <Link
            href="/shop"
            className="label mt-8 inline-flex items-center gap-2 bg-ink px-8 py-4 text-[11px] text-canvas transition-opacity hover:opacity-90"
          >
            Explore the collection
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
