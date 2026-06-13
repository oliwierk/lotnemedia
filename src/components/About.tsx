"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const awards = [
  { year: "2025", title: "Wyróżnienie — konkurs Obiektywnie Śląskie", org: "Kategoria: Film" },
  { year: "2024", title: "Wyróżnienie — konkurs Obiektywnie Śląskie", org: "Kategoria: Film" },
  { year: "2024", title: "II nagroda i wyróżnienie — Festiwal Filmów Górskich Adrenalinium", org: "" },
  { year: "2024", title: "Wyróżnienie — konkurs SDP Watergate", org: "Dziennikarstwo śledcze — SDP" },
  { year: "2023", title: "II nagroda i wyróżnienie — Festiwal Filmów Górskich Adrenalinium", org: "" },
  { year: "2023", title: "Wyróżnienie — konkurs SDP Watergate", org: "Dziennikarstwo śledcze — SDP" },
  { year: "2021", title: "I Nagroda im. Adolfa Bocheńskiego", org: "Stowarzyszenie Dziennikarzy Polskich" },
  { year: "2021", title: "Wyróżnienie — Festiwal Form Dokumentalnych Nurt", org: "" },
  { year: "2020", title: "I nagroda Rady Programowej TVP3 Katowice", org: "Reportaż: Dokąd poprowadzą nogi" },
  { year: "2019", title: "I nagroda im. Brygidy Frosztęgi-Kmiecik", org: "26. PKD TVP — Najlepszy Reportaż Interwencyjny" },
  { year: "2019", title: "I nagroda Rady Programowej TVP3 Katowice", org: "Reportaż: Jednooka Wojowniczka" },
  { year: "2019", title: "Wyróżnienie specjalne — XIV Silesia Press", org: "Za odwagę i dociekliwość dziennikarską" },
  { year: "2019", title: "II miejsce — I Festiwal Reportażu Sportowego Patyk", org: "" },
  { year: "2018", title: "I nagroda Rady Programowej TVP3 Katowice", org: "Reportaż: Bohaterowie pod ziemią" },
  { year: "2018", title: "Wyróżnienie — konkurs im. Bartka Zdunka", org: "Debiut Publicystyczny Roku" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const awardsRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { lang } = useLang();
  const t = T[lang].about;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".about-line"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
        }
      );
    }

    if (featuredRef.current) {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: featuredRef.current, start: "top 82%" },
        }
      );
    }

    if (awardsRef.current) {
      const rows = awardsRef.current.querySelectorAll(".award-row");
      gsap.fromTo(
        rows,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: awardsRef.current, start: "top 80%" },
        }
      );
    }
  }, []);

  return (
    <section
      id="onas"
      ref={sectionRef}
      className="section-pad"
      style={{ background: "var(--stone)" }}
    >
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
              className="about-line"
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
              className="about-line"
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

      {/* Featured: photo + name + bio */}
      <div
        ref={featuredRef}
        className="cols-2"
        style={{ marginBottom: "80px", alignItems: "start" }}
      >
        {/* Portrait photo */}
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            overflow: "hidden",
            background: "#2a2826",
            maxHeight: "560px",
          }}
        >
          <img
            src="/Ilona Ptak fotko.jpg"
            alt="Ilona Ptak"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              fontFamily: "var(--font-sans)",
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(242,237,232,0.65)",
            }}
          >
            Ilona Ptak
          </span>
        </div>

        {/* Bio column */}
        <div style={{ paddingTop: "8px" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: "20px",
            }}
          >
            {t.label}
          </p>

          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 44px)",
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              lineHeight: 1,
              marginBottom: "10px",
            }}
          >
            {t.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: "40px",
            }}
          >
            {t.nameTitle}
          </p>

          {/* Short bio */}
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(17px, 2vw, 22px)",
              fontWeight: 300,
              lineHeight: 1.65,
              color: "var(--ink)",
              marginBottom: "24px",
            }}
          >
            {t.bioShort}
          </p>

          {/* Expandable full bio */}
          <div
            style={{
              overflow: "hidden",
              maxHeight: expanded ? "400px" : "0",
              transition: "max-height 0.55s ease",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                lineHeight: 1.75,
                color: "var(--ink-light)",
                marginBottom: "0",
                paddingBottom: "24px",
              }}
            >
              {t.bioFull}
            </p>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink)",
              padding: "0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "1px solid var(--ink)",
              paddingBottom: "2px",
            }}
          >
            <span>{expanded ? t.collapse : t.readMore}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Awards */}
      <div ref={awardsRef}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: "32px",
          }}
        >
          {t.awardsLabel}
        </p>

        <div
          style={{
            maxHeight: "368px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(13,13,13,0.2) transparent",
            paddingRight: "8px",
          }}
        >
          {awards.map((a, i) => (
            <div
              key={i}
              className="award-row"
              style={{
                borderTop: i === 0 ? "1px solid rgba(13,13,13,0.15)" : "none",
                borderBottom: "1px solid rgba(13,13,13,0.15)",
                padding: "22px 0",
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                gap: "24px",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "var(--ink-muted)",
                  flexShrink: 0,
                }}
              >
                {a.year}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "var(--ink)",
                    marginBottom: a.org ? "4px" : "0",
                  }}
                >
                  {a.title}
                </p>
                {a.org && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      color: "var(--ink-muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {a.org}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginTop: "12px",
            opacity: 0.7,
          }}
        >
          {t.scrollHint}
        </p>
      </div>
    </section>
  );
}
