"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget, getLenis } from "@/lib/scroll";
import { site, socials } from "@/content/site";
import Magnetic from "./Magnetic";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#field-notes", label: "Field notes" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Slide the bar away while scrolling down, back in when scrolling up.
  useEffect(() => {
    const header = headerRef.current!;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > 200;
        header.classList.toggle("is-hidden", hide);
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const menu = menuRef.current!;
    const items = menu.querySelectorAll(".menu__link > span, .menu__foot");
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      gsap.set(menu, { visibility: "visible" });
      gsap.fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, delay: 0.3 });
    } else {
      lenis?.start();
      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
        },
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Wait a beat so the menu can close before the page moves.
    window.setTimeout(() => scrollToTarget(href), open ? 350 : 0);
  };

  return (
    <>
      <header ref={headerRef} className="nav">
        <Magnetic strength={0.4}>
          <a href="#top" className="nav__logo" onClick={go("#top")} aria-label="Back to top">
            <span data-magnetic-inner>
              {site.firstName[0]}
              {site.lastName[0]}
              <sup>©</sup>
            </span>
          </a>
        </Magnetic>
        <nav className="nav__links" aria-label="Sections">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={go(l.href)} className="nav__link">
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>
        <button
          className="nav__menu-btn"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div ref={menuRef} id="menu" className="menu" aria-hidden={!open}>
        <nav className="menu__links" aria-label="Menu">
          {links.map((l, i) => (
            <a key={l.href} href={l.href} onClick={go(l.href)} className="menu__link" tabIndex={open ? 0 : -1}>
              <span>
                <sup className="mono">0{i + 1}</sup>
                {l.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="menu__foot mono">
          {socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
