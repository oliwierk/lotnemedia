"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const team = [
  {
    name: "Ilona Ptak",
    role: "Założyciel · Dziennikarz",
    bio: "Specjalistka PR i dziennikarka współpracująca z ogólnopolską telewizją. Wielokrotnie nagradzana na polskich konkursach dziennikarskich i filmowych.",
    img: null,
    featured: true,
  },
  {
    name: null,
    role: "Operator kamery",
    bio: "Operator z wieloletnim doświadczeniem w produkcjach telewizyjnych. Specjalizuje się w zdjęciach reportażowych i ujęciach z drona.",
    img: null,
    featured: false,
  },
  {
    name: null,
    role: "Montaż · Postprodukcja",
    bio: "Montażystka reportaży, podcastów i spotów reklamowych. Pasjonuje się opowiadaniem historii przez obraz.",
    img: null,
    featured: false,
  },
  {
    name: null,
    role: "Fotograf",
    bio: "Fotograf reportażowy i portretowy, laureat ogólnopolskich konkursów fotograficznych. Pracuje z klientami biznesowymi i mediami.",
    img: null,
    featured: false,
  },
];

function TeamCard({
  member,
  delay,
}: {
  member: (typeof team)[number];
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        delay,
        scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
      }
    );
  }, [delay]);

  return (
    <div ref={cardRef}>
      {/* Photo */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          marginBottom: "20px",
          cursor: "default",
          background: member.featured ? "#2a2826" : "#e6e0da",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Placeholder — subtle grid + aperture mark */}
        <div
          className="tile-placeholder"
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: member.featured
              ? "radial-gradient(ellipse at 45% 35%, rgba(255,255,255,0.07) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 45% 35%, rgba(13,13,13,0.04) 0%, transparent 60%)",
          }}
        />
        {/* Aperture icon */}
        <svg
          aria-hidden="true"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: member.featured ? 0.12 : 0.15,
          }}
        >
          <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1" />
          <circle cx="18" cy="18" r="7" stroke="currentColor" strokeWidth="1" />
          <line x1="18" y1="2" x2="18" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="18" y1="28" x2="18" y2="34" stroke="currentColor" strokeWidth="1" />
          <line x1="2" y1="18" x2="8" y2="18" stroke="currentColor" strokeWidth="1" />
          <line x1="28" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span
          style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            fontFamily: "var(--font-sans)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: member.featured ? "rgba(242,237,232,0.3)" : "rgba(13,13,13,0.25)",
          }}
        >
          Zdjęcie
        </span>

        {/* Hover bio overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(13,13,13,0.72)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            display: "flex",
            alignItems: "flex-end",
            padding: "28px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              lineHeight: 1.65,
              color: "rgba(242,237,232,0.9)",
              transform: hovered ? "translateY(0)" : "translateY(12px)",
              transition: "transform 0.4s ease",
            }}
          >
            {member.bio}
          </p>
        </div>

        {/* Featured badge */}
        {member.featured && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              background: "rgba(13,13,13,0.75)",
              backdropFilter: "blur(8px)",
              padding: "6px 12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(242,237,232,0.75)",
              }}
            >
              Założyciel
            </span>
          </div>
        )}
      </div>

      {/* Name + role */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: "16px",
          letterSpacing: "-0.01em",
          color: member.name ? "var(--ink)" : "var(--ink-muted)",
          marginBottom: "4px",
        }}
      >
        {member.name ?? "Imię Nazwisko"}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
        }}
      >
        {member.role}
      </p>
    </div>
  );
}

export default function Zespol() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".team-line"),
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
  }, []);

  return (
    <section
      id="zespol"
      ref={sectionRef}
      className="section-pad"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid rgba(13,13,13,0.08)",
      }}
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
              className="team-line"
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
              Zespół
            </h2>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span
              className="team-line"
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
              za obiektywem.
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
          Ludzie
        </span>
      </div>

      {/* Grid: 1 large featured + 3 equal */}
      <div className="cols-team">
        {team.map((member, i) => (
          <TeamCard key={member.role} member={member} delay={i * 0.1} />
        ))}
      </div>

      {/* Bottom quote */}
      <div
        style={{
          marginTop: "100px",
          paddingTop: "60px",
          borderTop: "1px solid rgba(13,13,13,0.1)",
          maxWidth: "560px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(18px, 2vw, 24px)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.65,
            color: "var(--ink)",
            marginBottom: "20px",
          }}
        >
          „Tworzymy z pasją do uchwycenia ulotnych chwil, które chcesz zachować
          na dłużej…"
        </p>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
          }}
        >
          Ilona Ptak, Lotne Media
        </span>
      </div>
    </section>
  );
}
