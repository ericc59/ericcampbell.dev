import { ProjectCard } from "app/components/project-card";
import { getContracts } from "app/db/contract";

export const metadata = {
	title: "Contract Work",
	description: "View contract work I've done",
};

export default function ProjectPage() {
	const allProjects = getContracts().sort((a, b) => {
		if (
			new Date(a?.metadata.publishedAt ?? "") >
			new Date(b?.metadata.publishedAt ?? "")
		) {
			return -1;
		}
		return 1;
	});

	return (
		<section className="space-y-16">
			{/* Page header */}
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-px bg-lime-400" />
					<span className="font-mono text-xs text-lime-400 tracking-widest uppercase">
						Client Work
					</span>
				</div>
				<h1 className="font-display text-4xl lg:text-6xl tracking-tight">
					Contract{" "}
					<span className="text-lime-400 text-glow-subtle">Projects</span>
				</h1>
				<p className="text-stone text-lg max-w-2xl leading-relaxed">
					High-quality contract work I've done for clients. Looking for expert
					engineering?{" "}
					<a
						href="mailto:ericc@campbell.ventures?subject=I've got a project for you"
						className="text-lime-400 border-b border-lime-400/30 hover:border-lime-400 transition-colors"
					>
						Let's talk
					</a>
					.
				</p>
			</div>

			{/* Projects grid */}
			<div className="relative">
				{/* Section header */}
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-xs text-ash">
						{String(allProjects.length).padStart(2, "0")} PROJECTS
					</span>
					<div className="flex-1 h-px bg-elevated" />
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					{allProjects.map((project, index) => (
						<ProjectCard
							key={project?.slug}
							project={project}
							href={`/contract-work/${project?.slug}`}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
