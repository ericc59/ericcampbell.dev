import type { Metadata } from "next";
import Image from "next/image";

import chariot from "public/images/work/chariot.webp";
import myenergy from "public/images/work/myenergy.webp";
import scoot from "public/images/work/scoot.png";
import sphere from "public/images/work/sphere.png";

export const metadata: Metadata = {
	title: "Work Experience",
	description:
		"Career timeline: Zapier Principal Engineer, CTO at 4 acquired startups (Chariot->Ford, Sphere->Google, Scoot->Bird, My Energy->Nest). YC W15 alum.",
};

export default function Page() {
	return (
		<section className="space-y-16">
			<div>
				<span className="text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
					Career Timeline
				</span>
				<h1 className="text-zinc-200 text-lg font-medium mt-3">
					Work & Experience
				</h1>
				<p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">
					Building products people love with high-performance engineering teams.
				</p>
			</div>

			<div className="space-y-6">
				<Entry
					status="active"
					company="LaunchKit Studios"
					role="Founder"
					period="2024 – Present"
					href="https://www.launchkitstudios.com/"
				>
					<p>
						An app studio focused on shipping AI-powered products. We build and
						launch apps at high velocity, from concept to market.
					</p>
				</Entry>

				<Entry
					status="active"
					company="Campbell Ventures"
					role="Founder"
					period="2024 – Present"
					href="https://campbell.ventures/"
				>
					<p>
						Consulting and holding company for advisory work, investments, and
						strategic partnerships in AI and developer tools.
					</p>
				</Entry>

				<Entry
					status="active"
					company="Flow Auctions"
					role="Co-Founder"
					period="2024 – Present"
					href="https://flowauctions.com"
				>
					<p>
						Building the world's first AI-Native Auction House Management
						Platform. GenAI workflows for lot descriptions, auto-pricing, and
						marketing.
					</p>
				</Entry>

				<Entry
					company="Stack0"
					role="Founder"
					period="2022 – Present"
					href="https://www.stack0.dev"
				>
					<p>
						AI-native infrastructure platform. Email, CDN, video transcoding, AI
						workflows, and a unified integrations API across 5 languages.
					</p>
				</Entry>

				<Entry
					company="Zapier"
					role="Principal Engineer"
					period="2019 – 2022"
					href="https://www.zapier.com"
				>
					<p>
						Led ideation, build, and launch of Maker, Forms, Tables, and
						Interfaces products on the Labs team.
					</p>
				</Entry>

				<Entry
					company="Chariot"
					role="CTO"
					period="2014 – 2016"
					href="https://techcrunch.com/2016/09/09/ford-mobility-solutions-acquires-chariot/"
					badge="YC W15"
					outcome="Acquired by Ford"
					logo={chariot}
				>
					<p>
						Dynamic bus routes for underserved transit neighborhoods. Built
						backend, frontend, admin dashboard, proprietary ETA system and route
						finding algorithms.
					</p>
				</Entry>

				<Entry
					company="Sphere"
					role="CTO"
					period="2012 – 2013"
					href="https://www.youtube.com/watch?app=desktop&v=nVLCxQ55P6M"
					outcome="Acquired by Google"
					logo={sphere}
				>
					<p>
						First fully spherical panoramic imaging for mobile. Featured 600+
						times by Apple, #1 travel app worldwide. Built C/C++ SDKs, backend,
						and mobile apps.
					</p>
				</Entry>

				<Entry
					company="Scoot"
					role="Founding Engineer"
					period="2012 – 2013"
					href="https://techcrunch.com/2019/06/12/bird-confirms-acquisition-of-scoot/"
					outcome="Acquired by Bird"
					logo={scoot}
				>
					<p>
						First electric scooter rental company. Built backend, frontend, admin
						dashboard, and cross-platform mobile app.
					</p>
				</Entry>

				<Entry
					company="My Energy"
					role="CTO"
					period="2009 – 2012"
					href="https://techcrunch.com/2013/05/07/nest-acquires-myenergy-to-boost-its-home-energy-management-tools/"
					outcome="Acquired by Nest & Google"
					logo={myenergy}
				>
					<p>
						Consumer utility analytics. Connected online utility accounts and
						displayed electricity, water, and gas usage on a web dashboard.
					</p>
				</Entry>
			</div>
		</section>
	);
}

function Entry({
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
		<div className="border-b border-zinc-900 pb-6">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-3">
					{logo && (
						<div className="w-7 h-7 rounded overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0 mt-0.5">
							<Image
								src={logo}
								alt={`${company} logo`}
								width={28}
								height={28}
								className="object-cover"
							/>
						</div>
					)}
					<div>
						<div className="flex items-baseline gap-2 flex-wrap">
							{status === "active" && (
								<span className="relative top-[1px] inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
							)}
							{href ? (
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
								>
									{company}
								</a>
							) : (
								<span className="text-sm text-zinc-400">{company}</span>
							)}
							{badge && (
								<span className="text-[9px] text-zinc-600 border border-zinc-800 px-1 py-px">
									{badge}
								</span>
							)}
							{outcome && (
								<span className="text-[10px] text-zinc-600">{outcome}</span>
							)}
						</div>
						<div className="text-xs text-zinc-700 mt-0.5">{role}</div>
					</div>
				</div>
				<span className="text-[10px] text-zinc-700 shrink-0 pt-0.5">
					{period}
				</span>
			</div>
			<div className="text-sm text-zinc-500 leading-relaxed mt-3">
				{children}
			</div>
		</div>
	);
}
