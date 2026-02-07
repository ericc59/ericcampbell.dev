import { getBlogPosts } from "app/db/blog";
import { getProjects } from "app/db/project";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import eric from "public/images/home/eric2.jpeg";

export const metadata: Metadata = {
	title: "Eric Campbell - Software Engineer & Startup Founder",
	description:
		"Software engineering leader building Stack0 and Flow Auctions. Former Zapier Principal Engineer. Founding engineer at 4 acquired startups (Google, Ford, Nest, Bird). YC W15.",
	openGraph: {
		title: "Eric Campbell - Software Engineer & Startup Founder",
		description:
			"Software engineering leader building Stack0 and Flow Auctions. Former Zapier Principal Engineer. Founding engineer at 4 acquired startups.",
	},
};

const FEATURED_PROJECT_SLUGS = ["pixelport", "prankai", "reelbear"];

export default function Page() {
	const allProjects = getProjects()
		.filter((p) => FEATURED_PROJECT_SLUGS.includes(p.slug))
		.sort(
			(a, b) =>
				FEATURED_PROJECT_SLUGS.indexOf(a.slug) -
				FEATURED_PROJECT_SLUGS.indexOf(b.slug),
		);

	const recentPosts = getBlogPosts()
		.sort((a, b) => {
			if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
				return -1;
			}
			return 1;
		})
		.slice(0, 3);

	return (
		<section className="space-y-24">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Person",
						name: "Eric Campbell",
						url: "https://www.ericcampbell.dev",
						image: "https://www.ericcampbell.dev/images/home/eric2.jpeg",
						jobTitle: "Software Engineer & Startup Founder",
						worksFor: [
							{
								"@type": "Organization",
								name: "Stack0",
								url: "https://www.stack0.dev",
							},
							{
								"@type": "Organization",
								name: "Flow Auctions",
								url: "https://marketing.flowauctions.com/platform/sellers",
							},
							{
								"@type": "Organization",
								name: "LaunchKit Studios",
								url: "https://www.launchkitstudios.com/",
							},
							{
								"@type": "Organization",
								name: "Campbell Ventures",
								url: "https://campbell.ventures/",
							},
						],
						alumniOf: [
							{ "@type": "Organization", name: "Zapier" },
							{ "@type": "Organization", name: "Y Combinator" },
						],
						sameAs: [
							"https://twitter.com/ericcampbell59",
							"https://www.linkedin.com/in/ericcampbell59/",
							"https://github.com/ericc59",
						],
						knowsAbout: [
							"Software Engineering",
							"AI Infrastructure",
							"Startups",
							"Developer Tools",
						],
					}),
				}}
			/>

			{/* Hero */}
			<div className="space-y-8">
				<div className="flex items-start gap-6">
					<div className="relative w-16 h-16 rounded-full overflow-hidden ring-1 ring-elevated shrink-0">
						<Image
							alt="Eric Campbell"
							src={eric}
							fill
							className="object-cover"
							priority
						/>
					</div>
					<div className="space-y-1 pt-1">
						<h1 className="font-display text-3xl lg:text-4xl tracking-tight leading-none">
							Eric Campbell
						</h1>
						<p className="font-mono text-xs text-ash tracking-wide">
							Building infrastructure for AI agents
						</p>
					</div>
				</div>

				<div className="text-sand text-[17px] leading-relaxed max-w-xl space-y-4">
					<p>
						I build developer platforms and infrastructure for AI.
						Currently building{" "}
						<InlineLink href="https://www.stack0.dev">Stack0</InlineLink>
						{" "}&mdash; infrastructure for apps and AI agents.
					</p>
					<p>
						Running{" "}
						<InlineLink href="https://www.launchkitstudios.com/">
							LaunchKit Studios
						</InlineLink>
						{" "}&mdash; an app studio shipping AI-powered products, and{" "}
						<InlineLink href="https://campbell.ventures/">
							Campbell Ventures
						</InlineLink>
						{" "}&mdash; consulting & investments.
					</p>
					<p className="text-ash">
						Previously: 4 startups, 4 exits (Google, Ford, Nest, Bird).
						Principal Engineer at Zapier. YC W15.
					</p>
				</div>
			</div>

			{/* About */}
			<Section id="about" label="About">
				<div className="space-y-4 text-sand leading-relaxed">
					<p>
						At{" "}
						<InlineLink href="https://www.stack0.dev">Stack0</InlineLink>,
						I'm building an AI-native infrastructure platform &mdash; email, CDN,
						video transcoding, AI workflows, and a unified integrations API
						across 5 languages.
					</p>
					<p>
						At{" "}
						<InlineLink href="https://zapier.com">Zapier</InlineLink>,
						I led the launches of Maker and Forms, and contributed to Tables
						and Interfaces as Principal Engineer.
					</p>
					<p>
						At{" "}
						<InlineLink href="https://marketing.flowauctions.com/platform/sellers">
							Flow Auctions
						</InlineLink>,
						I'm building an AI-native auction house management platform with
						GenAI workflows for lot descriptions, auto-pricing, and marketing.
					</p>
					<p className="text-ash">
						Track record: founding engineer or CTO at 4 VC-backed startups, all
						acquired.
					</p>
				</div>
			</Section>

			{/* Work */}
			<Section id="work" label="Work">
				<div className="space-y-0">
					<WorkItem
						company="LaunchKit Studios"
						role="Founder"
						period="2024 &ndash; Present"
						href="https://www.launchkitstudios.com/"
						active
					/>
					<WorkItem
						company="Campbell Ventures"
						role="Founder"
						period="2024 &ndash; Present"
						href="https://campbell.ventures/"
						active
					/>
					<WorkItem
						company="Stack0"
						role="Founder"
						period="2022 &ndash; Present"
						href="https://www.stack0.dev"
						active
					/>
					<WorkItem
						company="Flow Auctions"
						role="Co-Founder"
						period="2024 &ndash; Present"
						href="https://marketing.flowauctions.com/platform/sellers"
						active
					/>
					<WorkItem
						company="Zapier"
						role="Principal Engineer"
						period="2019 &ndash; 2022"
						href="https://zapier.com"
					/>
					<WorkItem
						company="Chariot"
						role="CTO"
						period="2014 &ndash; 2016"
						outcome="Ford"
						badge="YC W15"
					/>
					<WorkItem
						company="Sphere"
						role="CTO"
						period="2012 &ndash; 2013"
						outcome="Google"
					/>
					<WorkItem
						company="Scoot"
						role="Founding Engineer"
						period="2012 &ndash; 2013"
						outcome="Bird"
					/>
					<WorkItem
						company="My Energy"
						role="CTO"
						period="2009 &ndash; 2012"
						outcome="Nest"
					/>
				</div>
			</Section>

			{/* Projects */}
			<Section id="projects" label="Projects">
				<div className="space-y-0">
					{allProjects.map((project) => (
						<Link
							key={project.slug}
							href={project.metadata.link ?? `/projects/${project.slug}`}
							target={project.metadata.link ? "_blank" : undefined}
							rel={project.metadata.link ? "noopener noreferrer" : undefined}
							className="group flex items-baseline justify-between py-4 border-b border-faint/50 hover:border-copper/20 transition-colors"
						>
							<div className="space-y-0.5">
								<span className="text-cream group-hover:text-copper transition-colors">
									{project.metadata.title}
								</span>
								<p className="font-mono text-xs text-ash max-w-md">
									{project.metadata.summary}
								</p>
							</div>
							<span className="font-mono text-[10px] text-ash uppercase tracking-widest shrink-0 ml-4">
								{project.metadata.category}
							</span>
						</Link>
					))}
				</div>
				<Link
					href="/projects"
					className="inline-block mt-6 font-mono text-xs text-ash hover:text-copper transition-colors"
				>
					All projects &rarr;
				</Link>
			</Section>

			{/* Writing */}
			<Section id="writing" label="Writing">
				{recentPosts.length > 0 ? (
					<div className="space-y-0">
						{recentPosts.map((post) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="group flex items-baseline justify-between py-4 border-b border-faint/50 hover:border-copper/20 transition-colors"
							>
								<span className="text-cream group-hover:text-copper transition-colors">
									{post.metadata.title}
								</span>
								<span className="font-mono text-[10px] text-ash shrink-0 ml-4">
									{new Date(post.metadata.publishedAt).toLocaleDateString(
										"en-US",
										{ month: "short", year: "numeric" },
									)}
								</span>
							</Link>
						))}
					</div>
				) : (
					<p className="text-ash">Coming soon.</p>
				)}
				<Link
					href="/blog"
					className="inline-block mt-6 font-mono text-xs text-ash hover:text-copper transition-colors"
				>
					All posts &rarr;
				</Link>
			</Section>
		</section>
	);
}

function Section({
	id,
	label,
	children,
}: {
	id: string;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div id={id} className="scroll-mt-24">
			<div className="flex items-center gap-4 mb-8">
				<span className="font-mono text-[10px] text-copper uppercase tracking-[0.2em]">
					{label}
				</span>
				<div className="flex-1 h-px bg-gradient-to-r from-copper/20 to-transparent" />
			</div>
			{children}
		</div>
	);
}

function InlineLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-copper border-b border-copper/30 hover:border-copper transition-colors"
		>
			{children}
		</a>
	);
}

function WorkItem({
	company,
	role,
	period,
	href,
	outcome,
	badge,
	active,
}: {
	company: string;
	role: string;
	period: string;
	href?: string;
	outcome?: string;
	badge?: string;
	active?: boolean;
}) {
	return (
		<div className="flex items-start justify-between py-4 border-b border-faint/50">
			<div className="flex items-start gap-3">
				{active && <div className="elevation-marker mt-2 shrink-0" />}
				<div className="space-y-0.5">
					<div className="flex items-center gap-2 flex-wrap">
						{href ? (
							<a
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-cream hover:text-copper transition-colors"
							>
								{company}
							</a>
						) : (
							<span className="text-cream">{company}</span>
						)}
						{badge && (
							<span className="font-mono text-[10px] text-copper bg-copper-muted px-1.5 py-0.5 rounded-sm">
								{badge}
							</span>
						)}
						{outcome && (
							<span className="font-mono text-[10px] text-ash">
								&rarr; {outcome}
							</span>
						)}
					</div>
					<span className="font-mono text-xs text-ash">{role}</span>
				</div>
			</div>
			<span
				className="font-mono text-[10px] text-ash shrink-0 ml-4 pt-1"
				dangerouslySetInnerHTML={{ __html: period }}
			/>
		</div>
	);
}
