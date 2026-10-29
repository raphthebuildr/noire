"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="border-b border-line py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-6 text-left text-sm font-medium sm:text-base group"
        aria-expanded={isOpen}
      >
        <span className="group-hover:text-ink transition-colors">{question}</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:text-ink ${
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 max-w-[720px] text-sm leading-relaxed text-muted">
              {answer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
