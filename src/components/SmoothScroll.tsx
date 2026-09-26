"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import { onSiteReady, isSiteReady } from "@/lib/ready";
import { prefersReducedMotion } from "@/lib/media";

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold the page still while the preloader is up.
    if (!isSiteReady()) lenis.stop();
    const off = onSiteReady(() => lenis.start());

    return () => {
      off();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
