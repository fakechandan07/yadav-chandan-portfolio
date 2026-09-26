// Everything personal lives here, so the site can be updated without
// touching components.

export const site = {
  firstName: "Chandan",
  lastName: "Yadav",
  handle: "chandan_iscooking",
  role: "Developer — web, mobile & games",
  url: "https://yadav-chandan-portfolio.vercel.app",
  description:
    "Chandan Yadav — developer building for the web, mobile and games. Swift, Java, JavaScript, Node.js and React Native.",
};

export const socials = [
  { label: "Instagram", handle: "@chandan_iscooking", href: "https://www.instagram.com/chandan_iscooking/" },
  { label: "X / Twitter", handle: "@yadav_ji_____", href: "https://x.com/yadav_ji_____" },
];

// Category: Web, Mobile & Software Dev.
export const disciplines: { title: string; blurb: string; tools: string[] }[] = [
  {
    title: "Web Programming",
    blurb: "Sites and web apps that load fast and feel alive.",
    tools: ["HTML5", "CSS", "JavaScript", "Node.js"],
  },
  {
    title: "Mobile Apps",
    blurb: "Native iOS and cross-platform apps.",
    tools: ["Swift", "React Native"],
  },
  {
    title: "Game Development",
    blurb: "Playable things — mechanics, loops and a bit of chaos.",
    tools: [],
  },
  {
    title: "E-Commerce Development",
    blurb: "Storefronts built to sell, from product page to checkout.",
    tools: [],
  },
];

export const toolbox = ["Swift", "Java", "JavaScript", "HTML5", "CSS", "Node.js", "React Native"];

export const photos = {
  portrait: {
    src: "/photos/bridge-full.webp",
    small: "/photos/bridge-720.webp",
    alt: "Chandan in a cowboy hat, arms crossed, on a long suspension bridge over a valley",
    width: 1500,
    height: 1875,
  },
  fieldNotes: [
    {
      src: "/photos/buddha-snow-full.webp",
      small: "/photos/buddha-snow-720.webp",
      alt: "Chandan leaning on a railing in front of a large Buddha statue and snowy mountains",
      caption: "Above the snowline",
      width: 1125,
      height: 1500,
    },
    {
      src: "/photos/hat-tip-full.webp",
      small: "/photos/hat-tip-full.webp",
      alt: "Black and white photo of Chandan tipping a cowboy hat at a wooden table",
      caption: "Hat tip",
      width: 720,
      height: 960,
    },
    {
      src: "/photos/waterfall-full.webp",
      small: "/photos/waterfall-720.webp",
      alt: "Chandan in a cowboy hat looking up at a waterfall over pale rocks",
      caption: "Where the water falls",
      width: 1500,
      height: 2000,
    },
  ],
};
