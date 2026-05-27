"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function PageOverlay() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Honor prefers-reduced-motion globally for all GSAP animations on this site.
    // Setting duration/delay to 0 makes ScrollTrigger callbacks fire instantly
    // without removing the animation logic from each component.
    if (reduced) {
      gsap.defaults({ duration: 0, delay: 0 });
    }

    const overlay = document.getElementById("page-overlay");
    if (!overlay) return;

    gsap.to(overlay, {
      scaleY: 0,
      duration: reduced ? 0 : 1.2,
      ease: "expo.inOut",
      transformOrigin: "top",
      delay: reduced ? 0 : 0.1,
    });
  }, []);

  return (
    <div
      id="page-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "#0d0d0d",
        zIndex: 9000,
        transformOrigin: "top",
        pointerEvents: "none",
      }}
    />
  );
}
