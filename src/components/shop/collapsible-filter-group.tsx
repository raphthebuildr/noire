"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface FilterGroupProps {
  title: string;
  defaultOpen?: boolean;
  activeCount?: number;
  children: React.ReactNode;
}

export function FilterGroup({
  title,
  defaultOpen = true,
  activeCount = 0,
  children,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-line py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-1 text-left group"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span className="label text-[9px] text-muted group-hover:text-ink transition-colors">
            {title}
          </span>
          {activeCount > 0 ? (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-ink px-1 text-[9px] font-medium text-canvas">
              {activeCount}
            </span>
          ) : null}
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-muted transition-transform duration-200 group-hover:text-ink ${
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 space-y-2">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
