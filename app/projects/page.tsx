import { ProjectCard } from "app/components/project-card";
import { getProjects } from "app/db/project";

export const metadata = {
	title: "Projects",
	description: "View my projects",
};

export default function ProjectPage() {
	const allProjects = getProjects().sort((a, b) => {
		if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
			return -1;
		}
		return 1;
	});

	return (
		<section className="space-y-12">
			<div className="space-y-4">
				<h1 className="font-black text-4xl lg:text-5xl tracking-tighter text-white">
					<span className="text-neon">Projects</span> & Experiments
				</h1>
				<p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
					Things I've made trying to put a dent in the universe. Some shipped,
					some failed, all learned from.
				</p>
			</div>

			<div>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					{allProjects.map((project) => (
						<ProjectCard
							key={project.slug}
							project={project}
							href={`/projects/${project.slug}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

// async function Views({ slug }: { slug: string }) {
//   let views = await getProjectViewsCount();

//   return <ViewCounter allViews={views} slug={slug} />;
// }
