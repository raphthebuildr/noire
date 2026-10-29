import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArrowRightIcon } from "@/components/ui/icons";
import { AnimatedSection, AnimatedImageWrapper } from "@/components/about/animated-about";

export const metadata: Metadata = {
  title: "About",
  description:
    "NOIRÉ is a study in quieter dressing: clean forms, considered materials and pieces made to move with you.",
};

const principles = [
  {
    title: "Intentional design",
    body: "Every seam, proportion and finish earns its place. We remove until only the essential remains, then refine it again.",
  },
  {
    title: "Everyday versatility",
    body: "Pieces are designed around real days: the commute, the studio, the long lunch and the late train home.",
  },
  {
    title: "Quality over noise",
    body: "We favour fewer, better pieces over constant newness. Clothes that soften with wear and stay in rotation.",
  },
];

const originFacts = [
  { label: "Founded", value: "2026" },
  { label: "Studio", value: "New York" },
  { label: "Materials", value: "Cotton, linen, wool" },
  { label: "Approach", value: "Fewer, better pieces" },
];

const textileSpecs = [
  { label: "Jersey", value: "260 GSM" },
  { label: "Fleece", value: "480 GSM" },
  { label: "Linen", value: "Pure Irish washed" },
];

export default function AboutPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "About" }]} />

      <section className="page-shell grid gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:py-20">
        <AnimatedSection>
          <div className="max-w-[560px]">
            <span className="eyebrow text-muted">About Noiré</span>
            <h1 className="mt-4 font-serif text-[52px] leading-[0.94] tracking-[-0.03em] sm:text-[68px] lg:text-[82px]">
              Clothing without the noise.
            </h1>
            <p className="mt-7 max-w-[470px] text-base leading-relaxed text-muted sm:text-lg">
              NOIRÉ began with a simple question: what if the clothes we reach for
              every day were the most considered pieces we own?
            </p>
            <blockquote className="mt-8 border-l border-ink pl-5 font-serif text-[22px] leading-[1.35] sm:text-[26px]">
              “The best pieces are the ones you stop noticing — because they simply
              work.”
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.14em] text-muted">
              <span>Est. 2026</span>
              <span aria-hidden="true">/</span>
              <span>New York</span>
              <span aria-hidden="true">/</span>
              <span>Independent studio</span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedImageWrapper>
          <div className="relative aspect-[4/5] overflow-hidden bg-surface lg:aspect-[5/6]">
            <Image
              src="/images/editorial/about-01-editorial-coat.jpg"
              alt="NOIRÉ editorial coat photographed in warm studio light"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="image-cover"
            />
            <div className="absolute bottom-5 left-5 border border-canvas/40 bg-ink/80 px-4 py-3 text-canvas backdrop-blur-sm">
              <p className="text-[9px] uppercase tracking-[0.18em] text-canvas/60">
                The essential wardrobe
              </p>
              <p className="mt-1 font-serif text-xl">No. 01</p>
            </div>
          </div>
        </AnimatedImageWrapper>
      </section>

      <section className="border-y border-line bg-[#e9e2d5]">
        <div className="page-shell grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-24">
          <AnimatedSection>
            <div>
              <span className="eyebrow text-muted">The origin</span>
              <h2 className="mt-3 font-serif text-[40px] leading-[1.02] sm:text-[54px]">
                Considered from the start.
              </h2>
              <p className="mt-6 max-w-[360px] text-sm leading-relaxed text-ink/70 sm:text-base">
                A small studio, a narrow palette and a refusal to add anything that
                did not make the everyday easier.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div>
              <div className="space-y-5 text-sm leading-relaxed text-ink/75 sm:text-base">
                <p>
                  We design around clean forms, honest materials and the kind of
                  details you notice only after wearing something for a season.
                  The result is a wardrobe that feels less like a statement and
                  more like a second skin.
                </p>
                <p>
                  Our starting point is always the ordinary day. A t-shirt that
                  holds its shape. Trousers that move without fuss. A layer that
                  works over everything. We begin with those pieces and refine
                  them until nothing is left to remove.
                </p>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink/20 pt-6">
                {originFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-[9px] uppercase tracking-[0.16em] text-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 font-serif text-[22px] leading-tight">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="page-shell py-16 lg:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((principle, index) => (
            <AnimatedSection key={principle.title} delay={index * 0.1}>
              <div className="border-t border-ink pt-5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  0{index + 1}
                </span>
                <h2 className="mt-5 font-serif text-[30px] leading-tight">
                  {principle.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {principle.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="page-shell py-16 lg:py-24">
          <AnimatedSection>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <span className="eyebrow text-muted">Textiles & craft</span>
                <h2 className="mt-3 max-w-[520px] font-serif text-[40px] leading-[1.02] sm:text-[54px]">
                  Chosen for touch and longevity.
                </h2>
              </div>
              <p className="max-w-[520px] text-sm leading-relaxed text-muted sm:text-base lg:justify-self-end">
                We work with mills that understand restraint. Dense cotton jersey,
                washed Irish linen and dry twill are selected for how they fall,
                breathe and age — not for how they look on a hanger.
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <AnimatedImageWrapper>
              <figure className="relative aspect-[4/3] overflow-hidden bg-surface">
                <Image
                  src="/images/editorial/about-03-jersey-macro.jpg"
                  alt="Close-up of jersey fabric and stitching"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="image-cover"
                />
                <figcaption className="absolute bottom-4 left-4 bg-canvas/90 px-3 py-2 text-[9px] uppercase tracking-[0.16em]">
                  Fig. 01 — Jersey, 260 GSM
                </figcaption>
              </figure>
            </AnimatedImageWrapper>

            <AnimatedSection delay={0.1}>
              <div className="flex flex-col justify-between gap-6 border border-line bg-canvas p-6 sm:p-8 h-full">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-muted">
                    Material notes
                  </span>
                  <dl className="mt-5 divide-y divide-line border-y border-line">
                    {textileSpecs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                          {spec.label}
                        </dt>
                        <dd className="text-right font-serif text-lg">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  Finished in small runs, with hardware and trims selected to
                  outlast the garment’s first season.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <AnimatedSection>
              <div className="flex flex-col justify-center border border-line bg-[#e9e2d5] p-6 sm:p-8 h-full">
                <span className="text-[9px] uppercase tracking-[0.16em] text-muted">
                  Construction
                </span>
                <p className="mt-4 font-serif text-[28px] leading-tight sm:text-[34px]">
                  Cut for movement. Built to be worn in.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  Relaxed proportions, reinforced seams and a palette that works
                  together without effort.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedImageWrapper>
              <figure className="relative aspect-[16/10] overflow-hidden bg-surface">
                <Image
                  src="/images/editorial/about-04-twill-detail.jpg"
                  alt="Close-up of twill and horn button detailing"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="image-cover"
                />
                <figcaption className="absolute bottom-4 left-4 bg-canvas/90 px-3 py-2 text-[9px] uppercase tracking-[0.16em]">
                  Fig. 02 — Dry twill, horn button
                </figcaption>
              </figure>
            </AnimatedImageWrapper>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 lg:py-24">
        <AnimatedSection>
          <div className="flex flex-col items-center border-t border-line pt-14 text-center">
            <span className="eyebrow text-muted">The essential wardrobe</span>
            <h2 className="mt-4 max-w-[760px] font-serif text-[42px] leading-[1.02] sm:text-[62px]">
              Made for the way you move.
            </h2>
            <p className="mt-5 max-w-[520px] text-sm leading-relaxed text-muted sm:text-base">
              Twelve pieces. One quiet system. Designed to be worn together, apart
              and every day in between.
            </p>
            <Link
              href="/shop"
              className="label mt-8 inline-flex items-center gap-2 bg-ink px-8 py-4 text-[11px] text-canvas transition-opacity hover:opacity-95"
            >
              Discover the collection
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <p className="mt-8 text-[9px] uppercase tracking-[0.16em] text-muted">
              Portfolio concept — No. 001
            </p>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
