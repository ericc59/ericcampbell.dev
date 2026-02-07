import type { Metadata } from "next";
import Image from "next/image";

import chariot from "public/images/work/chariot.webp";

export const metadata: Metadata = {
	title: "Work Experience",
	description:
		"Career timeline: Zapier Principal Engineer, CTO at 4 acquired startups (Chariot->Ford, Sphere->Google, Scoot->Bird, My Energy->Nest). YC W15 alum.",
};
import myenergy from "public/images/work/myenergy.webp";
import scoot from "public/images/work/scoot.png";
import sphere from "public/images/work/sphere.png";

export default function Page() {
	return (
		<section className="space-y-16">
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<span className="font-mono text-[10px] text-copper uppercase tracking-[0.2em]">
						Career Timeline
					</span>
					<div className="flex-1 h-px bg-gradient-to-r from-copper/20 to-transparent" />
				</div>
				<h1 className="font-display text-4xl lg:text-5xl tracking-tight">
					Work & Experience
				</h1>
				<p className="text-sand text-lg max-w-2xl leading-relaxed">
					I'm on a mission to build products people love with high-performance
					engineering and product teams. Here's a timeline of my journey.
				</p>
			</div>

			<div className="relative">
				{/* Vertical line */}
				<div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-copper/30 via-faint to-faint" />

				<div className="space-y-6">
					<TimelineEntry
						status="active"
						company="LaunchKit Studios"
						role="Founder"
						period="2024 - Present"
						href="https://www.launchkitstudios.com/"
					>
						<p>
							LaunchKit Studios is an app studio focused on shipping AI-powered
							products. We build and launch apps at high velocity, from concept
							to market.
						</p>
					</TimelineEntry>

					<TimelineEntry
						status="active"
						company="Campbell Ventures"
						role="Founder"
						period="2024 - Present"
						href="https://campbell.ventures/"
					>
						<p>
							Campbell Ventures is my consulting and holding company for
							advisory work, investments, and strategic partnerships in the
							AI and developer tools space.
						</p>
					</TimelineEntry>

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
								className="text-copper border-b border-copper/30 hover:border-copper transition-colors"
							>
								Tables
							</a>
							, and{" "}
							<a
								href="https://zapier.com/interfaces"
								className="text-copper border-b border-copper/30 hover:border-copper transition-colors"
							>
								Interfaces
							</a>{" "}
							products.
						</p>
					</TimelineEntry>

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
									className="text-copper border-b border-copper/30 hover:border-copper transition-colors"
								>
									Stewart Hauser
								</a>{" "}
								and{" "}
								<a
									href="https://www.linkedin.com/in/albertcheng1"
									className="text-copper border-b border-copper/30 hover:border-copper transition-colors"
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
		<div className="relative pl-10">
			{/* Timeline dot */}
			<div
				className={`
				absolute left-1.5 top-3
				w-3 h-3 rounded-full
				border-2 border-void
				${status === "active" ? "bg-signal-green shadow-[0_0_8px_rgba(107,203,119,0.5)]" : "bg-elevated"}
			`}
			/>

			{/* Content */}
			<div className="group border border-faint/30 hover:border-copper/15 transition-colors duration-300">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-faint/30">
					<div className="flex items-center gap-3">
						{logo && (
							<div className="w-8 h-8 rounded overflow-hidden bg-elevated flex items-center justify-center">
								<Image
									src={logo}
									alt={`${company} logo`}
									width={32}
									height={32}
									className="object-cover"
								/>
							</div>
						)}

						<div>
							<div className="flex items-center gap-2">
								{href ? (
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="font-display text-xl text-cream hover:text-copper transition-colors"
									>
										{company}
									</a>
								) : (
									<span className="font-display text-xl text-cream">
										{company}
									</span>
								)}
								{badge && (
									<span className="font-mono text-[10px] text-copper bg-copper-muted px-1.5 py-0.5 rounded-sm">
										{badge}
									</span>
								)}
							</div>
							<div className="font-mono text-xs text-ash mt-0.5">{role}</div>
						</div>
					</div>

					<div className="mt-3 md:mt-0 text-right">
						<div className="font-mono text-[10px] text-ash">{period}</div>
						{outcome && (
							<div className="font-mono text-[10px] text-copper mt-0.5">
								{outcome}
							</div>
						)}
					</div>
				</div>

				{/* Body */}
				<div className="p-5 text-sand text-[15px] leading-relaxed">
					{children}
				</div>
			</div>
		</div>
	);
}
