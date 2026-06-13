"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const logos = [
  { src: "/Kopia TVP_logo.svg.png", alt: "TVP" },
  { src: "/Tvp-world.svg.png", alt: "TVP World" },
  { src: "/TVP_Kultura_logo_2015.png", alt: "TVP Kultura" },
  { src: "/TVP3-Katowice.svg.png", alt: "TVP3 Katowice" },
  { src: "/tso_logo.png", alt: "TSO" },
  { src: "/Muzeum JP2.png", alt: "Muzeum Jana Pawła II" },
  { src: "/Logo MER.jpg", alt: "MER" },
  { src: "/logo ue1.png", alt: "Unia Europejska" },
  { src: "/logo ue2.jpg", alt: "Fundusze Europejskie" },
  { src: "/logo CECC.png", alt: "CECC" },
  { src: "/Propter tv.jpg", alt: "Propter TV" },
];

const track = [...logos, ...logos];

export default function TrustedBy() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = T[lang].trustedBy;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "80px 0",
        background: "var(--bg)",
        borderTop: "1px solid rgba(13,13,13,0.1)",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          textAlign: "center",
          marginBottom: "48px",
        }}
      >
        {t.label}
      </p>

      <div style={{ overflow: "hidden", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to right, var(--bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(to left, var(--bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="marquee-track">
          {track.map((logo, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 40px",
                flexShrink: 0,
              }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: "40px",
                  maxWidth: "120px",
                  objectFit: "contain",
                  display: "block",
                  filter: "grayscale(1) opacity(0.35)",
                  transition: "filter 0.3s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0) opacity(1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.filter = "grayscale(1) opacity(0.35)";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
