export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function hasFinePointer() {
  return window.matchMedia(FINE_POINTER).matches;
}
