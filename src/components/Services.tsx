"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const anchors = ["#portfolio", "#portfolio", "#portfolio", "#portfolio", "#drony"];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const { lang } = useLang();
  const t = T[lang].services;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const titleEl = titleRef.current;
    if (titleEl) {
      gsap.fromTo(
        titleEl.querySelectorAll(".svc-title-line"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: titleEl, start: "top 80%" },
        }
      );
    }

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      gsap.fromTo(
        item,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          delay: i * 0.1,
          scrollTrigger: { trigger: item, start: "top 85%" },
        }
      );
    });
  }, []);

  const scrollTo = (anchor: string) => {
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="uslugi"
      ref={sectionRef}
      className="section-pad"
      style={{ background: "var(--bg)", position: "relative" }}
    >
      <div
        className="svc-header"
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "80px",
        }}
      >
        <div ref={titleRef} style={{ overflow: "hidden" }}>
          <div style={{ overflow: "hidden" }}>
            <h2
              className="svc-title-line"
              style={{
                display: "block",
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(40px, 6vw, 88px)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
              }}
            >
              {t.heading}
            </h2>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span
              className="svc-title-line"
              style={{
                display: "block",
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(40px, 6vw, 88px)",
                lineHeight: 0.95,
                color: "var(--ink-muted)",
              }}
            >
              {t.headingItalic}
            </span>
          </div>
        </div>

        <span
          className="section-label"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            fontFamily: "var(--font-sans)",
            alignSelf: "flex-end",
            marginBottom: "8px",
          }}
        >
          {t.label}
        </span>
      </div>

      <div style={{ position: "relative" }}>
        {t.items.map((s, i) => (
          <div
            key={i}
            ref={(el) => { itemsRef.current[i] = el; }}
            className="svc-row"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => scrollTo(anchors[i])}
            style={{
              position: "relative",
              borderTop: "1px solid rgba(13,13,13,0.12)",
              padding: "36px 0 36px 20px",
              cursor: "pointer",
              transition: "background 0.3s ease",
              background: hovered === i ? "rgba(13,13,13,0.03)" : "transparent",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "2px",
                background: "var(--ink)",
                transform: hovered === i ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: "center",
                transition: "transform 0.35s ease",
              }}
            />

            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "var(--ink-muted)",
                textTransform: "uppercase",
              }}
            >
              0{i + 1}
            </span>

            <div>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "clamp(22px, 3.5vw, 48px)",
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  marginBottom: hovered === i ? "8px" : "0",
                  transition: "margin 0.3s ease",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--ink-light)",
                  lineHeight: 1.6,
                  maxHeight: hovered === i ? "60px" : "0",
                  overflow: "hidden",
                  opacity: hovered === i ? 1 : 0,
                  transition: "max-height 0.4s ease, opacity 0.4s ease",
                }}
              >
                {s.desc}
              </p>
            </div>

            <div
              className="svc-arrow"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: hovered === i ? 1 : 0,
                transform: hovered === i ? "translateX(0)" : "translateX(-16px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="var(--ink)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(13,13,13,0.12)" }} />
      </div>
    </section>
  );
}
