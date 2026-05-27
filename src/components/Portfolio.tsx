"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type PortfolioItem = {
  id: string;
  type: "video" | "photo";
  title: string;
  category: string;
  youtubeId?: string;
  aspect: string;
  bg: string;
};

const FILTERS = ["Wszystko", "Reportaże", "Podcasty", "Eventy", "Fotografia"] as const;
type Filter = (typeof FILTERS)[number];

const CATEGORY_MAP: Record<Filter, string | null> = {
  Wszystko: null,
  Reportaże: "Reportaż TVP",
  Podcasty: "Podcast",
  Eventy: "Event",
  Fotografia: "Fotografia",
};

const items: PortfolioItem[] = [
  {
    id: "r1",
    type: "video",
    title: "Reportaż — Festiwal Kultury",
    category: "Reportaż TVP",
    youtubeId: "dQw4w9WgXcQ",
    aspect: "16/9",
    bg: "#1a1a1a",
  },
  {
    id: "r2",
    type: "video",
    title: "Reportaż — Rok Chopinowski",
    category: "Reportaż TVP",
    youtubeId: "dQw4w9WgXcQ",
    aspect: "16/9",
    bg: "#181818",
  },
  {
    id: "pod1",
    type: "video",
    title: "Podcast — Studio Rozmów",
    category: "Podcast",
    youtubeId: "dQw4w9WgXcQ",
    aspect: "16/9",
    bg: "#1e1c1b",
  },
  {
    id: "pod2",
    type: "video",
    title: "Podcast — Kultura Mówi",
    category: "Podcast",
    youtubeId: "dQw4w9WgXcQ",
    aspect: "16/9",
    bg: "#1c1a19",
  },
  {
    id: "e1",
    type: "video",
    title: "Konferencja — Forum Mediów",
    category: "Event",
    youtubeId: "dQw4w9WgXcQ",
    aspect: "16/9",
    bg: "#1a1a1a",
  },
  {
    id: "e2",
    type: "video",
    title: "Gala Biznesu 2024",
    category: "Event",
    youtubeId: "dQw4w9WgXcQ",
    aspect: "16/9",
    bg: "#1d1b1a",
  },
  {
    id: "f1",
    type: "photo",
    title: "Portret — Artysta",
    category: "Fotografia",
    aspect: "3/4",
    bg: "#2c2926",
  },
  {
    id: "f2",
    type: "photo",
    title: "Reportaż — Miasto Nocą",
    category: "Fotografia",
    aspect: "3/2",
    bg: "#222022",
  },
  {
    id: "f3",
    type: "photo",
    title: "Event — Za Kulisami",
    category: "Fotografia",
    aspect: "4/5",
    bg: "#252220",
  },
];

/* Subtle film-strip edge marks for placeholder tiles */
function FilmMarks() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Top perforations */}
      {[10, 22, 34, 46, 58, 70, 82].map((pct) => (
        <div
          key={pct}
          style={{
            position: "absolute",
            top: "6px",
            left: `${pct}%`,
            width: "8px",
            height: "6px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1px",
          }}
        />
      ))}
      {/* Bottom perforations */}
      {[10, 22, 34, 46, 58, 70, 82].map((pct) => (
        <div
          key={pct}
          style={{
            position: "absolute",
            bottom: "6px",
            left: `${pct}%`,
            width: "8px",
            height: "6px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1px",
          }}
        />
      ))}
    </div>
  );
}

function VideoTile({ item }: { item: PortfolioItem }) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: item.aspect,
        overflow: "hidden",
        background: item.bg,
      }}
    >
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
          {/* Thumbnail */}
          <img
            src={`https://picsum.photos/seed/${item.id}/640/360`}
            alt={item.title}
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <FilmMarks />

          {/* REC indicator */}
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "18px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "rgba(220,60,60,0.7)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "9px",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
              }}
            >
              Wideo
            </span>
          </div>

          {/* Hover overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.2)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Play button */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: `1.5px solid rgba(255,255,255,${hovered ? 0.9 : 0.55})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: hovered ? "scale(1.1)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7 4l10 6-10 6V4z" fill="rgba(255,255,255,0.85)" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px 20px 20px",
              background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          >
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "4px" }}>
              {item.category}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.92)" }}>
              {item.title}
            </p>
          </div>

          {/* Accessible play trigger — transparent overlay, keyboard-focusable */}
          <button
            type="button"
            aria-label={`Odtwórz: ${item.title}`}
            onClick={() => setPlaying(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          />
        </>
      )}
    </div>
  );
}

function PhotoTile({ item }: { item: PortfolioItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: item.aspect,
        overflow: "hidden",
        background: item.bg,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <img
        src={`https://picsum.photos/seed/${item.id}/500/650`}
        alt={item.title}
        loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Aperture decorative mark */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
        }}
        aria-hidden="true"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9.5" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="11" cy="11" r="4.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="11" y1="1.5" x2="11" y2="5" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="11" y1="17" x2="11" y2="20.5" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="1.5" y1="11" x2="5" y2="11" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="17" y1="11" x2="20.5" y2="11" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </svg>
      </div>

      {/* Hover gradient + label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          right: "20px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
            marginBottom: "4px",
          }}
        >
          {item.category}
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "14px",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          {item.title}
        </p>
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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".port-line"),
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
    gsap.fromTo(
      tiles,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 }
    );
  }, [activeFilter, visible]);

  const filteredItems =
    CATEGORY_MAP[activeFilter] === null
      ? items
      : items.filter((it) => it.category === CATEGORY_MAP[activeFilter]);

  const videoItems = filteredItems.filter((it) => it.type === "video");
  const photoItems = filteredItems.filter((it) => it.type === "photo");

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{ padding: "140px 48px", background: "var(--bg)" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "60px",
        }}
      >
        <div ref={titleRef}>
          <div style={{ overflow: "hidden" }}>
            <h2
              className="port-line"
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
              Realizacje
            </h2>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span
              className="port-line"
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
              i projekty.
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
          Portfolio
        </span>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "48px",
          flexWrap: "wrap",
        }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            aria-pressed={activeFilter === f}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: `1.5px solid ${activeFilter === f ? "var(--ink)" : "transparent"}`,
              color: activeFilter === f ? "var(--ink)" : "var(--ink-muted)",
              fontFamily: "var(--font-sans)",
              fontWeight: activeFilter === f ? 600 : 400,
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "4px 0 6px",
              marginRight: "28px",
              cursor: "pointer",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== f)
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== f)
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)";
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div ref={gridRef}>
        {/* Video grid */}
        {videoItems.length > 0 && (
          <>
            {(activeFilter === "Wszystko") && (
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
                Wideo
              </p>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                marginBottom: photoItems.length > 0 ? "48px" : "0",
              }}
            >
              {videoItems.map((item) => (
                <div key={item.id} className="portfolio-tile">
                  <VideoTile item={item} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Photo grid */}
        {photoItems.length > 0 && (
          <>
            {(activeFilter === "Wszystko") && (
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
                Fotografia
              </p>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              {photoItems.map((item) => (
                <div key={item.id} className="portfolio-tile">
                  <PhotoTile item={item} />
                </div>
              ))}
            </div>
          </>
        )}

        {filteredItems.length === 0 && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "var(--ink-muted)",
              textAlign: "center",
              padding: "80px 0",
            }}
          >
            Brak realizacji w tej kategorii.
          </p>
        )}
      </div>
    </section>
  );
}
