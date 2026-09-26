// The preloader flips the page to "ready"; intro animations wait for it.

export function isSiteReady() {
  return document.documentElement.dataset.ready === "true";
}

export function markSiteReady() {
  document.documentElement.dataset.ready = "true";
  window.dispatchEvent(new Event("site:ready"));
}

export function onSiteReady(cb: () => void) {
  if (isSiteReady()) {
    cb();
    return () => {};
  }
  window.addEventListener("site:ready", cb, { once: true });
  return () => window.removeEventListener("site:ready", cb);
}
