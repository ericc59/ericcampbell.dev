import type { Metadata } from "next";
import Image from "next/image";

import chariot from "public/images/work/chariot.webp";

export const metadata: Metadata = {
	title: "Work Experience",
	description:
		"Career timeline: Zapier Principal Engineer, CTO at 4 acquired startups (Chariot→Ford, Sphere→Google, Scoot→Bird, My Energy→Nest). YC W15 alum.",
};
import myenergy from "public/images/work/myenergy.webp";
import scoot from "public/images/work/scoot.png";
import sphere from "public/images/work/sphere.png";

export default function Page() {
	return (
		<section className="space-y-16">
			{/* Page header */}
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-px bg-lime-400" />
					<span className="font-mono text-xs text-lime-400 tracking-widest uppercase">
						Career Timeline
					</span>
				</div>
				<h1 className="font-display text-4xl lg:text-6xl tracking-tight">
					Work <span className="text-lime-400 text-glow-subtle">&</span>{" "}
					Experience
				</h1>
				<p className="text-stone text-lg max-w-2xl leading-relaxed">
					I'm on a mission to build products people love with high-performance
					engineering and product teams. Here's a timeline of my journey.
				</p>
			</div>

			{/* Timeline */}
			<div className="relative">
				{/* Vertical line */}
				<div className="absolute left-4 lg:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber via-elevated to-elevated" />

				<div className="space-y-8">
					{/* Flow Auctions - Current */}
					<TimelineEntry
						status="active"
						company="Flow Auctions"
						role="Co-Founder"
						period="2024 - Present"
						href="https://flowauctions.com"
					>
						<p>
							I started Flow Auctions in 2024 with a desire to build the world's
							first AI-Native Auction House Management Platform and the best
							place in the world to buy rare coins, bullion, and collectibles.
						</p>
					</TimelineEntry>

					{/* Stack0 */}
					<TimelineEntry
						company="Stack0"
						role="Founder"
						period="2022 - Present"
						href="https://www.stack0.dev"
					>
						<p>
							I started Stack0 in 2022 with a desire to build a better developer
							experience for the web. I believe the Next.js and Node ecosystems
							provide the best unified platform for building web applications,
							but lack a lot of tools that older frameworks provided out of the
							box. Stack0 is changing that.
						</p>
					</TimelineEntry>

					{/* Zapier */}
					<TimelineEntry
						company="Zapier"
						role="Principal Engineer"
						period="2019 - 2022"
						href="https://www.zapier.com"
					>
						<p>
							I joined the Labs team at Zapier to help ideate, build, and launch
							new products for the company. I worked on the Maker, Forms,{" "}
							<a
								href="https://zapier.com/tables"
								className="text-lime-400 border-b border-lime-400/30 hover:border-lime-400 transition-colors"
							>
								Tables
							</a>
							, and{" "}
							<a
								href="https://zapier.com/interfaces"
								className="text-lime-400 border-b border-lime-400/30 hover:border-lime-400 transition-colors"
							>
								Interfaces
							</a>{" "}
							products.
						</p>
					</TimelineEntry>

					{/* New Wave Capital */}
					<TimelineEntry
						company="New Wave Capital"
						role="Founder & CEO/CTO"
						period="2016 - 2018"
					>
						<div className="space-y-4">
							<p>
								I co-founded New Wave Capital along with{" "}
								<a
									href="https://www.linkedin.com/in/stewarthauser"
									className="text-lime-400 border-b border-lime-400/30 hover:border-lime-400 transition-colors"
								>
									Stewart Hauser
								</a>{" "}
								and{" "}
								<a
									href="https://www.linkedin.com/in/albertcheng1"
									className="text-lime-400 border-b border-lime-400/30 hover:border-lime-400 transition-colors"
								>
									Albert Cheng
								</a>{" "}
								with a goal of democratizing access to digital assets and
								improving security for everyone.
							</p>
							<p>
								After being the first company of its type approved by the SEC
								after a year-long regulatory approval process, we finally
								launched and grew the company to around $750k in AUM.
								Unfortunately, the revenues were not enough to cover the
								expenses and we were forced to shut down the company in 2018.
							</p>
						</div>
					</TimelineEntry>

					{/* Chariot */}
					<TimelineEntry
						company="Chariot"
						role="CTO"
						period="2014 - 2016"
						href="https://techcrunch.com/2016/09/09/ford-mobility-solutions-acquires-chariot/"
						badge="YC W15"
						outcome="Acquired by Ford"
						logo={chariot}
					>
						<div className="space-y-4">
							<p>
								Chariot ("Uber for buses") was a ridesharing startup in San
								Francisco that offered dynamic bus routes around the city to
								underserved transit neighborhoods.
							</p>
							<p>
								I built our backend platform (Python), frontend web app (React),
								admin dashboard (React), and proprietary ETA system and
								reverse-commute route finding algorithms (Python).
							</p>
						</div>
					</TimelineEntry>

					{/* Sphere */}
					<TimelineEntry
						company="Sphere"
						role="CTO"
						period="2012 - 2013"
						href="https://www.youtube.com/watch?app=desktop&v=nVLCxQ55P6M"
						outcome="Acquired by Google"
						logo={sphere}
					>
						<div className="space-y-4">
							<p>
								Sphere was a computer vision and image processing startup which
								developed the first fully spherical panoramic imaging technology
								for mobile devices. We were featured over 600 times by Apple and
								became the #1 travel app in the world.
							</p>
							<p>
								I built our C/C++ SDKs, backend platform (Ruby/Rails), frontend
								web app (Ruby/Rails), and worked on the mobile apps (Native iOS
								& Android).
							</p>
						</div>
					</TimelineEntry>

					{/* Scoot */}
					<TimelineEntry
						company="Scoot"
						role="Founding Engineer"
						period="2012 - 2013"
						href="https://techcrunch.com/2019/06/12/bird-confirms-acquisition-of-scoot/"
						outcome="Acquired by Bird"
						logo={scoot}
					>
						<div className="space-y-4">
							<p>
								Scoot was the first electric scooter rental company. We created
								Vespa style sitdown scooters with a custom dock for mobile
								phones.
							</p>
							<p>
								I built our backend platform (Ruby/Rails), frontend web app
								(Ruby/Rails), admin dashboard (Ruby/Rails), and the
								cross-platform mobile app (C#/Xamarin).
							</p>
						</div>
					</TimelineEntry>

					{/* My Energy */}
					<TimelineEntry
						company="My Energy"
						role="CTO"
						period="2009 - 2012"
						href="https://techcrunch.com/2013/05/07/nest-acquires-myenergy-to-boost-its-home-energy-management-tools/"
						outcome="Acquired by Nest & Google"
						logo={myenergy}
					>
						<p>
							My Energy provided consumers with information on how much
							electricity, water, and natural gas they use and how much they
							spend on these utilities. Simply connect your online utility
							accounts with the platform, and the system imports all the
							necessary bits and displays them on the beautiful web dashboard.
						</p>
					</TimelineEntry>
				</div>
			</div>
		</section>
	);
}

function TimelineEntry({
	status,
	company,
	role,
	period,
	href,
	badge,
	outcome,
	logo,
	children,
}: {
	status?: "active";
	company: string;
	role: string;
	period: string;
	href?: string;
	badge?: string;
	outcome?: string;
	logo?: any;
	children: React.ReactNode;
}) {
	return (
		<div className="relative pl-12 lg:pl-20">
			{/* Timeline dot */}
			<div
				className={`
				absolute left-2 lg:left-6 top-2
				w-4 h-4 rounded-full
				border-4 border-void
				${status === "active" ? "bg-lime-400 animate-pulse-glow" : "bg-elevated"}
			`}
			/>

			{/* Content card */}
			<div className="group relative bg-surface/30 border border-elevated hover:border-lime-400/30 transition-all duration-300">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-elevated/50">
					<div className="flex items-center gap-4">
						{/* Logo */}
						{logo && (
							<div className="w-10 h-10 rounded overflow-hidden bg-elevated flex items-center justify-center">
								<Image
									src={logo}
									alt={`${company} logo`}
									width={40}
									height={40}
									className="object-cover"
								/>
							</div>
						)}

						{/* Company name & role */}
						<div>
							<div className="flex items-center gap-3">
								{href ? (
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="font-display text-xl text-cream hover:text-lime-400 transition-colors"
									>
										{company}
									</a>
								) : (
									<span className="font-display text-xl text-cream">
										{company}
									</span>
								)}
								{badge && (
									<span className="font-mono text-xs text-lime-400 bg-lime-400/10 px-2 py-0.5 border border-lime-400/20">
										{badge}
									</span>
								)}
							</div>
							<div className="font-mono text-xs text-stone mt-1">{role}</div>
						</div>
					</div>

					{/* Period & outcome */}
					<div className="mt-4 md:mt-0 text-right">
						<div className="font-mono text-xs text-ash">{period}</div>
						{outcome && (
							<div className="font-mono text-xs text-lime-400 mt-1">
								{outcome}
							</div>
						)}
					</div>
				</div>

				{/* Body */}
				<div className="p-6 text-stone leading-relaxed">{children}</div>

				{/* Corner accent */}
				<div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-lime-400/30 transition-colors duration-300" />
			</div>
		</div>
	);
}
