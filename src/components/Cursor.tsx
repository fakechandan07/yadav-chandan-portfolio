"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer } from "@/lib/media";

type CursorState = "default" | "link" | "label" | "hidden";

// A dot that tracks the pointer exactly and a ring that trails behind it.
// Elements opt into states with data-cursor="link|label|hidden" and
// data-cursor-label="View". Plain links and buttons get "link".
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer()) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const root = document.documentElement;
    // Stay hidden until the pointer has a real position.
    root.classList.add("has-cursor", "cursor-away");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...pointer };
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");

    const setState = (state: CursorState, text = "") => {
      ring.dataset.state = state;
      dot.dataset.state = state;
      label.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      setDotX(pointer.x);
      setDotY(pointer.y);
      root.classList.remove("cursor-away");
    };

    const resolve = (target: EventTarget | null) => {
      const el = target instanceof Element ? target.closest<HTMLElement>("[data-cursor], a, button") : null;
      if (!el) return setState("default");
      const state = (el.dataset.cursor as CursorState | undefined) ?? "link";
      setState(state, el.dataset.cursorLabel ?? "");
    };

    const onOver = (e: PointerEvent) => resolve(e.target);
    const onDown = () => ring.classList.add("is-pressed");
    const onUp = () => ring.classList.remove("is-pressed");
    const onLeave = () => root.classList.add("cursor-away");

    const tick = () => {
      const k = 1 - Math.pow(1 - 0.2, gsap.ticker.deltaRatio());
      trail.x += (pointer.x - trail.x) * k;
      trail.y += (pointer.y - trail.y) * k;
      setRingX(trail.x);
      setRingY(trail.y);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);

    return () => {
      root.classList.remove("has-cursor", "cursor-away");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring" data-state="default">
        <div className="cursor__circle">
          <span ref={labelRef} className="cursor__label" />
        </div>
      </div>
      <div ref={dotRef} className="cursor__dot" data-state="default" />
    </div>
  );
}
