import { ProjectCard } from "app/components/project-card";
import { getProjects } from "app/db/project";

export const metadata = {
	title: "Projects",
	description:
		"Side projects and experiments: AI apps, developer tools, and startup MVPs.",
};

export default function ProjectPage() {
	const allProjects = getProjects().sort((a, b) => {
		if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt))
			return -1;
		return 1;
	});

	return (
		<section className="space-y-12">
			<div>
				<span className="text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
					Portfolio
				</span>
				<h1 className="text-zinc-200 text-lg font-medium mt-3">
					Projects & Experiments
				</h1>
				<p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">
					Things I've made trying to put a dent in the universe.
				</p>
			</div>

			<div>
				<div className="text-[10px] text-zinc-700 mb-6">
					{String(allProjects.length).padStart(2, "0")} projects
				</div>
				<div className="grid grid-cols-1 gap-4">
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
