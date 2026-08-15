"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang, useT } from "@/context/LangContext";

export default function Hero() {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const img1Ref = useRef<HTMLDivElement>(null);
	const img2Ref = useRef<HTMLDivElement>(null);
	const img3Ref = useRef<HTMLDivElement>(null);
	const scrollHintRef = useRef<HTMLDivElement>(null);
	const t = useT().hero;

	useEffect(() => {
		const tl = gsap.timeline({ delay: 1.0 });

		const titleLines = titleRef.current?.querySelectorAll(".hero-line") || [];

		tl.fromTo(
			titleLines,
			{ yPercent: 110 },
			{ yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 },
		)
			.fromTo(
				subtitleRef.current,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
				"-=0.5",
			)
			.fromTo(
				[img1Ref.current, img2Ref.current, img3Ref.current],
				{ opacity: 0, scale: 1.06 },
				{
					opacity: 1,
					scale: 1,
					duration: 1.4,
					ease: "expo.out",
					stagger: 0.12,
				},
				"-=0.8",
			)
			.fromTo(
				scrollHintRef.current,
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
				"-=0.3",
			);

		const scrollLine = scrollHintRef.current?.querySelector(".scroll-line");
		if (scrollLine)
			gsap.to(scrollLine, {
				scaleY: 0,
				transformOrigin: "top",
				duration: 0.9,
				ease: "power2.inOut",
				repeat: -1,
				yoyo: true,
				repeatDelay: 0.3,
			});
	}, []);

	return (
		<section
			id='top'
			ref={containerRef}
			className='hero-layout'
			style={{
				minHeight: "100vh",
				position: "relative",
				overflow: "hidden",
				background: "var(--bg)",
			}}
		>
			{/* Left column — typography */}
			<div className='hero-text-col'>
				<h1
					ref={titleRef}
					style={{
						fontFamily: "var(--font-sans)",
						fontWeight: 700,
						fontSize: "clamp(56px, 8vw, 112px)",
						lineHeight: 0.95,
						letterSpacing: "-0.03em",
						color: "var(--ink)",
						overflow: "hidden",
						marginBottom: "32px",
					}}
				>
					<div style={{ overflow: "hidden", paddingBottom: "0.12em" }}>
						<span className='hero-line' style={{ display: "block" }}>
							{t.line1}
						</span>
					</div>
					<div style={{ overflow: "hidden", paddingBottom: "0.12em" }}>
						<span className='hero-line' style={{ display: "block" }}>
							{t.line2}
						</span>
					</div>
					<div style={{ overflow: "hidden", paddingBottom: "0.15em" }}>
						<span
							className='hero-line'
							style={{
								display: "block",
								fontFamily: "var(--font-serif)",
								fontWeight: 300,
								fontStyle: "italic",
							}}
						>
							{t.line3}
						</span>
					</div>
				</h1>

				<p
					ref={subtitleRef}
					style={{
						fontFamily: "var(--font-sans)",
						fontSize: "15px",
						fontWeight: 400,
						lineHeight: 1.7,
						color: "var(--ink-light)",
						maxWidth: "360px",
						letterSpacing: "0.01em",
						whiteSpace: "pre-line",
					}}
				>
					{t.subtitle}
				</p>

			</div>

			{/* Right column — stacked images grid */}
			<div
				className='hero-images'
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "8px",
					paddingTop: "80px",
					paddingBottom: "80px",
					paddingLeft: "16px",
					alignSelf: "stretch",
				}}
			>
				{/* Main image — top, large */}
				<div
					ref={img1Ref}
					style={{
						position: "relative",
						flex: "1 1 0",
						overflow: "hidden",
						minHeight: "280px",
					}}
				>
					<img
						src='/Ilona Ptak w trakcie zdjec8.jpg'
						alt='Reportaż TVP — kadr z planu'
						loading='eager'
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							display: "block",
						}}
					/>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: 14,
							left: 14,
							display: "flex",
							alignItems: "center",
							gap: 6,
						}}
					>
						<div
							style={{
								width: 7,
								height: 7,
								borderRadius: "50%",
								background: "rgba(220,60,60,0.85)",
							}}
						/>
						<span
							style={{
								color: "rgba(255,255,255,0.75)",
								fontSize: 9,
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								fontFamily: "var(--font-sans)",
							}}
						>
							REC
						</span>
					</div>
				</div>

				{/* Bottom row — two images side by side */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1.15fr 1fr",
						gap: "8px",
						flex: "0 0 38%",
					}}
				>
					{/* Event */}
					<div
						ref={img2Ref}
						style={{ position: "relative", overflow: "hidden" }}
					>
						<img
							src='/Proptertv.jpg'
							alt='Event medialny'
							loading='eager'
							style={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
							}}
						/>
						<div
							style={{
								position: "absolute",
								inset: 0,
								background:
									"linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
							}}
						/>
					</div>

					{/* Foto */}
					<div
						ref={img3Ref}
						style={{ position: "relative", overflow: "hidden" }}
					>
						<img
							src='/aparat kolor.JPG'
							alt='Fotografia'
							loading='eager'
							style={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
							}}
						/>
						<div
							style={{
								position: "absolute",
								inset: 0,
								background:
									"linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)",
							}}
						/>
					</div>
				</div>
			</div>

			{/* Scroll hint */}
			<div
				ref={scrollHintRef}
				className='hero-scroll-hint'
				style={{
					position: "absolute",
					bottom: "40px",
					left: "48px",
					display: "flex",
					alignItems: "center",
					gap: "12px",
				}}
			>
				<div
					className='scroll-line'
					style={{ width: "1px", height: "48px", background: "var(--ink)" }}
				/>
				<span
					style={{
						fontSize: "10px",
						letterSpacing: "0.2em",
						textTransform: "uppercase",
						color: "var(--ink-muted)",
						fontFamily: "var(--font-sans)",
					}}
				>
					Scroll
				</span>
			</div>
		</section>
	);
}
