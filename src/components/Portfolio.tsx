"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type PortfolioItem = {
  id: string;
  type: "video" | "photo";
  title: string;
  category: string;
  youtubeId?: string;
  bg: string;
  thumbnail?: string;
};

const FILTERS = ["Wszystko", "Filmy i reportaże", "Podcasty", "Media Event", "Foto", "Dron"] as const;
type Filter = (typeof FILTERS)[number];

const CATEGORY_MAP: Record<Filter, string | null> = {
  Wszystko: null,
  "Filmy i reportaże": "Film",
  Podcasty: "Podcast",
  "Media Event": "Event",
  Foto: "Foto",
  Dron: "Dron",
};

function VideoTile({ item }: { item: PortfolioItem }) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: item.bg }}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          allow="autoplay; fullscreen"
          allowFullScreen
          title={item.title}
        />
      ) : (
        <>
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt={item.title}
              loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}

          {/* REC dot */}
          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(220,60,60,0.8)" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Wideo</span>
          </div>

          {/* Hover overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)", opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease" }} />

          {/* Play button */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid rgba(255,255,255,${hovered ? 0.9 : 0.5})`, display: "flex", alignItems: "center", justifyContent: "center", transform: hovered ? "scale(1.1)" : "scale(1)", transition: "all 0.3s ease" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M6 3.5l10 5.5-10 5.5V3.5z" fill="rgba(255,255,255,0.9)" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 16px 16px", background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)", pointerEvents: "none" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>{item.category}</p>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.92)", lineHeight: 1.3 }}>{item.title}</p>
          </div>

          <button type="button" aria-label={`Odtwórz: ${item.title}`} onClick={() => setPlaying(true)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }} />
        </>
      )}
    </div>
  );
}

function PhotoTile({ item }: { item: PortfolioItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: item.bg }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}

      {/* Aperture mark */}
      <div style={{ position: "absolute", top: 14, right: 14 }} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8.5" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="10" cy="10" r="3.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>
      </div>

      {/* Hover info */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)", opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease" }} />
      <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>{item.category}</p>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.92)", lineHeight: 1.3 }}>{item.title}</p>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("Wszystko");
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const { lang } = useLang();
  const t = T[lang].portfolio;

  useEffect(() => {
    fetch("/api/portfolio").then((r) => r.json()).then(setItems).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".port-line"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: titleRef.current, start: "top 80%" } }
      );
    }

    if (sectionRef.current) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        onEnter: () => setVisible(true),
      });
    }
  }, []);

  useEffect(() => {
    if (!gridRef.current || !visible) return;
    const tiles = gridRef.current.querySelectorAll(".portfolio-tile");
    gsap.fromTo(tiles, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.65, ease: "expo.out", stagger: 0.05 });
  }, [activeFilter, visible, items]);

  const filtered = CATEGORY_MAP[activeFilter] === null
    ? items
    : items.filter((it) => it.category === CATEGORY_MAP[activeFilter]);

  return (
    <section id="portfolio" ref={sectionRef} className="section-pad" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "60px" }}>
        <div ref={titleRef}>
          <div style={{ overflow: "hidden" }}>
            <h2 className="port-line" style={{ display: "block", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--ink)" }}>
              {t.heading}
            </h2>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span className="port-line" style={{ display: "block", fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.95, color: "var(--ink-muted)" }}>
              {t.headingItalic}
            </span>
          </div>
        </div>
        <span className="section-label" style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-muted)", fontFamily: "var(--font-sans)", alignSelf: "flex-end", marginBottom: "8px" }}>
          {t.label}
        </span>
      </div>

      {/* Filters */}
      <div className="portfolio-filters">
        {FILTERS.map((f, fi) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            aria-pressed={activeFilter === f}
            style={{ background: "transparent", border: "none", borderBottom: `1.5px solid ${activeFilter === f ? "var(--ink)" : "transparent"}`, color: activeFilter === f ? "var(--ink)" : "var(--ink-muted)", fontFamily: "var(--font-sans)", fontWeight: activeFilter === f ? 600 : 400, fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 0 6px", marginRight: "28px", cursor: "pointer", transition: "color 0.2s ease, border-color 0.2s ease" }}
            onMouseEnter={(e) => { if (activeFilter !== f) (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)"; }}
            onMouseLeave={(e) => { if (activeFilter !== f) (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)"; }}
          >
            {t.filters[fi]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid-portfolio">
        {filtered.map((item) => (
          <div key={item.id} className="portfolio-tile">
            {item.type === "video" ? <VideoTile item={item} /> : <PhotoTile item={item} />}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--ink-muted)", textAlign: "center", padding: "80px 0" }}>
          {t.empty}
        </p>
      )}
    </section>
  );
}
