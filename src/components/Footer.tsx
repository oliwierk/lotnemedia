"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

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

    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          delay: 0.15,
          scrollTrigger: { trigger: formRef.current, start: "top 88%" },
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(242,237,232,0.06)",
    border: "1px solid rgba(242,237,232,0.15)",
    color: "var(--bg)",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    padding: "16px 20px",
    width: "100%",
    outline: "none",
    borderRadius: "2px",
    transition: "border-color 0.25s ease",
  };

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
      <div ref={bigTextRef} style={{ marginBottom: "80px" }}>
        <div style={{ overflow: "hidden" }}>
          <h2
            className="footer-line"
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
            Porozmawiajmy
          </h2>
        </div>
        <div style={{ overflow: "hidden" }}>
          <span
            className="footer-line"
            style={{
              display: "block",
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(56px, 12vw, 180px)",
              lineHeight: 0.88,
              color: "rgba(242,237,232,0.3)",
            }}
          >
            o projekcie.
          </span>
        </div>
      </div>

      {/* Two-column: contact info + form */}
      <div className="cols-footer">
        {/* Contact details */}
        <div ref={detailsRef}>
          <div style={{ marginBottom: "48px" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(242,237,232,0.6)",
                marginBottom: "12px",
              }}
            >
              Email
            </p>
            <a
              href="mailto:kontakt@lotnemedia.pl"
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
              kontakt@lotnemedia.pl
            </a>
          </div>

          <div style={{ marginBottom: "48px" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(242,237,232,0.6)",
                marginBottom: "12px",
              }}
            >
              Telefon
            </p>
            <a
              href="tel:+48500000000"
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
              +48 500 000 000
            </a>
          </div>

          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(242,237,232,0.6)",
                marginBottom: "12px",
              }}
            >
              Social media
            </p>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Instagram", "YouTube", "LinkedIn", "Facebook"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "rgba(242,237,232,0.6)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLAnchorElement).style.color = "var(--bg)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLAnchorElement).style.color = "rgba(242,237,232,0.6)")
                  }
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div ref={formRef}>
          {sent ? (
            <div
              style={{
                padding: "60px 0",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid rgba(242,237,232,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4 4 8-8" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "16px",
                  color: "var(--bg)",
                  fontWeight: 500,
                }}
              >
                Wiadomość wysłana.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "rgba(242,237,232,0.5)",
                  lineHeight: 1.6,
                }}
              >
                Odpiszemy w ciągu 24 godzin.
              </p>
            </div>
          ) : (
            <>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.12em", color: "rgba(242,237,232,0.45)", marginBottom: "12px" }}>
              Pola oznaczone * są wymagane
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }} aria-label="Formularz kontaktowy">
              <div className="form-2col">
                <div>
                  <label htmlFor="contact-name" className="sr-only">Imię i nazwisko</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Imię i nazwisko *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(242,237,232,0.5)")}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(242,237,232,0.15)")}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Adres e-mail</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Adres e-mail *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(242,237,232,0.5)")}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(242,237,232,0.15)")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="sr-only">Opis projektu</label>
                <textarea
                  id="contact-message"
                  placeholder="Opisz swój projekt..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "none",
                    lineHeight: 1.7,
                  }}
                  onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(242,237,232,0.5)")}
                  onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(242,237,232,0.15)")}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  style={{
                    background: "var(--bg)",
                    color: "var(--ink)",
                    border: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "18px 36px",
                    cursor: "pointer",
                    transition: "background 0.25s ease, color 0.25s ease",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(242,237,232,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg)";
                  }}
                >
                  Wyślij wiadomość
                </button>
              </div>
            </form>
            </>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "32px",
          borderTop: "1px solid rgba(242,237,232,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(242,237,232,0.25)",
          }}
        >
          Ilona Ptak · Lotne Media
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            color: "rgba(242,237,232,0.25)",
          }}
        >
          NIP 6292401050 · Katowice · © {new Date().getFullYear()}
        </span>
      </div>

      {/* Decorative large background text */}
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
