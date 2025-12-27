/** biome-ignore-all lint/a11y/useValidAriaRole: <explanation> */
import { getContracts } from "app/db/contract";
import { getProjects } from "app/db/project";
import Image from "next/image";
import Link from "next/link";
import eric from "public/images/home/eric2.jpeg";

export default function Page() {
	const allProjects = getProjects()
		.sort((a, b) => {
			if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
				return -1;
			}
			return 1;
		})
		.slice(0, 6);

	const allContracts = getContracts()
		.sort((a, b) => {
			if (
				new Date(a?.metadata.publishedAt ?? "") >
				new Date(b?.metadata.publishedAt ?? "")
			) {
				return -1;
			}
			return 1;
		})
		.slice(0, 6);

	return (
		<section className="space-y-20">
			{/* Hero Section */}
			<div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
				<div className="lg:col-span-7 space-y-6">
					<h1 className="font-display text-2xl lg:text-3xl leading-[1.1] tracking-tight">
						I'm Eric Campbell
					</h1>

					<p className="text-stone text-lg leading-relaxed max-w-xl">
						— an engineering leader, startup founder, and builder of high-scale
						systems. Currently crafting the future of auctions at{" "}
						<a
							href="https://flowauctions.com"
							className="text-lime-400 border-b border-lime-400/30 hover:border-lime-400 transition-colors"
						>
							Flow Auctions
						</a>
						.
					</p>
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
			<Section id="about" code="001" title="About">
				<div className="space-y-4 text-stone leading-relaxed max-w-2xl">
					<p>
						I'm a{" "}
						<span className="text-cream">
							product-focused engineering leader
						</span>{" "}
						who loves building tools to make engineering and product teams more
						efficient.
					</p>
					<p>
						Currently at{" "}
						<a
							href="https://flowauctions.com"
							className="text-lime-400 hover:underline"
						>
							Flow Auctions
						</a>
						, building the world's first AI-Native Auction House Management
						Platform.
					</p>
					<p>
						Previously: co-founder, CTO at{" "}
						<span className="text-lime-400">Y Combinator W15</span>, and
						engineering leader at four VC-backed startups with exits.
					</p>
				</div>
			</Section>

			{/* Work */}
			<Section id="work" code="002" title="Work">
				<div className="space-y-4">
					<WorkItem
						company="Flow Auctions"
						role="Co-Founder"
						period="2024 - Present"
						href="https://flowauctions.com"
						active
					/>
					<WorkItem
						company="Protocol"
						role="Founder"
						period="2022 - Present"
						href="https://pxyz.dev"
					/>
					<WorkItem
						company="Zapier"
						role="Principal Engineer"
						period="2019 - 2022"
						href="https://zapier.com"
					/>
					<WorkItem
						company="New Wave Capital"
						role="Co-Founder"
						period="2016 - 2018"
						href="#"
					/>
					<WorkItem
						company="Chariot"
						role="CTO"
						period="2014 - 2016"
						outcome="Acquired by Ford"
						badge="YC W15"
					/>
					<WorkItem
						company="Sphere"
						role="CTO"
						period="2012 - 2013"
						outcome="Acquired by Google"
					/>
					<WorkItem
						company="Scoot"
						role="Founding Engineer"
						period="2012 - 2013"
						outcome="Acquired by Bird"
					/>
					<WorkItem
						company="My Energy"
						role="CTO"
						period="2009 - 2012"
						outcome="Acquired by Nest/Google"
					/>
				</div>
			</Section>

			{/* Projects */}
			<Section id="projects" code="003" title="Projects">
				<div className="space-y-3">
					{allProjects.map((project) => (
						<Link
							key={project.slug}
							href={`/projects/${project.slug}`}
							className="group flex items-baseline justify-between py-2 border-b border-elevated hover:border-lime-400/30 transition-colors"
						>
							<span className="text-cream group-hover:text-lime-400 transition-colors">
								{project.metadata.title}
							</span>
							<span className="font-mono text-xs text-ash">
								{project.metadata.category}
							</span>
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

			{/* Contract Work */}
			<Section id="contract" code="004" title="Contract Work">
				<p className="text-stone mb-6">
					Looking for expert engineering?{" "}
					<a
						href="mailto:ericc@campbell.ventures?subject=I've got a project for you"
						className="text-lime-400 hover:underline"
					>
						Let's talk
					</a>
					.
				</p>
				<div className="space-y-3">
					{allContracts.map((project) => (
						<Link
							key={project?.slug}
							href={`/contract-work/${project?.slug}`}
							className="group flex items-baseline justify-between py-2 border-b border-elevated hover:border-lime-400/30 transition-colors"
						>
							<span className="text-cream group-hover:text-lime-400 transition-colors">
								{project?.metadata.title}
							</span>
							<span className="font-mono text-xs text-ash">
								{project?.metadata.category}
							</span>
						</Link>
					))}
				</div>
				<Link
					href="/contract-work"
					className="inline-block mt-6 font-mono text-xs text-stone hover:text-lime-400 transition-colors"
				>
					View all contract work →
				</Link>
			</Section>

			{/* Tools */}
			<Section id="tools" code="005" title="Tools">
				<div className="space-y-3">
					<Link
						href="/tools/product-screenshot"
						className="group flex items-baseline justify-between py-2 border-b border-elevated hover:border-lime-400/30 transition-colors"
					>
						<span className="text-cream group-hover:text-lime-400 transition-colors">
							Product Screenshot
						</span>
						<span className="font-mono text-xs text-lime-400">FREE</span>
					</Link>
					<Link
						href="/tools/app-store-assets"
						className="group flex items-baseline justify-between py-2 border-b border-elevated hover:border-lime-400/30 transition-colors"
					>
						<span className="text-cream group-hover:text-lime-400 transition-colors">
							App Store Assets
						</span>
						<span className="font-mono text-xs text-lime-400">FREE</span>
					</Link>
				</div>
			</Section>
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
				className={`font-mono text-2xl font-light ${highlight ? "text-lime-400" : "text-cream"}`}
			>
				{value}
			</div>
			<div className="font-mono text-xs text-ash uppercase tracking-wider">
				{label}
			</div>
		</div>
	);
}

function Section({
	id,
	code,
	title,
	children,
}: {
	id: string;
	code: string;
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
		<div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-elevated">
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
							<span className="font-mono text-xs text-lime-400">{outcome}</span>
						)}
					</div>
					<span className="font-mono text-xs text-stone">{role}</span>
				</div>
			</div>
			<span className="font-mono text-xs text-ash mt-1 sm:mt-0">{period}</span>
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
		<div className="border border-elevated p-4 hover:border-lime-400/30 transition-colors">
			<div className="font-mono text-xs text-ash mb-2">{year}</div>
			<div className="text-cream font-display text-lg">{company}</div>
			<div className="font-mono text-xs text-lime-400 mt-1">→ {outcome}</div>
		</div>
	);
}
