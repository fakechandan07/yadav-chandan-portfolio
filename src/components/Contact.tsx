"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { site, socials } from "@/content/site";
import Magnetic from "./Magnetic";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(q(".contact__title")[0], {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.12,
              scrollTrigger: { trigger: self.elements[0], start: "top 80%" },
            }),
        });
        gsap.from(q(".contact__cta"), {
          scale: 0,
          rotate: -30,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: { trigger: q(".contact__cta")[0], start: "top 90%" },
        });
      });
    },
    { scope: root },
  );

  const year = new Date().getFullYear();

  return (
    <section ref={root} id="contact" className="contact">
      <p className="section-label mono">(04) Contact</p>
      <h2 className="contact__title">
        Got an idea?
        <br />
        Let’s <em className="serif">cook.</em>
      </h2>

      <div className="contact__row">
        <Magnetic strength={0.5}>
          <a
            className="contact__cta"
            href={socials[0].href}
            target="_blank"
            rel="noreferrer"
            data-cursor="hidden"
          >
            <span data-magnetic-inner>Say hi ↗</span>
          </a>
        </Magnetic>

        <ul className="contact__socials">
          {socials.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer" className="social" data-cursor="label" data-cursor-label="Open">
                <span className="social__label">{s.label}</span>
                <span className="social__handle mono">{s.handle}</span>
                <span className="social__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer mono">
        <span>
          © {year} {site.firstName} {site.lastName}
        </span>
        <span className="footer__built">Built from scratch — Next.js, Three.js &amp; GSAP</span>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
