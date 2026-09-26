import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import About from "@/components/About";
import Skills from "@/components/Skills";
import FieldNotes from "@/components/FieldNotes";
import Contact from "@/components/Contact";
import Extras from "@/components/Extras";

export default function Home() {
  return (
    <>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Extras />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <About />
        <Skills />
        <FieldNotes />
        <Contact />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
