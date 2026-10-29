"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface PolicySectionData {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

export function PoliciesAccordion({ sections }: { sections: PolicySectionData[] }) {
  const [openId, setOpenId] = useState<string>("shipping");

  return (
    <div className="max-w-[780px] space-y-6">
      {sections.map((section) => {
        const isOpen = openId === section.id;
        return (
          <div
            key={section.id}
            id={section.id}
            className="scroll-mt-28 border border-line bg-paper p-6 sm:p-8 transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? "" : section.id)}
              className="flex w-full items-center justify-between gap-6 text-left group cursor-pointer"
              aria-expanded={isOpen}
            >
              <div className="flex items-baseline gap-4">
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  {section.number}
                </span>
                <h2 className="font-serif text-[28px] leading-tight sm:text-[34px] group-hover:text-ink transition-colors">
                  {section.title}
                </h2>
              </div>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-hover:text-ink ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-line mt-6">{section.content}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
