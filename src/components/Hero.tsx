"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.0 });

    const titleLines =
      titleRef.current?.querySelectorAll(".hero-line") || [];

    tl.fromTo(
      titleLines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
      }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
        "-=0.5"
      )
      .fromTo(
        [img1Ref.current, img2Ref.current, img3Ref.current],
        { opacity: 0, scale: 1.08 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.15,
        },
        "-=0.8"
      )
      .fromTo(
        scrollHintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
        "-=0.3"
      );

    const scrollLine = scrollHintRef.current?.querySelector(".scroll-line");
    if (scrollLine) gsap.to(scrollLine, {
      scaleY: 0,
      transformOrigin: "top",
      duration: 0.9,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.3,
    });
  }, []);

  return (
    <section
      id="top"
      ref={containerRef}
      style={{
        minHeight: "100vh",
        padding: "0 48px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr auto",
        gap: "0",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Left column — typography */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "80px",
          paddingTop: "140px",
          zIndex: 2,
        }}
      >
        <h1
          ref={titleRef}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "clamp(56px, 8vw, 112px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <span className="hero-line" style={{ display: "block" }}>
              Tworzymy
            </span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span className="hero-line" style={{ display: "block" }}>
              Obraz
            </span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span
              className="hero-line"
              style={{
                display: "block",
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              i Dźwięk.
            </span>
          </div>
        </h1>

        <p
          ref={subtitleRef}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "var(--ink-light)",
            maxWidth: "360px",
            letterSpacing: "0.01em",
          }}
        >
          Reportaże, podcasty, eventy medialne i fotografia.
          <br />
          Produkcja wideo dla mediów i biznesu.
        </p>
      </div>

      {/* Right column — asymmetric images */}
      <div
        style={{
          position: "relative",
          paddingTop: "100px",
          paddingBottom: "60px",
        }}
      >
        {/* Box 1 — large, Reportaż TVP */}
        <div
          ref={img1Ref}
          style={{ position: "absolute", top: "120px", right: "0", width: "72%", height: "360px", overflow: "hidden" }}
        >
          <img
            src="https://picsum.photos/seed/film-reportaz/900/500"
            alt="Reportaż TVP — kadr z planu"
            loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Vignette */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />
          {/* REC badge */}
          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(220,60,60,0.85)" }} />
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>REC</span>
          </div>
          <span style={{ position: "absolute", bottom: 16, left: 16, color: "rgba(255,255,255,0.75)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
            Reportaż TVP
          </span>
        </div>

        {/* Box 2 — medium, Event */}
        <div
          ref={img2Ref}
          style={{ position: "absolute", bottom: "140px", left: "0", width: "52%", height: "240px", overflow: "hidden" }}
        >
          <img
            src="https://picsum.photos/seed/conference-media/700/350"
            alt="Event medialny"
            loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
          <span style={{ position: "absolute", bottom: 16, left: 16, color: "rgba(255,255,255,0.75)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
            Event
          </span>
        </div>

        {/* Box 3 — small, Foto */}
        <div
          ref={img3Ref}
          style={{ position: "absolute", bottom: "60px", right: "40px", width: "38%", height: "180px", overflow: "hidden" }}
        >
          <img
            src="https://picsum.photos/seed/portrait-photo/500/300"
            alt="Fotografia"
            loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
          <span style={{ position: "absolute", bottom: 14, left: 14, color: "rgba(255,255,255,0.75)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
            Fotografia
          </span>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "48px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          className="scroll-line"
          style={{
            width: "1px",
            height: "48px",
            background: "var(--ink)",
          }}
        />
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            fontFamily: "var(--font-sans)",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
