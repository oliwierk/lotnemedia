"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    num: "01",
    title: "Koncepcja",
    desc: "Słuchamy i pytamy. Każdy projekt zaczyna się od rozmowy — poznajemy Twój cel, historię i odbiorcę. Na tej podstawie budujemy scenariusz i plan realizacji.",
  },
  {
    num: "02",
    title: "Realizacja",
    desc: "Kamery, drony, mikrofony. Wyjeżdżamy w teren z profesjonalnym sprzętem i ekipą. Rejestrujemy materiał w jakości nadawczej — bez kompromisów.",
  },
  {
    num: "03",
    title: "Postprodukcja",
    desc: "Montaż, korekcja barwna, dźwięk, lektorat. Oddajemy gotowy materiał w uzgodnionym formacie — gotowy na antenę, platformę lub ekran kinowy.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".proc-line"),
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

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });
  }, []);

  return (
    <section
      id="proces"
      ref={sectionRef}
      style={{
        padding: "140px 48px",
        background: "var(--stone)",
        position: "relative",
      }}
    >
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
              className="proc-line"
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
              Jak pracujemy
            </h2>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span
              className="proc-line"
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
              razem.
            </span>
          </div>
        </div>

        <span
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
          Proces
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "rgba(13,13,13,0.1)",
        }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            style={{
              background: "var(--stone)",
              padding: "56px 48px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(13,13,13,0.1)",
                lineHeight: 1,
                display: "block",
                marginBottom: "40px",
              }}
            >
              {s.num}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(20px, 2vw, 28px)",
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                marginBottom: "20px",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                lineHeight: 1.75,
                color: "var(--ink-light)",
                maxWidth: "38ch",
              }}
            >
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
