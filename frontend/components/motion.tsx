"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/**
 * Fade + slide-up on scroll into view. Honors prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered container — children using `staggerItem` animate in sequence.
 */
export function StaggerGroup({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/**
 * Counts up from 0 to `value` when scrolled into view. `value` may contain a
 * numeric part plus a suffix/prefix (e.g. "500K", "22.58×", "3").
 */
export function CountUp({
  value,
  duration = 1400,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : NaN;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2]?.includes(".") ? match[2].split(".")[1].length : 0;

  const [display, setDisplay] = useState(
    reduce || isNaN(target) ? value : `${prefix}0${suffix}`
  );

  useEffect(() => {
    if (!inView || isNaN(target) || reduce) {
      if (reduce || isNaN(target)) setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = (target * eased).toFixed(decimals);
      setDisplay(`${prefix}${current}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, decimals, prefix, suffix, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

export { motion };
