import { Card } from "app/components/card";
import ProjectBrowserImage from "app/components/project-browser-image";

import { formatDate } from "app/lib/util";
import Link from "next/link";
import ProjectLogo from "./project-logo";

export function ProjectCard({ project, href }) {
	return (
		<Card key={project.slug}>
			<div className="flex flex-col h-full justify-between space-y-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						{project.metadata.logo && (
							<Link
								href={href}
								className="block transition-transform hover:scale-110"
							>
								<ProjectLogo
									src={project.metadata.logo}
									alt={project.metadata.title}
								/>
							</Link>
						)}
						<div className="bg-neutral-800 border border-neutral-700 text-neon px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider">
							{project.metadata.category}
						</div>
					</div>

					<div>
						<Link href={href} className="group">
							<h3 className="text-neutral-100 font-bold text-2xl tracking-tight group-hover:text-neon transition-colors">
								{project.metadata.title}
							</h3>
						</Link>
						<div className="mt-2 text-neutral-500 font-mono text-xs">
							{formatDate(project.metadata.publishedAt)}
						</div>
					</div>

					<Link href={href} className="block">
						<div className="text-sm leading-relaxed text-neutral-400">
							{project.metadata.summary}
						</div>
					</Link>
				</div>

				{project.metadata.image && (
					<Link href={href} className="block mt-auto pt-4">
						<div className="overflow-hidden rounded-lg border border-neutral-800 group-hover:border-neon/30 transition-all">
							<ProjectBrowserImage
								src={project.metadata.image}
								alt={project.metadata.title}
								href={project.metadata.link ?? "https://www.ericcampbell.dev"}
							/>
						</div>
					</Link>
				)}
			</div>
		</Card>
	);
}
