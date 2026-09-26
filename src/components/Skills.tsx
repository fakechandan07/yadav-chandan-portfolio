"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { disciplines, toolbox } from "@/content/site";

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Rows fill with colour from whichever edge the pointer came in through.
      const cleanups: (() => void)[] = [];
      q(".skill").forEach((row: HTMLElement) => {
        const fill = row.querySelector<HTMLElement>(".skill__fill")!;
        // Hand the CSS starting offset over to GSAP so yPercent: 0 really is flush.
        gsap.set(fill, { y: 0, yPercent: 101 });
        const edge = (e: PointerEvent) => {
          const r = row.getBoundingClientRect();
          return e.clientY - r.top < r.height / 2 ? -101 : 101;
        };
        const enter = (e: PointerEvent) => {
          row.classList.add("is-active");
          gsap.fromTo(fill, { yPercent: edge(e) }, { yPercent: 0, duration: 0.5, ease: "expo.out", overwrite: true });
        };
        const leave = (e: PointerEvent) => {
          row.classList.remove("is-active");
          gsap.to(fill, { yPercent: edge(e), duration: 0.5, ease: "expo.out", overwrite: true });
        };
        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("pointerleave", leave);
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(q(".skills__title")[0], {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 110,
              duration: 1,
              ease: "expo.out",
              stagger: 0.025,
              scrollTrigger: { trigger: self.elements[0], start: "top 85%" },
            }),
        });

        gsap.from(q(".skill"), {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: q(".skills__list")[0], start: "top 80%" },
        });

        // Marquee rows speed up with scroll velocity and flip with scroll direction.
        // Each track holds the list twice, so wrapping at -50% is seamless.
        const tracks = q(".marquee__track") as HTMLElement[];
        const setters = tracks.map((t) => gsap.quickSetter(t, "xPercent"));
        const offsets: number[] = tracks.map((_, i) => (i % 2 === 0 ? 0 : -25));
        const wrap = gsap.utils.wrap(-50, 0);
        let dir = 1;
        let speed = 1;
        const st = ScrollTrigger.create({
          trigger: q(".marquee")[0],
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            dir = self.direction || dir;
            speed = Math.max(speed, Math.min(8, 1 + Math.abs(self.getVelocity()) / 300));
          },
        });
        const tick = () => {
          const dt = gsap.ticker.deltaRatio();
          speed += (1 - speed) * 0.06 * dt;
          offsets.forEach((o, i) => {
            const base = i % 2 === 0 ? -1 : 1;
            offsets[i] = wrap(o + base * dir * speed * 0.03 * dt);
            setters[i](offsets[i]);
          });
        };
        gsap.ticker.add(tick);
        return () => {
          st.kill();
          gsap.ticker.remove(tick);
        };
      });

      return () => cleanups.forEach((c) => c());
    },
    { scope: root },
  );

  const row = [...toolbox, ...toolbox];

  return (
    <section ref={root} id="skills" className="skills section">
      <div className="skills__head">
        <p className="section-label mono">(02) Skills</p>
        <h2 className="skills__title">What I build</h2>
        <p className="skills__sub mono">Web, Mobile &amp; Software Dev</p>
      </div>

      <ol className="skills__list">
        {disciplines.map((d, i) => (
          <li key={d.title} className="skill" data-cursor="hidden">
            <div className="skill__fill" aria-hidden="true" />
            <span className="skill__index mono">0{i + 1}</span>
            <h3 className="skill__title">{d.title}</h3>
            <p className="skill__blurb">{d.blurb}</p>
            <ul className="skill__tools" aria-label={`${d.title} tools`}>
              {d.tools.map((t) => (
                <li key={t} className="mono">
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="marquee" aria-label="Toolbox">
        <ul className="sr-only">
          {toolbox.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {[0, 1].map((r) => (
          <div key={r} className={`marquee__row marquee__row--${r}`} aria-hidden="true">
            <div className="marquee__track">
              {row.map((t, i) => (
                <span key={i} className="marquee__item">
                  {r === 1 ? <em className="serif">{t}</em> : t}
                  <span className="marquee__star">✳</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
