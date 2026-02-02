import { ProjectCard } from "app/components/project-card";
import { getProjects } from "app/db/project";

export const metadata = {
	title: "Projects",
	description:
		"Side projects and experiments: AI apps, developer tools, and startup MVPs. Built with Next.js, React, and modern AI infrastructure.",
};

export default function ProjectPage() {
	const allProjects = getProjects().sort((a, b) => {
		if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
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
						Portfolio
					</span>
				</div>
				<h1 className="font-display text-4xl lg:text-6xl tracking-tight">
					Projects <span className="text-lime-400 text-glow-subtle">&</span>{" "}
					Experiments
				</h1>
				<p className="text-stone text-lg max-w-2xl leading-relaxed">
					Things I've made trying to put a dent in the universe. Some shipped,
					some failed, all learned from.
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
							key={project.slug}
							project={project}
							href={`/projects/${project.slug}`}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
