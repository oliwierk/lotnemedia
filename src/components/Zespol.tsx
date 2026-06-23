"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/context/LangContext";
import { T } from "@/i18n/translations";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

const MEMBER_PHOTOS = [
	"/IlonaPtak.jpg",
	"/Bartosz Dominik operator.avif",
	"/Bart Jarzab montazysta.jpg",
	"/Basia Jendrzejczyk Fotograf.jpg",
];

function TeamCard({
	member,
	photo,
	delay,
}: {
	member: { name: string; role: string; bio: string };
	photo: string;
	delay: number;
}) {
	const [hovered, setHovered] = useState(false);
	const [tapped, setTapped] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
	const active = hovered || tapped;

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
			},
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
					marginBottom: "16px",
					cursor: "default",
					background: "#e6e0da",
				}}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				onClick={() => setTapped((prev) => !prev)}
			>
				<img
					src={photo}
					alt={member.name}
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
						background:
							"linear-gradient(to top, rgba(13,13,13,0.5) 0%, transparent 45%)",
					}}
				/>

				{/* Tap hint on mobile */}
				<div
					className="team-tap-hint"
					style={{
						position: "absolute",
						bottom: 12,
						right: 12,
						width: 28,
						height: 28,
						borderRadius: "50%",
						background: "rgba(255,255,255,0.15)",
						display: "none",
						alignItems: "center",
						justifyContent: "center",
						opacity: active ? 0 : 0.7,
						transition: "opacity 0.3s ease",
					}}
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path d="M7 3v8M3 7h8" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" />
					</svg>
				</div>

				{/* Bio overlay */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: "rgba(13,13,13,0.72)",
						opacity: active ? 1 : 0,
						transition: "opacity 0.4s ease",
						display: "flex",
						alignItems: "flex-end",
						padding: "28px",
					}}
				>
					<p
						style={{
							fontFamily: "var(--font-sans)",
							fontSize: "13px",
							lineHeight: 1.65,
							color: "rgba(242,237,232,0.9)",
							transform: active ? "translateY(0)" : "translateY(12px)",
							transition: "transform 0.4s ease",
						}}
					>
						{member.bio}
					</p>
				</div>
			</div>

			{/* Name */}
			<p
				style={{
					fontFamily: "var(--font-sans)",
					fontWeight: 600,
					fontSize: "15px",
					letterSpacing: "-0.01em",
					color: "var(--ink)",
					marginBottom: "4px",
				}}
			>
				{member.name}
			</p>

			{/* Role */}
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
	const { lang } = useLang();
	const t = T[lang].team;

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
				},
			);
		}
	}, []);

	return (
		<section
			id='zespol'
			ref={sectionRef}
			className='section-pad'
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
							className='team-line'
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
							className='team-line'
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
					className='section-label'
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

			{/* Grid: 4 columns */}
			<div className='cols-team'>
				{t.members.map((member, i) => (
					<TeamCard
						key={member.name}
						member={member}
						photo={MEMBER_PHOTOS[i]}
						delay={i * 0.1}
					/>
				))}
			</div>
		</section>
	);
}
