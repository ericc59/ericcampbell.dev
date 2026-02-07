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
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<span className="font-mono text-[10px] text-copper uppercase tracking-[0.2em]">
						Portfolio
					</span>
					<div className="flex-1 h-px bg-gradient-to-r from-copper/20 to-transparent" />
				</div>
				<h1 className="font-display text-4xl lg:text-5xl tracking-tight">
					Projects & Experiments
				</h1>
				<p className="text-sand text-lg max-w-2xl leading-relaxed">
					Things I've made trying to put a dent in the universe. Some shipped,
					some failed, all learned from.
				</p>
			</div>

			<div className="relative">
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-[10px] text-ash">
						{String(allProjects.length).padStart(2, "0")} PROJECTS
					</span>
					<div className="flex-1 h-px bg-faint/50" />
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
