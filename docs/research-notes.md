# Portfolio research notes

Research for building Yadav Chandan's portfolio. The goal: a site that feels as
good as the best award-winning portfolios (Awwwards SOTD / SOTM level), with 3D,
cursor-reactive motion and a strong aesthetic — without being slow or unusable.

> **How this was gathered.** The build sandbox's network policy blocked direct
> page visits (gallery-play.be, awwwards.com, and most sites returned 403), so
> these notes come from web search results, published case studies and jury
> write-ups, plus well-known reference sites. Nothing below claims to describe a
> page I actually loaded. Before we lock the design, open the reference links
> yourself and flag what you love.

---

## 1. How the best sites get judged

Awwwards scores every site on four criteria:

| Criterion  | Weight | What it means for us |
|------------|--------|----------------------|
| Design     | 40%    | Typography, layout, colour, and a consistent visual system |
| Usability  | 30%    | Fast, works on mobile, readable, navigable, accessible |
| Creativity | 20%    | The one memorable idea |
| Content    | 10%    | Real projects, real writing, a clear story |

Design and usability make up 70% of the score. Jurors describe creativity (the
3D and the wild effects) as *a differentiator layered on top of strong design
and usability, not a replacement for them*. Winners in 2026 use WebGL "for
atmosphere and framing rather than spectacle". So the plan is to get the
fundamentals flawless first and then add one or two show-stopping moments.

## 2. Reference sites and what to steal from each

| Site | What makes it good | Steal this |
|------|--------------------|------------|
| **Gallery Play®** (gallery-play.be), an Awwwards nominee | A creative platform where sport meets fashion, art and design. Editorial, gallery-like presentation of athlete and brand work. | An editorial, fashion-magazine grid, big confident type, and treating projects like exhibited pieces. *(Not loaded directly; check it yourself.)* |
| **Bruno Simon** (bruno-simon.com), Awwwards SOTM Jan 2026; Developer SOTY 2019 | The whole portfolio is a 3D world: you drive a small car around to find projects and links | Turning navigation into play. One strong interactive concept beats ten effects. |
| **Messenger**, Awwwards Site of the Year 2025 | A tiny WebGL planet spinning in real time, with a delivery character. GPU physics, lighting and animation. | A small, cute, contained 3D world is more charming (and cheaper to render) than a huge one. |
| **Goodgrowth** (Matt Stone), Codrops case study, Aug 2026 | Late-90s console boot sequence (PlayStation/Dreamcast), spinning discs, projects on a scroll-driven globe, sound | A nostalgic *theme* that ties every detail together. Storyboard the animations frame by frame. |
| **Hubtown** (Unseen Studio), Awwwards SOTD Jun 2026 | Three.js hero scene with a **mouse-reveal** interaction | A cursor that *uncovers* a hidden layer or scene |
| **Minh Pham**, Awwwards SOTD | GSAP motion system layered over Three.js/WebGL | One motion language (shared easings and durations) across DOM and WebGL |
| **Niccolò Miranda, "Paper Portfolio"**, SOTD + SOTM | Newspaper-style layout built with WebGL, GSAP and Three.js | A strong metaphor (newspaper) that drives the layout |
| **Thibault Introvigne** | Controls a spaceman and collects 10 items, each revealing a past job or project | Gamified discovery: collectibles = experience entries |
| **WoraWork** | A cosy Zelda / Animal Crossing-style world. Interact with objects to learn about the author. | Personality: the site *feels* like the person |
| **Samsy** | Cyberpunk 3D city on **WebGPU**, 120+ fps | WebGPU is production-ready for the adventurous |
| **Léo Parpeix, Pacôme Pertant, Adcker, G. Colombel**, 2026 Developer SOTDs | Current-year personal developer portfolios that won SOTD | Browse these on Awwwards for the current bar |
| **Codrops portfolio case studies** | Liquid image hover: a ping-pong flow map + velocity field → chromatic-aberration smear that trails and settles instead of snapping to the cursor | Our project-card hover effect |

Also worth browsing: Awwwards "Portfolio", "Three.js" and "Developer" categories;
Codrops (`tympanus.net/codrops`) case studies; refs.gallery WebGL category;
CSS Design Awards WebGL gallery; minimal.gallery for calmer aesthetics.

## 3. The "goated" UI element catalogue

Grouped by layer, each with how we'd build it. ★ = must-have for this site.

### Cursor and pointer
- ★ **Custom cursor.** A small dot plus a lagging ring (lerped position). It grows,
  inverts (`mix-blend-mode: difference`) or shows a label ("View", "Drag",
  "Play") over interactive things. Hidden on touch devices.
- ★ **Magnetic buttons.** Buttons and nav links lean toward the pointer inside a
  radius, then spring back (GSAP `quickTo` or spring physics).
- ★ **Mouse-parallax 3D hero.** The camera or object tilts slightly with the
  pointer, which gives depth without any scrolling.
- **Mouse reveal/mask.** A circular mask follows the cursor and reveals a second
  image, scene or "behind the scenes" layer (Hubtown-style).
- **Cursor trail / fluid sim.** WebGL fluid or ink that follows the pointer. Use
  sparingly, for example only in the hero.
- **Hover image preview.** Hovering a project name in a list shows a floating
  image that follows the cursor with inertia, with a shader distortion driven by
  velocity.

### 3D and WebGL
- ★ **Hero 3D scene.** One signature object or world (see concept options in §5).
  Built with React Three Fiber, lit with an HDRI environment, with post-processing
  (bloom, subtle chromatic aberration, film grain, vignette).
- ★ **Shader-based image transitions.** Displacement or noise "melt" between
  project images. Scroll-velocity wave distortion on images (the vertex shader
  bends with scroll speed and eases out).
- **Liquid hover distortion.** Flow-map/velocity-field smear (Codrops technique
  above).
- **Particles / point clouds.** Your name or a model made of particles that
  scatter from the cursor and re-form.
- **Scroll-driven camera path.** The camera travels through the scene as you
  scroll (chapters = sections).
- **Physics toys.** Draggable 3D objects (Rapier physics) as tactile
  playthings, e.g. skill icons you can throw around.
- Future-proofing: glTF 2.0 for models; consider Gaussian splats for
  photoreal captures. WebGPU with WebGL fallback if we go heavy.

### Scroll and motion
- ★ **Smooth scroll with Lenis.** The 2026 standard. Normalises input, keeps
  native scroll APIs working, and pairs with GSAP ScrollTrigger.
- ★ **Text reveals.** Split headings into lines/words/chars and animate them
  in with a mask (slide up from behind a clip). Staggered, with one shared easing.
- ★ **Kinetic typography.** Variable-font weight/width animating on scroll or
  hover, a giant name that stretches, marquee rows of skills.
- **Pinned sections / horizontal scroll** for the projects gallery.
- **Scroll-snap chapters** for a story-like "about" section.
- **Native CSS scroll-driven animations** (`animation-timeline: view()`) for
  simple reveals with zero JS, now baseline in major browsers.
- **Infinite marquee / loop.** Seamless looping project reel.

### Navigation and transitions
- ★ **Preloader / intro sequence.** A counter 0→100 or a themed boot sequence
  (Goodgrowth-style) that hides asset loading and sets the mood. Under ~2.5s
  and skippable on repeat visits.
- ★ **Page transitions.** A curtain wipe, shared-element morph (the project
  thumbnail expands into the case-study hero), or WebGL dissolve. The View
  Transitions API makes shared-element transitions native.
- **Fullscreen menu** with huge staggered links and a hover image per link.
- **Live details:** local time in your city, "currently listening/building"
  status, availability dot.

### Aesthetic finishing
- ★ **Film grain / noise overlay.** A subtle animated noise texture over
  everything, which adds analogue warmth.
- ★ **A strict type system.** One expressive display face plus one clean
  sans or mono. Huge headlines (15–20vw) against tiny, precise UI labels.
- **A limited palette.** Near-black and off-white plus one electric accent
  colour. Dark mode by default with a toggle.
- **Grid lines / editorial layout.** Visible column guides, index numbers
  (01, 02 …), and metadata like year, role and stack.
- **Sound design (opt-in).** Soft UI clicks and ambient loop, muted by
  default with a visible toggle.
- **Easter eggs.** Konami code, console message for devs, secret theme.

## 4. Non-negotiables (the 30% usability score)

- **Performance.** LCP < 2.5s, 60fps on mid-range phones. Lazy-load the 3D
  scene after first paint; compress models (Draco/Meshopt), KTX2 textures;
  cap device pixel ratio at ~1.5–2; pause render loop when off-screen or tab
  hidden. Kinetic text must not become a slow LCP element or cause layout
  shift.
- **Mobile-first.** Desktop-only scroll experiences are "out" in 2026. Every
  cursor effect needs a touch equivalent (tilt via gyroscope, tap states) or
  a graceful fallback. Simpler 3D on low-power devices.
- **Accessibility.** Respect `prefers-reduced-motion` (turn off smooth scroll,
  parallax, big transitions). Real semantic HTML behind the WebGL. Keyboard
  navigation and visible focus. Text contrast AA.
- **Content still wins.** Real projects, each with problem → role → process →
  result, plus links (live, GitHub). A clear contact CTA on every page.
- **SEO/sharing.** Proper titles, meta, Open Graph image, sitemap.

## 5. Concept directions for your site

Pick one big idea; everything else supports it.

1. **"The Studio" (recommended).** A dark, editorial portfolio with one
   stunning 3D hero: an abstract glass/chrome sculpture (or a stylised 3D
   version of your initials) that refracts, reacts to the cursor, and morphs
   between shapes as you scroll into each section. Liquid-hover project list,
   shader page transitions, grain, magnetic UI. It gives the best balance of
   wow factor, speed and professionalism, and it's achievable and polished.
2. **"Explorable world."** A Bruno Simon / Messenger-style small 3D world
   (a tiny floating island or planet) you walk or drive around to find
   projects. Maximum memorability, but much more 3D modelling work, and it
   needs a plain "skip to content" version for recruiters.
3. **"Nostalgia OS."** A themed site like Goodgrowth: the portfolio is a retro
   console or desktop OS with a boot sequence, windows, discs as projects and
   CRT shaders. Highly personal and fun; the theme must fit your personality.

## 6. Proposed tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js (App Router) + TypeScript** | SEO, image optimisation, easy Vercel deploy |
| 3D | **Three.js via React Three Fiber** + `@react-three/drei` + `@react-three/postprocessing` | Industry standard for 3D portfolios |
| Physics (optional) | `@react-three/rapier` | Throwable/draggable objects |
| Animation | **GSAP** (fully free, incl. SplitText & ScrollTrigger) | The motion engine behind most award winners |
| Smooth scroll | **Lenis** | 2026 default, pairs with ScrollTrigger |
| UI motion | Motion (Framer Motion) for component-level springs | Nice for magnetic/hover springs |
| Styling | Tailwind CSS + CSS variables for the theme | Fast, consistent design tokens |
| Shaders | GLSL via `shaderMaterial` / `glslify` | Custom distortion, noise, transitions |
| Content | MDX files for case studies | Easy to write and update projects |
| Deploy | Vercel | Zero-config for Next.js |

"Lenis + GSAP ScrollTrigger + Three.js" is called out as *the* production
stack for premium scroll-driven 3D sites in 2026.

## 7. Suggested site map

1. **Preloader.** Counter plus name reveal.
2. **Hero.** Name in huge kinetic type, 3D signature object, one-line
   intro, local time and availability.
3. **Selected work.** 4–6 projects; hover-preview list or horizontal pinned
   gallery; each opens a case-study page via a shader transition.
4. **About.** Photo with a hover/reveal effect, short story, scroll-reveal
   text, skills marquee or physics toy.
5. **Experience / timeline.**
6. **Contact.** Giant "Let's talk" with a magnetic email button, socials,
   and a footer with a small easter egg.

## 8. What I need from you

- What you do (developer / designer / both / something else) and the vibe
  you want (dark & luxe, playful & colourful, retro, minimal).
- Which concept in §5 you like, or a mix.
- 4–6 projects to feature (name, description, your role, links, images).
- Photo, bio, socials, email, resume PDF (optional).
- Any colours/fonts you already love, and sites you like besides Gallery Play.

## Sources

- [Awwwards evaluation system](https://www.awwwards.com/about-evaluation/)
- [Awwwards judging criteria, Hon Tran](https://www.hontran.dev/blog/awwwards-judging-criteria)
- [10 best award-winning websites of 2026, Hon Tran](https://www.hontran.dev/blog/best-award-winning-websites-2026)
- [WebGL website examples 2026, Hon Tran](https://www.hontran.dev/blog/webgl-website-examples)
- [Best Three.js websites 2026, Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- [Best Three.js portfolio examples, CreativeDevJobs](https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025)
- [Awwwards: Best portfolio websites](https://www.awwwards.com/websites/portfolio/)
- [Awwwards: Three.js websites](https://www.awwwards.com/websites/three-js/)
- [Awwwards: Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/)
- [Gallery Play](https://gallery-play.be/)
- [Bruno Simon](https://bruno-simon.com/)
- [Goodgrowth case study, Codrops](https://tympanus.net/codrops/2026/08/27/goodgrowth-boot-sequences-spinning-discs-and-the-art-of-the-portfolio/)
- [Letting the creative process shape a WebGL portfolio, Codrops](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)
- [Scrollytelling trends 2026, Svilenković](https://svilenkovic.com/3d/scrollytelling-trends-2026)
- [Web animation trends 2026, MotionKit](https://motionkit.io/blog/web-animation-trends-2026)
- [Lenis](https://lenis.dev/)
