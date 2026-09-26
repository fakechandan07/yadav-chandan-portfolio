"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { photos } from "@/content/site";

// Each word lights up as it scrolls through the viewport.
const before = "I build for the web, for phones and for games — Swift, Java, JavaScript and Node.js are the tools on my bench. Off the screen, you’ll find me";
const after = "somewhere above the snowline, looking for the next thing to cook.";

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="intro__word">
          {w}{" "}
        </span>
      ))}
    </>
  );
}

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q(".intro__word, .intro__pill"),
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: q(".intro__text")[0], start: "top 80%", end: "bottom 55%", scrub: true },
          },
        );
        gsap.fromTo(
          q(".intro__pill img"),
          { scale: 1.6 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  const pill = photos.fieldNotes[2];

  return (
    <section ref={root} id="intro" className="intro section">
      <p className="section-label mono">(Intro)</p>
      <p className="intro__text">
        <Words text={before} />
        <span className="intro__pill" aria-hidden="true">
          <img src={pill.small} alt="" width={pill.width} height={pill.height} loading="lazy" />
        </span>{" "}
        <Words text={after} />
      </p>
    </section>
  );
}
