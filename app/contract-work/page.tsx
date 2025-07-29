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
		<section className="space-y-8">
			<div className="space-y-2">
				<h1 className="font-bold text-2xl tracking-tighter">
					contract work i've done for clients
				</h1>
				<p className="prose prose-neutral dark:prose-invert">
					Looking for some high-quality contract work?{" "}
					<a
						href="mailto:ericc@campbell.ventures?subject=I've got a project for you"
						className="text-green-500 font-black"
					>
						Hire me
					</a>{" "}
					for a project.
				</p>
			</div>

			<div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{allProjects.map((project) => (
						<ProjectCard
							key={project?.slug}
							project={project}
							href={`/contract-work/${project?.slug}`}
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
