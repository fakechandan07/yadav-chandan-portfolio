"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { photos } from "@/content/site";

// Photos from the road. On desktop the section pins and the strip scrolls
// sideways; on phones (or with reduced motion) it's a plain vertical stack.
export default function FieldNotes() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const skewTo = gsap.quickTo(q(".note__frame"), "skewX", { duration: 0.5, ease: "power3.out" });

        const scroll = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => skewTo(gsap.utils.clamp(-6, 6, self.getVelocity() / -400)),
          },
        });

        // Images slide inside their frames for depth while the strip moves.
        q(".note__frame img").forEach((img: HTMLElement) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: scroll,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });

      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        q(".note__frame img").forEach((img: HTMLElement) => {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="field-notes" className="notes">
      <div ref={track} className="notes__track">
        <div className="notes__intro">
          <p className="section-label mono">(03) Field notes</p>
          <h2 className="notes__title">
            Off the <em className="serif">grid.</em>
          </h2>
          <p className="notes__lede">
            Bridges, snowlines and waterfalls — the part of me that isn’t a screen. Keep scrolling.
          </p>
        </div>

        {photos.fieldNotes.map((p, i) => (
          <figure key={p.src} className={`note note--${i}`} data-cursor="label" data-cursor-label={`FN—0${i + 1}`}>
            <div className="note__frame">
              <img
                src={p.src}
                srcSet={p.small !== p.src ? `${p.small} 720w, ${p.src} ${p.width}w` : undefined}
                sizes="(max-width: 900px) 90vw, 40vw"
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading="lazy"
              />
            </div>
            <figcaption className="mono">
              <span>FN—0{i + 1}</span>
              <span>{p.caption}</span>
            </figcaption>
          </figure>
        ))}

        <div className="notes__outro">
          <p className="notes__outro-text">
            Back to the <em className="serif">code</em> →
          </p>
        </div>
      </div>
    </section>
  );
}
