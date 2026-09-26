"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { markSiteReady } from "@/lib/ready";
import { prefersReducedMotion } from "@/lib/media";

const SEEN_KEY = "cy-intro-seen";

function seenIntro() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberIntro() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage can be blocked; the intro just plays again.
  }
}

// Full-screen counter that covers font loading, then lifts like a curtain.
// Plays once per browser session.
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current!;
    if (seenIntro() || prefersReducedMotion()) {
      markSiteReady();
      setDone(true);
      return;
    }

    const counter = { value: 0 };
    const tl = gsap.timeline({ paused: true });
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.value);
        countRef.current!.textContent = String(v).padStart(3, "0");
        barRef.current!.style.transform = `scaleX(${counter.value / 100})`;
      },
    })
      .to(root.querySelectorAll(".preloader__line > span"), {
        yPercent: -110,
        duration: 0.6,
        ease: "power3.in",
        stagger: 0.05,
      })
      .add(() => markSiteReady(), "-=0.1")
      .to(root, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.2")
      .add(() => {
        rememberIntro();
        setDone(true);
      });

    // Start once fonts are ready so the counter never sits on fallback type.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) tl.play();
    });
    return () => {
      cancelled = true;
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Loading">
      <div className="preloader__top">
        <p className="preloader__line mono">
          <span>Chandan Yadav — Portfolio</span>
        </p>
        <p className="preloader__line mono">
          <span>©{new Date().getFullYear()}</span>
        </p>
      </div>
      <p className="preloader__title preloader__line">
        <span>
          Chandan is <em className="serif">cooking</em>
        </span>
      </p>
      <div className="preloader__bottom">
        <div className="preloader__bar">
          <div ref={barRef} />
        </div>
        <p className="preloader__count preloader__line">
          <span ref={countRef}>000</span>
        </p>
      </div>
    </div>
  );
}
