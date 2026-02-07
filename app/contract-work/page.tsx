import { ProjectCard } from "app/components/project-card";
import { getContracts } from "app/db/contract";

export const metadata = {
	title: "Contract Work",
	description:
		"Contract engineering projects: full-stack development, AI integrations, and startup MVPs.",
};

export default function ProjectPage() {
	const allProjects = getContracts().sort((a, b) => {
		if (
			new Date(a?.metadata.publishedAt ?? "") >
			new Date(b?.metadata.publishedAt ?? "")
		)
			return -1;
		return 1;
	});

	return (
		<section className="space-y-12">
			<div>
				<span className="text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
					Client Work
				</span>
				<h1 className="text-zinc-200 text-lg font-medium mt-3">
					Contract Projects
				</h1>
				<p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">
					Engineering work for clients.{" "}
					<a
						href="mailto:ericc@campbell.ventures?subject=I've got a project for you"
						className="text-zinc-400 hover:text-zinc-200 transition-colors"
					>
						Let's talk
					</a>
					.
				</p>
			</div>

			<div>
				<div className="text-[10px] text-zinc-700 mb-6">
					{String(allProjects.length).padStart(2, "0")} projects
				</div>
				<div className="grid grid-cols-1 gap-4">
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
