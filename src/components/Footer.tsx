"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import QRCode from "qrcode";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PHONE_TEL = "tel:+48512555780";
const EMAIL = "kontakt@lotnemedia.pl";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const { lang } = useLang();
  const t = T[lang].contact;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (bigTextRef.current) {
      gsap.fromTo(
        bigTextRef.current.querySelectorAll(".footer-line"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: bigTextRef.current, start: "top 85%" },
        }
      );
    }

    if (detailsRef.current) {
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          delay: 0.3,
          scrollTrigger: { trigger: detailsRef.current, start: "top 90%" },
        }
      );
    }

    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, PHONE_TEL, {
        width: 96,
        margin: 1,
        color: { dark: "#f2ede8", light: "#0d0d0d" },
      });
    }
  }, []);

  return (
    <footer
      id="kontakt"
      ref={sectionRef}
      className="footer-pad"
      style={{
        background: "var(--ink)",
        color: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Giant contact headline */}
      <div ref={bigTextRef} className="footer-headline" style={{ marginBottom: "80px" }}>
        <div style={{ overflow: "hidden" }}>
          <h2
            className="footer-line footer-heading-text"
            style={{
              display: "block",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "clamp(56px, 12vw, 180px)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              color: "var(--bg)",
              opacity: 0.95,
            }}
          >
            {t.heading}
          </h2>
        </div>
        <div style={{ overflow: "hidden" }}>
          <span
            className="footer-line footer-heading-text"
            style={{
              display: "block",
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(56px, 12vw, 180px)",
              lineHeight: 0.88,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {t.headingItalic}
          </span>
        </div>
      </div>

      {/* Contact details — 3-column grid */}
      <div
        ref={detailsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "56px",
          marginBottom: "80px",
        }}
      >
        {/* Email */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
              marginBottom: "12px",
            }}
          >
            {t.emailLabel}
          </p>
          <a
            href={`mailto:${EMAIL}`}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(14px, 1.6vw, 20px)",
              color: "var(--bg)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(242,237,232,0.3)",
              paddingBottom: "2px",
              transition: "border-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.borderColor = "rgba(242,237,232,0.9)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.borderColor = "rgba(242,237,232,0.3)")
            }
          >
            {EMAIL}
          </a>
        </div>

        {/* Phone — QR only, no visible number */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
              marginBottom: "12px",
            }}
          >
            {t.phoneLabel}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                border: "1px solid rgba(242,237,232,0.15)",
                padding: "6px",
                lineHeight: 0,
              }}
            >
              <canvas ref={qrCanvasRef} style={{ display: "block" }} />
            </div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "rgba(242,237,232,0.45)",
                lineHeight: 1.6,
                maxWidth: "100px",
              }}
            >
              {t.phoneScan}
            </p>
          </div>
        </div>

        {/* Social media */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
              marginBottom: "12px",
            }}
          >
            {t.socialLabel}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Facebook", href: "#" },
              { label: "YouTube", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bg)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(242,237,232,0.6)")
                }
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 6h8M6 2l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          paddingTop: "32px",
          borderTop: "1px solid rgba(242,237,232,0.12)",
        }}
      >
        <img
          src="/logo.svg"
          alt="Lotne Media"
          style={{
            height: "38px",
            width: "auto",
            display: "block",
            filter: "brightness(0) invert(1)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          NIP 6292401050 · REGON — · Katowice · © {new Date().getFullYear()}
        </span>
      </div>

      {/* Decorative background text */}
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          right: "48px",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(80px, 18vw, 260px)",
          letterSpacing: "-0.06em",
          color: "rgba(242,237,232,0.02)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        LM
      </div>
    </footer>
  );
}
