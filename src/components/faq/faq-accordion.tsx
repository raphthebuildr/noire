"use client";

import { useState } from "react";
import { AccordionItem } from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-14">
      {groups.map((group, groupIndex) => (
        <section
          key={group.title}
          id={group.title.toLowerCase().replace(/[^a-z]+/g, "-")}
          className="scroll-mt-28"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                0{groupIndex + 1}
              </span>
              <h2 className="mt-2 font-serif text-[32px] leading-tight sm:text-[40px]">
                {group.title}
              </h2>
            </div>
            <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted">
              {String(group.items.length).padStart(2, "0")} questions
            </span>
          </div>

          <div className="mt-5 border-t border-line">
            {group.items.map((item) => {
              const uniqueKey = `${group.title}-${item.question}`;
              return (
                <AccordionItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openKey === uniqueKey}
                  onToggle={() =>
                    setOpenKey(openKey === uniqueKey ? null : uniqueKey)
                  }
                />
              );
            })}
          </div>

          {group.title === "Sizing & fit" ? (
            <div
              id="size-guide"
              className="mt-8 scroll-mt-28 border border-line bg-paper p-6 sm:p-8"
            >
              <span className="eyebrow text-muted">Measurement desk</span>
              <h3 className="mt-2 font-serif text-[28px] leading-tight">
                Find your size.
              </h3>
              <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-muted">
                Compare chest, waist, hip and inseam measurements. If you are
                between sizes, size down for a closer fit.
              </p>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
