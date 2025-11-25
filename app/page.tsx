import Image from "next/image";
import Link from "next/link";
import chariotTeam from "public/images/home/chariot-team.webp";
import chariotVan from "public/images/home/chariot-van.jpg";
import chariot from "public/images/home/chariot-wsj.jpeg";
import eric from "public/images/home/eric2.jpeg";
import io from "public/images/home/io.jpeg";
import scoot from "public/images/home/scoot.jpeg";
import scootQuad from "public/images/home/scoot-quad.jpg";
import tourwrist from "public/images/home/tourwrist.jpeg";

import { PreloadResources } from "./preload";

export default function Page() {
	return (
		<section className="space-y-24">
			<PreloadResources />

			{/* Hero Section - Editorial asymmetric layout */}
			<div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
				{/* Left column - Text content */}
				<div className="lg:col-span-7 space-y-8">
					{/* Designation label */}
					<div className="flex items-center gap-4">
						<div className="w-12 h-px bg-amber" />
						<span className="font-mono text-xs text-amber tracking-widest uppercase">
							Engineering Leadership
						</span>
					</div>

					{/* Main headline */}
					<h1 className="font-display text-5xl lg:text-7xl leading-[1.1] tracking-tight">
						Building products
						<br />
						<span className="text-amber text-glow-subtle">people love</span>
					</h1>

					{/* Description */}
					<p className="text-stone text-xl leading-relaxed max-w-xl">
						I'm Eric Campbell — an engineering leader, startup founder, and
						builder of high-scale systems. Currently crafting the future of
						auctions at{" "}
						<a
							href="https://flowauctions.com"
							className="text-amber border-b border-amber/30 hover:border-amber transition-colors"
						>
							Flow Auctions
						</a>
						.
					</p>

					{/* Stats row */}
					<div className="flex flex-wrap gap-8 pt-4">
						<Stat value="4" label="Exits" />
						<Stat value="15+" label="Years" />
						<Stat value="YC" label="W15" highlight />
					</div>

					{/* CTA */}
					<div className="pt-4">
						<Link
							href="/work"
							className="
								group inline-flex items-center gap-3
								font-mono text-sm text-cream
								border border-elevated px-6 py-3
								hover:border-amber hover:text-amber
								transition-all duration-300
							"
						>
							<span>View my work</span>
							<svg
								className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</Link>
					</div>
				</div>

				{/* Right column - Portrait */}
				<div className="lg:col-span-5">
					<div className="relative">
						{/* Corner brackets decoration */}
						<div className="absolute -inset-4 pointer-events-none">
							<div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-amber/30" />
							<div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-amber/30" />
							<div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-amber/30" />
							<div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-amber/30" />
						</div>

						{/* Image */}
						<div className="relative aspect-[4/5] overflow-hidden">
							<Image
								alt="Eric Campbell"
								src={eric}
								fill
								className="object-cover"
								priority
							/>
							{/* Gradient overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60" />
						</div>

						{/* Caption */}
						<div className="absolute bottom-4 left-4 right-4">
							<div className="font-mono text-xs text-ash">
								<span className="text-amber">▸</span> San Francisco, CA
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* About Section */}
			<div className="relative">
				{/* Section header */}
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-xs text-ash">001</span>
					<div className="flex-1 h-px bg-elevated" />
					<span className="font-mono text-xs text-amber uppercase tracking-widest">
						About
					</span>
				</div>

				{/* Content card */}
				<div className="relative bg-surface/50 border border-elevated p-8 lg:p-12">
					{/* Corner accents */}
					<div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber/20" />
					<div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-amber/20" />

					<div className="space-y-6 text-lg text-stone leading-relaxed max-w-3xl">
						<p>
							I'm a{" "}
							<span className="text-amber font-semibold">
								product-focused engineering leader
							</span>{" "}
							who loves building tools to make engineering and product teams
							more efficient.
						</p>
						<p>
							I currently work at{" "}
							<a
								href="https://flowauctions.com"
								className="text-amber border-b border-amber/30 hover:border-amber transition-colors"
							>
								Flow Auctions
							</a>
							, where I work on the world's first AI-Native Auction House
							Management Platform.
						</p>
						<p>
							In the past, I've been a co-founder, CTO at{" "}
							<span className="font-mono text-xs text-amber bg-amber/10 px-2 py-1">
								Y Combinator W15
							</span>
							, and engineering leader at four VC-backed startups with exits.
						</p>
					</div>
				</div>
			</div>

			{/* Image Gallery - Mosaic layout */}
			<div className="relative">
				{/* Section header */}
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-xs text-ash">002</span>
					<div className="flex-1 h-px bg-elevated" />
					<span className="font-mono text-xs text-amber uppercase tracking-widest">
						Moments
					</span>
				</div>

				{/* Gallery grid */}
				<div className="grid grid-cols-6 gap-3 auto-rows-[120px] lg:auto-rows-[160px]">
					{/* Large featured image */}
					<GalleryImage
						src={tourwrist}
						alt="DEMO Conference 1st Place"
						className="col-span-4 row-span-3"
						label="DEMO 2012"
						sublabel="1st Place"
					/>

					{/* Stacked side images */}
					<GalleryImage
						src={chariotTeam}
						alt="Chariot team"
						className="col-span-2 row-span-2"
					/>

					<GalleryImage
						src={scoot}
						alt="Scoot Network founders"
						className="col-span-2 row-span-1"
					/>

					{/* Bottom row */}
					<GalleryImage
						src={chariot}
						alt="Chariot WSJ feature"
						className="col-span-2 row-span-2"
						label="WSJ"
					/>

					<GalleryImage
						src={io}
						alt="Google IO"
						className="col-span-2 row-span-2"
						label="Google I/O"
					/>

					<GalleryImage
						src={scootQuad}
						alt="Scoot Quad"
						className="col-span-2 row-span-2"
					/>
				</div>
			</div>

			{/* Companies/Exits Section */}
			<div className="relative">
				{/* Section header */}
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-xs text-ash">003</span>
					<div className="flex-1 h-px bg-elevated" />
					<span className="font-mono text-xs text-amber uppercase tracking-widest">
						Track Record
					</span>
				</div>

				{/* Companies grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<ExitCard
						company="Sphere"
						outcome="Acquired by Google"
						year="2013"
					/>
					<ExitCard
						company="My Energy"
						outcome="Acquired by Nest/Google"
						year="2013"
					/>
					<ExitCard
						company="Scoot"
						outcome="Acquired by Bird"
						year="2019"
					/>
					<ExitCard
						company="Chariot"
						outcome="Acquired by Ford"
						year="2016"
					/>
				</div>
			</div>
		</section>
	);
}

function Stat({
	value,
	label,
	highlight,
}: {
	value: string;
	label: string;
	highlight?: boolean;
}) {
	return (
		<div className="space-y-1">
			<div
				className={`font-mono text-3xl font-light ${highlight ? "text-amber text-glow-subtle" : "text-cream"}`}
			>
				{value}
			</div>
			<div className="font-mono text-xs text-ash uppercase tracking-wider">
				{label}
			</div>
		</div>
	);
}

function GalleryImage({
	src,
	alt,
	className,
	label,
	sublabel,
}: {
	src: any;
	alt: string;
	className?: string;
	label?: string;
	sublabel?: string;
}) {
	return (
		<div className={`relative group overflow-hidden ${className}`}>
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover transition-transform duration-700 group-hover:scale-105"
			/>
			{/* Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

			{/* Label */}
			{label && (
				<div className="absolute bottom-3 left-3 right-3">
					<div className="font-mono text-xs text-cream">{label}</div>
					{sublabel && (
						<div className="font-mono text-xs text-amber">{sublabel}</div>
					)}
				</div>
			)}

			{/* Corner accent on hover */}
			<div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-transparent group-hover:border-amber transition-colors duration-300" />
		</div>
	);
}

function ExitCard({
	company,
	outcome,
	year,
}: {
	company: string;
	outcome: string;
	year: string;
}) {
	return (
		<div className="group relative bg-surface/30 border border-elevated p-6 hover:border-amber/50 transition-all duration-300">
			{/* Year badge */}
			<div className="absolute top-3 right-3 font-mono text-xs text-ash">
				{year}
			</div>

			{/* Content */}
			<div className="space-y-3 pt-4">
				<h3 className="font-display text-xl text-cream group-hover:text-amber transition-colors">
					{company}
				</h3>
				<p className="font-mono text-xs text-stone leading-relaxed">
					{outcome}
				</p>
			</div>

			{/* Bottom accent line */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</div>
	);
}
