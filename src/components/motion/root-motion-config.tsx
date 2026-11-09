"use client";

import { MotionConfig } from "motion/react";

/**
 * Honors the user's OS-level reduced-motion preference for every Motion
 * animation in the tree: transform/layout animations are disabled and only
 * opacity cross-fades remain. CSS animations are still guarded separately
 * in globals.css.
 */
export function RootMotionConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
