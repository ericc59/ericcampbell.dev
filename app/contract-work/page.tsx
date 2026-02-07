import { ProjectCard } from "app/components/project-card";
import { getContracts } from "app/db/contract";

export const metadata = {
	title: "Contract Work",
	description:
		"Contract engineering projects: full-stack development, AI integrations, and startup MVPs for funded companies.",
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
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<span className="font-mono text-[10px] text-copper uppercase tracking-[0.2em]">
						Client Work
					</span>
					<div className="flex-1 h-px bg-gradient-to-r from-copper/20 to-transparent" />
				</div>
				<h1 className="font-display text-4xl lg:text-5xl tracking-tight">
					Contract Projects
				</h1>
				<p className="text-sand text-lg max-w-2xl leading-relaxed">
					High-quality contract work I've done for clients. Looking for expert
					engineering?{" "}
					<a
						href="mailto:ericc@campbell.ventures?subject=I've got a project for you"
						className="text-copper border-b border-copper/30 hover:border-copper transition-colors"
					>
						Let's talk
					</a>
					.
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
