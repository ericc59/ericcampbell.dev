/** biome-ignore-all lint/a11y/useValidAriaRole: custom role usage */
import { getBlogPosts } from "app/db/blog";
import { getProjects } from "app/db/project";
import Image from "next/image";
import Link from "next/link";
import eric from "public/images/home/eric2.jpeg";

const FEATURED_PROJECT_SLUGS = [
	"stack0",
	"flowauctions",
	"prankai",
	"reelbear",
];

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
		<section className="space-y-20">
			{/* Hero Section */}
			<div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
				<div className="lg:col-span-7 space-y-6">
					<h1 className="font-display text-2xl lg:text-3xl leading-[1.1] tracking-tight">
						I'm Eric Campbell
					</h1>

					<div className="text-stone text-lg leading-relaxed max-w-xl space-y-4">
						<p>I build developer platforms and infrastructure for AI.</p>
						<p>
							Currently building{" "}
							<a
								href="https://www.stack0.dev"
								className="text-lime-400 border-b border-lime-400/30 hover:border-lime-400 transition-colors"
							>
								Stack0
							</a>{" "}
							— infrastructure for apps and AI agents.
						</p>
						<p className="text-stone/80">
							Previously: 4 startups, 4 exits (Google, Ford, Nest, Bird).
							<br />
							Principal Engineer at Zapier. YC W15.
						</p>
					</div>
				</div>

				<div className="lg:col-span-5">
					<div className="relative aspect-square overflow-hidden rounded-full w-48">
						<Image
							alt="Eric Campbell"
							src={eric}
							fill
							className="object-cover"
							priority
						/>
					</div>
				</div>
			</div>

			{/* About */}
			<Section id="about" title="About">
				<div className="space-y-4 text-stone leading-relaxed max-w-2xl">
					<p>
						At{" "}
						<a
							href="https://www.stack0.dev"
							className="text-lime-400 hover:underline"
						>
							Stack0
						</a>
						, I'm building a TypeScript SDK with unified APIs for email, CDN,
						video processing, and 20+ integrations — now expanding into AI agent
						infrastructure.
					</p>
					<p>
						At{" "}
						<a
							href="https://zapier.com"
							className="text-lime-400 hover:underline"
						>
							Zapier
						</a>
						, I led the launches of Maker and Forms, and contributed to Tables
						and Interfaces as Principal Engineer.
					</p>
					<p>
						At{" "}
						<a
							href="https://flowauctions.com"
							className="text-lime-400 hover:underline"
						>
							Flow Auctions
						</a>
						, I'm building an AI-native auction house management platform with
						GenAI workflows for lot descriptions, auto-pricing, and marketing.
					</p>
					<p>
						Track record: founding engineer or CTO at 4 VC-backed startups, all
						acquired.
					</p>
				</div>
			</Section>

			{/* Work */}
			<Section id="work" title="Work">
				<div className="space-y-4">
					<WorkItem
						company="Stack0"
						role="Founder"
						period="2022 - Present"
						href="https://www.stack0.dev"
						active
						bullets={[
							"TypeScript SDK with unified APIs for 20+ services",
							"Expanding into AI agent infrastructure",
						]}
					/>
					<WorkItem
						company="Flow Auctions"
						role="Co-Founder"
						period="2024 - Present"
						href="https://flowauctions.com"
						active
						bullets={[
							"AI-native auction house management (Shopify for auction houses)",
							"GenAI workflows: lot descriptions, auto-pricing, marketing assets",
						]}
					/>
					<WorkItem
						company="Zapier"
						role="Principal Engineer"
						period="2019 - 2022"
						href="https://zapier.com"
						bullets={[
							"Led Maker & Forms product launches",
							"Contributed to Tables & Interfaces products",
						]}
					/>
					<WorkItem
						company="Chariot"
						role="CTO"
						period="2014 - 2016"
						outcome="Acquired by Ford"
						badge="YC W15"
						bullets={[
							"Built commuter shuttle platform from 0 to acquisition",
							"Real-time routing and demand prediction systems",
						]}
					/>
					<WorkItem
						company="Sphere"
						role="CTO"
						period="2012 - 2013"
						outcome="Acquired by Google"
						bullets={["Mobile-first social networking platform"]}
					/>
					<WorkItem
						company="Scoot"
						role="Founding Engineer"
						period="2012 - 2013"
						outcome="Acquired by Bird"
						bullets={["Early electric scooter sharing infrastructure"]}
					/>
					<WorkItem
						company="My Energy"
						role="CTO"
						period="2009 - 2012"
						outcome="Acquired by Nest/Google"
						bullets={["Home energy monitoring and analytics platform"]}
					/>
				</div>
			</Section>

			{/* Projects */}
			<Section id="projects" title="Projects">
				<div className="space-y-3">
					{allProjects.map((project) => (
						<Link
							key={project.slug}
							href={project.metadata.link ?? `/projects/${project.slug}`}
							target={project.metadata.link ? "_blank" : undefined}
							rel={project.metadata.link ? "noopener noreferrer" : undefined}
							className="group block py-3 border-b border-elevated hover:border-lime-400/30 transition-colors"
						>
							<div className="flex items-baseline justify-between">
								<span className="text-cream group-hover:text-lime-400 transition-colors">
									{project.metadata.title}
								</span>
								<span className="font-mono text-xs text-ash">
									{project.metadata.category}
								</span>
							</div>
							<p className="text-stone text-sm mt-1 max-w-xl">
								{project.metadata.summary}
							</p>
						</Link>
					))}
				</div>
				<Link
					href="/projects"
					className="inline-block mt-6 font-mono text-xs text-stone hover:text-lime-400 transition-colors"
				>
					View all projects →
				</Link>
			</Section>

			{/* Writing */}
			<Section id="writing" title="Writing">
				{recentPosts.length > 0 ? (
					<div className="space-y-3">
						{recentPosts.map((post) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="group block py-3 border-b border-elevated hover:border-lime-400/30 transition-colors"
							>
								<div className="flex items-baseline justify-between">
									<span className="text-cream group-hover:text-lime-400 transition-colors">
										{post.metadata.title}
									</span>
									<span className="font-mono text-xs text-ash">
										{new Date(post.metadata.publishedAt).toLocaleDateString(
											"en-US",
											{ month: "short", year: "numeric" },
										)}
									</span>
								</div>
								{post.metadata.summary && (
									<p className="text-stone text-sm mt-1 max-w-xl line-clamp-1">
										{post.metadata.summary}
									</p>
								)}
							</Link>
						))}
					</div>
				) : (
					<p className="text-stone">Coming soon.</p>
				)}
				<Link
					href="/blog"
					className="inline-block mt-6 font-mono text-xs text-stone hover:text-lime-400 transition-colors"
				>
					View all posts →
				</Link>
			</Section>
		</section>
	);
}

function Section({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div id={id} className="scroll-mt-24">
			<div className="flex items-center gap-4 mb-6">
				<span className="font-mono text-xs text-lime-400 uppercase tracking-widest">
					{title}
				</span>
				<div className="flex-1 h-px bg-elevated" />
			</div>
			{children}
		</div>
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
	bullets,
}: {
	company: string;
	role: string;
	period: string;
	href?: string;
	outcome?: string;
	badge?: string;
	active?: boolean;
	bullets?: string[];
}) {
	return (
		<div className="py-2 border-b border-elevated">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between">
				<div className="flex items-center gap-3">
					{active && (
						<span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
					)}
					<div>
						<div className="flex items-center gap-2 flex-wrap">
							{href ? (
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-cream hover:text-lime-400 transition-colors"
								>
									{company}
								</a>
							) : (
								<span className="text-cream">{company}</span>
							)}
							{badge && (
								<span className="font-mono text-xs text-lime-400 bg-lime-400/10 px-1.5 py-0.5">
									{badge}
								</span>
							)}
							{outcome && (
								<span className="font-mono text-xs text-lime-400">
									{outcome}
								</span>
							)}
						</div>
						<span className="font-mono text-xs text-stone">{role}</span>
					</div>
				</div>
				<span className="font-mono text-xs text-ash mt-1 sm:mt-0">
					{period}
				</span>
			</div>
			{bullets && bullets.length > 0 && (
				<ul className="mt-2 ml-5 space-y-1">
					{bullets.map((bullet) => (
						<li key={bullet} className="text-stone text-sm">
							{bullet}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
