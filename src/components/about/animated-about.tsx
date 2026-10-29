"use client";

import { motion } from "motion/react";

const springTransition = {
  type: "spring" as const,
  damping: 12,
  stiffness: 100,
  bounce: 0.5,
};

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ ...springTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedImageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring" as const,
        damping: 14,
        stiffness: 90,
        bounce: 0.6,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
