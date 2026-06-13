"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const langBtnMobileRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggle } = useLang();
  const t = T[lang].nav;

  const links = [
    { label: t.realizacje, href: "#portfolio" },
    { label: t.uslugi, href: "#uslugi" },
    { label: t.drony, href: "#drony" },
    { label: t.onas, href: "#onas" },
    { label: t.kontakt, href: "#kontakt" },
  ];

  const nextLang = lang === "pl" ? "EN" : "PL";

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll(".menu-link");
    if (menuOpen) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, ease: "expo.out", stagger: 0.07, delay: 0.12 }
      );
    } else {
      gsap.set(items, { opacity: 0, y: 0 });
    }
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLangToggle = () => {
    const btns = [langBtnRef.current, langBtnMobileRef.current].filter(Boolean) as HTMLElement[];

    gsap.set(btns, { transformPerspective: 500 });
    gsap
      .timeline()
      .to(btns, { rotationY: 90, duration: 0.14, ease: "power2.in" })
      .call(() => toggle())
      .fromTo(
        btns,
        { rotationY: -90 },
        { rotationY: 0, duration: 0.22, ease: "back.out(1.6)" }
      );
  };

  const linkStyle: React.CSSProperties = {
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
  };

  return (
    <>
      <nav
        ref={navRef}
        className="nav-pad"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease",
          background: scrolled ? "rgba(242,237,232,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        {/* Logo — left */}
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
            flexShrink: 0,
          }}
        >
          Lotne Media
        </button>

        {/* Right group */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Desktop links + lang toggle */}
          <div className="nav-links" style={{ gap: "36px" }}>
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                style={linkStyle}
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

            {/* Language toggle — desktop */}
            <button
              ref={langBtnRef}
              onClick={handleLangToggle}
              aria-label={lang === "pl" ? "Switch to English" : "Przełącz na polski"}
              style={{
                background: "none",
                border: "1px solid rgba(13,13,13,0.22)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                color: "var(--ink-light)",
                textTransform: "uppercase",
                padding: "5px 10px",
                transition: "border-color 0.25s ease, color 0.25s ease",
                minWidth: "38px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-light)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(13,13,13,0.22)";
              }}
            >
              {nextLang}
            </button>
          </div>

          {/* Mobile: lang + hamburger */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Language toggle — mobile */}
            <button
              ref={langBtnMobileRef}
              className="nav-hamburger"
              onClick={handleLangToggle}
              aria-label={lang === "pl" ? "EN" : "PL"}
              style={{
                background: "none",
                border: "1px solid rgba(13,13,13,0.22)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "var(--ink-light)",
                padding: "5px 9px",
                flexDirection: "row",
                gap: 0,
                minWidth: "36px",
              }}
            >
              {nextLang}
            </button>

            {/* Hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={menuOpen}
            >
              <span
                style={{
                  transform: menuOpen
                    ? "rotate(45deg) translate(4px, 4px)"
                    : "none",
                }}
              />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span
                style={{
                  transform: menuOpen
                    ? "rotate(-45deg) translate(4px, -4px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {links.map((l) => (
          <button
            key={l.href}
            className="menu-link"
            onClick={() => scrollTo(l.href)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(28px, 8vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              textTransform: "uppercase",
              padding: "10px 0",
              textAlign: "left",
              lineHeight: 1.1,
              opacity: 0,
            }}
          >
            {l.label}
          </button>
        ))}
        <span
          className="menu-link"
          style={{
            marginTop: "48px",
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            opacity: 0,
          }}
        >
          Lotne Media · Katowice
        </span>
      </div>
    </>
  );
}
