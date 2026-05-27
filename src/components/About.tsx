"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const awards = [
  { year: "2023", title: "Nagroda Dziennikarstwa Kulturalnego", org: "Stowarzyszenie Dziennikarzy Polskich" },
  { year: "2022", title: "Grand Prix — Reportaż Roku", org: "Festiwal Mediów" },
  { year: "2021", title: "Srebrny Mikrofon", org: "Polskie Radio" },
  { year: "2020", title: "Wyróżnienie — Najlepszy Podcast", org: "Podcasty Roku" },
  { year: "2019", title: "Nagroda Specjalna Jury", org: "Festiwal Filmów Dokumentalnych" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const awardsRef = useRef<HTMLDivElement>(null);

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

    if (bioRef.current) {
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: bioRef.current, start: "top 82%" },
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
          stagger: 0.1,
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
      style={{
        background: "var(--stone)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "100px",
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
              O nas
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
              i nagrody.
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
          Studio
        </span>
      </div>

      {/* Two-column layout: bio + awards */}
      <div className="cols-2">
        {/* Bio */}
        <div ref={bioRef}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(18px, 2.2vw, 26px)",
              fontWeight: 300,
              lineHeight: 1.65,
              color: "var(--ink)",
              marginBottom: "32px",
            }}
          >
            Lotne Media to studio produkcji wideo i foto z siedzibą w Polsce.
            Od ponad dekady tworzymy materiały dla największych polskich mediów,
            instytucji kultury i przedsiębiorstw.
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.75,
              color: "var(--ink-light)",
            }}
          >
            Specjalizujemy się w reportażach dla TVP, produkcji podcastów,
            obsłudze eventów medialnych oraz fotografii profesjonalnej.
            Nasz zespół tworzą doświadczeni dziennikarze, operatorzy kamer
            i montażyści — pasjonaci opowiadania historii przez obraz i dźwięk.
          </p>
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
            Nagrody i wyróżnienia
          </p>

          {awards.map((a, i) => (
            <div
              key={i}
              className="award-row"
              style={{
                borderTop: i === 0 ? "1px solid rgba(13,13,13,0.15)" : "none",
                borderBottom: "1px solid rgba(13,13,13,0.15)",
                padding: "28px 0",
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
                }}
              >
                {a.year}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "var(--ink)",
                    marginBottom: "4px",
                  }}
                >
                  {a.title}
                </p>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
