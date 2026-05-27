# Design

## Color

Strategy: Restrained. Tinted neutrals + near-black ink on warm off-white. No saturated accent; contrast comes from light/dark inversion between sections.

| Token | Hex | OKLCH approx | Role |
|---|---|---|---|
| `--bg` | `#f2ede8` | oklch(93% 0.008 60) | Page background, warm cream |
| `--stone` | `#e6e0da` | oklch(89% 0.009 60) | Alternate section background |
| `--ink` | `#0d0d0d` | oklch(7% 0.002 0) | Primary text, dark sections background |
| `--ink-light` | `#5a5a5a` | oklch(40% 0.002 0) | Body copy, secondary text |
| `--ink-muted` | `#666666` | oklch(44% 0.002 0) | Labels, captions, metadata |

Dark sections (Drony, Footer) invert: `--bg` text on `--ink` background.

## Typography

| Role | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Display sans | DM Sans (`--font-sans`) | 700 | clamp(40–88px) | Section headings, hero |
| Display serif | Cormorant Garamond (`--font-serif`) | 300 italic | Same scale | Second line of heading pairs |
| Body | DM Sans | 400 | 15px, lh 1.75 | Running copy |
| Lead | Cormorant Garamond | 300 | clamp(18–26px) | Section intro paragraphs |
| Label | DM Sans | 400 | 10–11px, ls 0.18–0.22em | Uppercase section labels, metadata |
| UI small | DM Sans | 400–500 | 12–14px | Buttons, tags, captions |

Heading pairs follow a consistent two-line pattern: bold sans + italic serif, both at the same display size with lineHeight 0.95.

## Components

### Navbar
Fixed, transparent-to-frosted-glass on scroll. Logo left, nav links right. Links are `<button>` with `scrollIntoView`. Frosted: `rgba(242,237,232,0.88)` + `blur(12px)` at scrollY > 60.

### Hero
Full-viewport, 2-column grid. Left: display heading + subtitle. Right: 3 absolutely-positioned image tiles (large/medium/small) with vignette overlays and category labels. GSAP timeline intro.

### Services
Ruled list. Each row: index · title · description (on hover) · arrow (on hover). Hover reveals description by `max-height` transition. Left indicator bar uses `transform: scaleY` to avoid layout shift.

### Portfolio
Filtered grid with tab bar (Wszystko / Reportaże / Podcasty / Eventy / Fotografia). Video items in 2-column 16:9 grid; photo items in 3-column grid. VideoTile: thumbnail + film-strip perforations + REC badge + play button. PhotoTile: thumbnail + aperture SVG + hover overlay.

### Process
3-column bordered grid on `--stone`. Large italic number, bold title, body copy per step.

### Drony
Full-section dark inversion (`--ink` bg). Grid + decorative "AIR" watermark. 2-column: copy left, 16:9 crosshair frame right. Stats row: 3 columns, left-bordered separator.

### Zespol
4-column asymmetric grid (founder 1.4fr, others 1fr each). Portrait 3:4 photos with hover bio overlay + scale effect. Badge on founder. Quote + attribution below grid.

### About
2-column: prose + awards list on `--stone`. Awards as ruled rows (year / title / org).

### TrustedBy
Full-width CSS marquee (`animation: ticker`). Faded client names, full opacity on hover.

### Footer / Contact
Dark inversion. Display headline + 2-column layout: contact info left, form right. Form: name + email (row) + message (textarea). `.sr-only` labels for a11y.

## Motion

Library: GSAP with ScrollTrigger. All scroll animations: `start: "top 80–85%"`, `ease: "expo.out"`, `duration: 0.8–1.2s`. Text reveals: `yPercent: 110 → 0` (clip-reveal pattern). Tiles: `opacity: 0, y: 40–60 → 1, 0`. Stagger: 0.08–0.15s between elements. No bounce, no elastic.

## Spacing

Section padding: `140px 48px` (standard), `80px 48px` (TrustedBy). Internal grid gaps: 16px (tiles), 32–80px (content grids), 100px (2-col with breathing room). Typography spacing: tight (lh 0.95) for display, generous (lh 1.65–1.75) for body.

## Layout Patterns

- **2-col split**: content + visual (Hero, Drony, Lektor/Muzyka, About)
- **Ruled list**: services, awards — borderTop dividers
- **Asymmetric tile grid**: portfolio (12-col subgrid), hero images
- **Equal card grid**: Process (3-col), Zespol (4-col)
- **Full-bleed**: TrustedBy marquee, dark sections
