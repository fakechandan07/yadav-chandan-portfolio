"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroState } from "@/lib/heroState";
import { onSiteReady } from "@/lib/ready";
import { hasFinePointer, prefersReducedMotion } from "@/lib/media";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="hero__char" aria-hidden="true">
          <span>{ch}</span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [animate, setAnimate] = useState(true);

  useEffect(() => setAnimate(!prefersReducedMotion()), []);

  // Pointer feeds the 3D scene (and the letter weights below).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      heroState.pointerActive = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Letters swell from light to heavy as the cursor gets near them.
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const chars = Array.from(root.current!.querySelectorAll<HTMLElement>(".hero__char > span"));
    const weights = chars.map(() => 700);
    let px = -9999;
    let py = -9999;
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    const tick = () => {
      if (heroState.progress >= 1) return;
      // Read every position first, then write, so layout runs once per frame.
      const centers = chars.map((el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
      const radius = window.innerWidth * 0.22;
      chars.forEach((el, i) => {
        const d = Math.hypot(px - centers[i][0], py - centers[i][1]);
        const t = Math.max(0, 1 - d / radius);
        const target = 700 - t * t * 500;
        const next = weights[i] + (target - weights[i]) * 0.15;
        if (Math.abs(next - weights[i]) < 0.5) return;
        weights[i] = next;
        el.style.fontWeight = next.toFixed(0);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q(".hero__char > span"), { yPercent: 110 });
        gsap.set(q(".hero__reveal > *"), { yPercent: 110 });

        const intro = gsap.timeline({ paused: true });
        intro
          .to(q(".hero__char > span"), {
            yPercent: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.045,
          })
          .to(q(".hero__reveal > *"), { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.5);
        const off = onSiteReady(() => intro.play());

        // Scroll away: the two name lines drift apart and fade out.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              heroState.progress = self.progress;
            },
          },
        });
        tl.to(q(".hero__line--first"), { xPercent: -18, ease: "none" }, 0)
          .to(q(".hero__line--last"), { xPercent: 18, ease: "none" }, 0)
          .to(q(".hero__content"), { opacity: 0, ease: "power1.in" }, 0);

        return () => off();
      });
    },
    { scope: root },
  );

  const year = new Date().getFullYear();

  return (
    <section ref={root} id="top" className="hero">
      <HeroScene animate={animate} />
      <div className="hero__content">
        <div className="hero__meta mono">
          <p className="hero__reveal">
            <span>({site.role})</span>
          </p>
          <p className="hero__reveal hero__meta-right">
            <span>Portfolio ©{year}</span>
          </p>
        </div>

        <h1 className="hero__name">
          <span className="sr-only">
            {site.firstName} {site.lastName}
          </span>
          <span className="hero__line hero__line--first">
            <Chars text={site.firstName} />
          </span>
          <span className="hero__line hero__line--last">
            <Chars text={site.lastName} />
          </span>
        </h1>

        <div className="hero__foot">
          <p className="hero__tagline hero__reveal">
            <span>
              is <em className="serif">cooking</em> something new.
            </span>
          </p>
          <a
            href="#intro"
            className="hero__scroll mono hero__reveal"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#intro");
            }}
          >
            <span>Scroll to explore ↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
