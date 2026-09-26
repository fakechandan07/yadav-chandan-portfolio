"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/media";

// Pulls its child toward the pointer while hovered, then springs back.
// An element inside marked [data-magnetic-inner] moves further for depth.
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" }) : null;
    const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" }) : null;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo?.(dx * strength * 0.6);
      iyTo?.(dy * strength * 0.6);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
