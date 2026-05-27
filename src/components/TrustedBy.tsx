"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const clients = [
  "TVP", "Polskie Radio", "Canal+", "Onet", "WP", "Gazeta Wyborcza",
  "Ministerstwo Kultury", "POLIN", "NCK", "Forum Ekonomiczne",
  "TVP", "Polskie Radio", "Canal+", "Onet", "WP", "Gazeta Wyborcza",
  "Ministerstwo Kultury", "POLIN", "NCK", "Forum Ekonomiczne",
];

export default function TrustedBy() {
  const sectionRef = useRef<HTMLElement>(null);

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
        Zaufali nam
      </p>

      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Fade edges */}
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
          {clients.map((client, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "64px",
                padding: "0 32px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "clamp(20px, 2.5vw, 30px)",
                  letterSpacing: "-0.02em",
                  color: "rgba(13,13,13,0.15)",
                  textTransform: "uppercase",
                  userSelect: "none",
                  transition: "color 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLSpanElement).style.color = "rgba(13,13,13,0.8)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLSpanElement).style.color = "rgba(13,13,13,0.15)")
                }
              >
                {client}
              </span>
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "rgba(13,13,13,0.15)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
