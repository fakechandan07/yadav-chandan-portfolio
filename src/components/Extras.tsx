"use client";

import { useEffect } from "react";

// Small touches: a note for anyone opening devtools, and a tab title that
// calls you back when you switch away.
export default function Extras() {
  useEffect(() => {
    console.log(
      "%cChandan is cooking 🍳%c\nLike what you see? Say hi → instagram.com/chandan_iscooking",
      "font: 700 20px system-ui; color: #ff5a1f",
      "font: 13px system-ui; color: inherit",
    );

    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? "Come back — it’s still cooking 🍳" : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return null;
}
