"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/media";
import { photos, toolbox } from "@/content/site";

const facts = [
  ["Focus", "Web, mobile & games"],
  ["Stack", toolbox.slice(0, 4).join(" · ")],
  ["Status", "Cooking something new"],
  ["Off-screen", "Mountains, bridges, waterfalls"],
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  // Colour follows the cursor through a black-and-white portrait.
  useEffect(() => {
    const el = frame.current!;
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const state = { x: 50, y: 50, r: 0 };
    const apply = () => {
      el.style.setProperty("--x", `${state.x}%`);
      el.style.setProperty("--y", `${state.y}%`);
      el.style.setProperty("--r", `${state.r}px`);
    };
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      gsap.to(state, {
        x: ((e.clientX - b.left) / b.width) * 100,
        y: ((e.clientY - b.top) / b.height) * 100,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: apply,
      });
    };
    const onEnter = () => gsap.to(state, { r: 170, duration: 0.8, ease: "expo.out", onUpdate: apply });
    const onLeave = () => gsap.to(state, { r: 0, duration: 0.6, ease: "expo.inOut", onUpdate: apply });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(q(".about__title")[0], {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: self.elements[0], start: "top 85%" },
            }),
        });

        gsap.fromTo(
          q(".about__portrait img"),
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        gsap.from(q(".about__facts li"), {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: q(".about__facts")[0], start: "top 85%" },
        });
      });

      // Touch screens have no hover, so scrolling wipes the colour in instead.
      mm.add("(hover: none), (pointer: coarse)", () => {
        gsap.fromTo(
          frame.current,
          { "--r": "0px" },
          {
            "--r": "900px",
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  const p = photos.portrait;

  return (
    <section ref={root} id="about" className="about section">
      <div ref={frame} className="about__portrait" data-cursor="label" data-cursor-label="Colour">
        <img
          className="about__img about__img--mono"
          src={p.src}
          srcSet={`${p.small} 720w, ${p.src} 1500w`}
          sizes="(max-width: 900px) 100vw, 45vw"
          alt={p.alt}
          width={p.width}
          height={p.height}
          loading="lazy"
        />
        <img
          className="about__img about__img--color"
          src={p.src}
          srcSet={`${p.small} 720w, ${p.src} 1500w`}
          sizes="(max-width: 900px) 100vw, 45vw"
          alt=""
          aria-hidden="true"
          width={p.width}
          height={p.height}
          loading="lazy"
        />
        <p className="about__hint mono">Hover to add colour</p>
      </div>

      <div className="about__body">
        <p className="section-label mono">(01) About</p>
        <h2 className="about__title">
          A developer who’d rather be <em className="serif">outside</em> — and codes like it.
        </h2>
        <div className="about__copy">
          <p>
            I’m Chandan. I write software for the web, for phones and for games: native iOS in Swift,
            cross-platform apps in React Native, and web front-ends and servers in JavaScript and Node.js.
          </p>
          <p>
            I like building things people can actually use, from storefronts that sell to games that
            steal an evening. The rest of the time I’m out chasing mountains.
          </p>
        </div>
        <ul className="about__facts">
          {facts.map(([k, v]) => (
            <li key={k}>
              <span className="mono">{k}</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
