"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Drony() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = T[lang].drony;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".drone-line"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
        }
      );
    }

    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll(".drone-stat"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        }
      );
    }
  }, []);

  return (
    <section
      id="drony"
      ref={sectionRef}
      className="section-pad"
      style={{
        background: "var(--ink)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(242,237,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,232,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Large background text */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "48px",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(100px, 22vw, 320px)",
          letterSpacing: "-0.06em",
          color: "rgba(242,237,232,0.025)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        AIR
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "80px",
          }}
        >
          <div ref={titleRef}>
            <div style={{ overflow: "hidden" }}>
              <h2
                className="drone-line"
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "clamp(40px, 6vw, 88px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "var(--bg)",
                }}
              >
                {t.heading}
              </h2>
            </div>
            <div style={{ overflow: "hidden" }}>
              <span
                className="drone-line"
                style={{
                  display: "block",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(40px, 6vw, 88px)",
                  lineHeight: 0.95,
                  color: "rgba(242,237,232,0.55)",
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
              color: "rgba(242,237,232,0.55)",
              fontFamily: "var(--font-sans)",
              alignSelf: "flex-end",
              marginBottom: "8px",
            }}
          >
            {t.label}
          </span>
        </div>

        {/* Content */}
        <div className="cols-2-center">
          {/* Text */}
          <div style={{ maxWidth: "480px" }}>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(18px, 2.2vw, 26px)",
                fontWeight: 300,
                lineHeight: 1.65,
                color: "rgba(242,237,232,0.85)",
                marginBottom: "24px",
              }}
            >
              {t.text1}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                lineHeight: 1.75,
                color: "rgba(242,237,232,0.55)",
              }}
            >
              {t.text2}
            </p>
          </div>

          {/* Aerial photo */}
          <div
            style={{
              aspectRatio: "16/9",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src="/Ilona Ptak spadochron3.jpg"
              alt="Ujęcia z powietrza — Lotne Media"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(13,13,13,0.35)",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                fontFamily: "var(--font-sans)",
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(242,237,232,0.55)",
              }}
            >
              4K / 60fps
            </span>
            <span
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                fontFamily: "var(--font-sans)",
                fontSize: "9px",
                letterSpacing: "0.14em",
                color: "rgba(242,237,232,0.45)",
              }}
            >
              REC ●
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="cols-stats"
          style={{ borderTop: "1px solid rgba(242,237,232,0.1)" }}
        >
          {t.stats.map((s, i) => (
            <div key={i} className="drone-stat">
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "clamp(32px, 5vw, 64px)",
                  letterSpacing: "-0.03em",
                  color: "var(--bg)",
                  marginBottom: "8px",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(242,237,232,0.55)",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
