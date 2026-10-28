import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "flex flex-col items-center text-center"
          : "flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
      }
    >
      <div>
        {eyebrow ? (
          <span className="eyebrow mb-2 block text-muted">{eyebrow}</span>
        ) : null}
        <h2 className="font-serif text-[36px] leading-[1.05] tracking-[-0.015em] sm:text-[44px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-[520px] text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="label inline-flex w-fit items-center gap-2 border-b border-ink pb-1 text-[11px] transition-opacity hover:opacity-60"
        >
          {linkLabel}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
