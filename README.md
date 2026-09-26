# Chandan Yadav — Portfolio

A dark, editorial portfolio with a live 3D mountain hero. Built with Next.js,
React Three Fiber, GSAP and Lenis, and exported as a static site.

## What's in it

- **Preloader.** A 000→100 counter with "Chandan is cooking", played once per session.
- **3D hero.** A procedural Himalaya-style ridge rendered as topographic
  contour lines in a custom shader. The camera follows the mouse, a glowing
  summit rises under the cursor, and the camera flies into the peaks as you scroll.
- **Kinetic name.** Letters rise in on load, and their weight shifts as the
  cursor passes near them.
- **Custom cursor.** A dot plus a trailing ring that grows, labels itself
  ("Colour", "FN—01", "Open") and hides where it would get in the way.
- **Magnetic buttons**, Lenis smooth scroll, and animated film grain.
- **Intro statement.** Words light up as you scroll, with an inline photo pill.
- **About.** A black-and-white portrait where colour follows the cursor. On
  phones, the colour wipes in as you scroll instead.
- **Skills.** Rows fill with colour from the edge you hover in from, plus a
  two-row marquee that speeds up and reverses with your scroll.
- **Field notes.** A pinned horizontal photo strip that skews with scroll
  speed. It becomes a vertical stack on phones.
- **Contact.** A giant headline, a magnetic "Say hi" button and social links.
- Respects `prefers-reduced-motion`, works on touch, uses semantic HTML
  throughout, and includes a skip link and Open Graph image.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Edit content

Everything personal is in [`src/content/site.ts`](src/content/site.ts): name,
socials, skills, and photo captions and alt text.

### Photos

Originals live in `photos/originals/`. `npm run images` crops them to
consistent ratios and writes WebP files to `public/photos/`. The crop boxes are
at the top of [`scripts/process-images.mjs`](scripts/process-images.mjs).

## Deploy

`npm run build` produces a plain static site in `out/`, so it can go anywhere.
The easiest option is to import the repo on [Vercel](https://vercel.com/new).
Update `site.url` in `src/content/site.ts` to the final domain so share
previews resolve.

## Design notes

Research and references behind the design are in
[`docs/research-notes.md`](docs/research-notes.md).
