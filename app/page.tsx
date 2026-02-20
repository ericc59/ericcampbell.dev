import { getBlogPosts } from "app/db/blog";
import { getProjects } from "app/db/project";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import profilePhoto from "public/images/home/eric2.jpeg";
import flowLogo from "public/images/projects/flowauctions/flowauctions-logo.png";
import stack0Logo from "public/images/projects/stack0/logo.png";
import chariotLogo from "public/images/work/chariot.webp";
import myenergyLogo from "public/images/work/myenergy.webp";
import scootLogo from "public/images/work/scoot.png";
import sphereLogo from "public/images/work/sphere.png";
import ProjectLogo from "./components/project-logo";

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
			if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt))
				return -1;
			return 1;
		})
		.slice(0, 3);

	return (
		<section className="space-y-20">
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

			{/* Identity */}
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-1 ring-zinc-800">
						<Image
							src={profilePhoto}
							alt="Eric Campbell"
							width={48}
							height={48}
							className="object-cover w-full h-full"
							priority
						/>
					</div>
					<div>
						<h1 className="text-zinc-200 text-lg font-medium">Eric Campbell</h1>
						<p className="text-zinc-400 text-xs mt-0.5">
							Building infrastructure for AI agents
							<span className="inline-block w-[5px] h-[13px] bg-zinc-400 ml-0.5 -mb-[1px] animate-blink" />
						</p>
					</div>
				</div>

				<div className="text-sm leading-relaxed space-y-3 max-w-lg">
					<p>
						I build developer platforms and infrastructure for AI. Currently
						building <Anchor href="https://www.stack0.dev">Stack0</Anchor> and{" "}
						<Anchor href="https://www.launchkitstudios.com/">
							LaunchKit Studios
						</Anchor>
						.
					</p>
					<p className="text-zinc-400">
						4 startups, 4 exits (Google, Ford, Nest, Bird). Prev Zapier Labs.
						CTO at YC W15.
					</p>
				</div>
			</div>

			{/* Now */}
			<div id="work" className="scroll-mt-24 space-y-16">
				<div>
					<Label>Now</Label>
					<div className="mt-4 space-y-0">
						<WorkRow
							company="LaunchKit Studios"
							role="Founder"
							period="2024 –"
							href="https://www.launchkitstudios.com/"
							active
						/>
						<WorkRow
							company="Campbell Ventures"
							role="Founder"
							period="2024 –"
							href="https://campbell.ventures/"
							active
						/>
						<WorkRow
							company="Stack0"
							role="Founder"
							period="2022 –"
							href="https://www.stack0.dev"
							logo={stack0Logo}
							active
						/>
						<WorkRow
							company="Flow Auctions"
							role="Co-Founder"
							period="2024 –"
							href="https://marketing.flowauctions.com/platform/sellers"
							logo={flowLogo}
							active
						/>
					</div>
				</div>

				<div>
					<Label>Previously</Label>
					<div className="mt-4 space-y-0">
						<WorkRow company="Zapier" role="Principal Eng" period="2019 – 22" />
						<WorkRow
							company="Chariot"
							role="CTO"
							period="2014 – 16"
							exit="Ford"
							badge="YC W15"
							logo={chariotLogo}
						/>
						<WorkRow
							company="Sphere"
							role="CTO"
							period="2012 – 13"
							exit="Google"
							logo={sphereLogo}
						/>
						<WorkRow
							company="Scoot"
							role="Founding Eng"
							period="2012 – 13"
							exit="Bird"
							logo={scootLogo}
						/>
						<WorkRow
							company="My Energy"
							role="CTO"
							period="2009 – 12"
							exit="Nest"
							logo={myenergyLogo}
						/>
					</div>
				</div>
			</div>

			{/* Projects */}
			<div id="projects" className="scroll-mt-24">
				<Label>Projects</Label>
				<div className="mt-4 space-y-0">
					{allProjects.map((project) => (
						<Link
							key={project.slug}
							href={project.metadata.link ?? `/projects/${project.slug}`}
							target={project.metadata.link ? "_blank" : undefined}
							rel={project.metadata.link ? "noopener noreferrer" : undefined}
							className="group flex items-center justify-between py-2.5 border-b border-zinc-900 hover:border-zinc-800 transition-colors"
						>
							<div className="flex items-center gap-2.5">
								{project.metadata.logo && (
									<div className="w-5 h-5 rounded-sm overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0">
										<ProjectLogo
											src={project.metadata.logo}
											alt={project.metadata.title}
										/>
									</div>
								)}
								<span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
									{project.metadata.title}
								</span>
							</div>
							<span className="text-[10px] text-zinc-500 uppercase tracking-wider shrink-0 ml-4">
								{project.metadata.category}
							</span>
						</Link>
					))}
				</div>
				<Link
					href="/projects"
					className="inline-block mt-4 text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors"
				>
					all projects →
				</Link>
			</div>

			{/* Writing */}
			<div id="writing" className="scroll-mt-24">
				<Label>Writing</Label>
				{recentPosts.length > 0 ? (
					<div className="mt-4 space-y-0">
						{recentPosts.map((post) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="group flex items-baseline justify-between py-2.5 border-b border-zinc-900 hover:border-zinc-800 transition-colors"
							>
								<span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
									{post.metadata.title}
								</span>
								<span className="text-[10px] text-zinc-500 shrink-0 ml-4">
									{new Date(post.metadata.publishedAt).toLocaleDateString(
										"en-US",
										{ month: "short", year: "2-digit" },
									)}
								</span>
							</Link>
						))}
					</div>
				) : (
					<p className="mt-4 text-sm text-zinc-600">Coming soon.</p>
				)}
				<Link
					href="/blog"
					className="inline-block mt-4 text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors"
				>
					all posts →
				</Link>
			</div>

			{/* Contact */}
			<div className="flex items-center gap-5 text-[10px] text-zinc-500 pt-4">
				<a
					href="https://twitter.com/ericcampbell59"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-400 transition-colors"
				>
					twitter
				</a>
				<a
					href="https://www.linkedin.com/in/ericcampbell59/"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-400 transition-colors"
				>
					linkedin
				</a>
				<a
					href="https://github.com/ericc59"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-400 transition-colors"
				>
					github
				</a>
				<a
					href="mailto:eric@campbell.ventures"
					className="hover:text-zinc-400 transition-colors"
				>
					email
				</a>
			</div>
		</section>
	);
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-[10px] text-zinc-500 uppercase tracking-[0.15em]">
			{children}
		</span>
	);
}

function Anchor({
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
			className="text-zinc-300 hover:text-zinc-100 transition-colors"
		>
			{children}
		</a>
	);
}

function WorkRow({
	company,
	role,
	period,
	href,
	exit,
	badge,
	active,
	logo,
}: {
	company: string;
	role: string;
	period: string;
	href?: string;
	exit?: string;
	badge?: string;
	active?: boolean;
	logo?: any;
}) {
	return (
		<div className="flex items-center justify-between py-2.5 border-b border-zinc-900 text-sm">
			<div className="flex items-center gap-2">
				{active && !logo && (
					<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
				)}
				{logo && (
					<div className="relative w-5 h-5 rounded-sm overflow-hidden bg-zinc-900 shrink-0">
						<Image src={logo} alt={company} fill className="object-cover" />
						{active && (
							<span className="absolute -top-px -right-px w-1.5 h-1.5 rounded-full bg-emerald-400 border border-zinc-950" />
						)}
					</div>
				)}
				<div className="flex items-baseline gap-2 flex-wrap">
					{href ? (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-zinc-300 hover:text-zinc-100 transition-colors"
						>
							{company}
						</a>
					) : (
						<span className="text-zinc-300">{company}</span>
					)}
					<span className="text-zinc-500 text-xs">{role}</span>
					{badge && (
						<span className="text-[9px] text-zinc-500 border border-zinc-800 px-1 py-px">
							{badge}
						</span>
					)}
					{exit && <span className="text-[10px] text-zinc-500">→ {exit}</span>}
				</div>
			</div>
			<span className="text-[10px] text-zinc-500 shrink-0 ml-4">{period}</span>
		</div>
	);
}
