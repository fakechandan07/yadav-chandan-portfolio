// Shared, mutable state the DOM writes and the WebGL scene reads every frame,
// so pointer and scroll never go through React renders.
export const heroState = {
  pointer: { x: 0, y: 0 }, // normalised -1..1, y up
  pointerActive: false, // false until the first pointer move
  progress: 0, // 0 at top of hero, 1 when it has scrolled away
};
