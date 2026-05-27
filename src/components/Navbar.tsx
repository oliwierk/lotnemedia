"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const links = [
  { label: "Realizacje", href: "#portfolio" },
  { label: "Usługi", href: "#uslugi" },
  { label: "Drony", href: "#drony" },
  { label: "O nas", href: "#onas" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 1.2 }
    );

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMenuOpen(false);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "28px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
        background: scrolled ? "rgba(242,237,232,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <button
        onClick={() => scrollTo("#top")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "15px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink)",
          textDecoration: "none",
        }}
      >
        Lotne Media
      </button>

      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        {links.map((l) => (
          <button
            key={l.label}
            onClick={() => scrollTo(l.href)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: "var(--ink-light)",
              textTransform: "uppercase",
              padding: 0,
              transition: "color 0.25s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "var(--ink)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "var(--ink-light)")
            }
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
