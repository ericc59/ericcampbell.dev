import ProjectBrowserImage from "app/components/project-browser-image";
import { formatDate } from "app/lib/util";
import Link from "next/link";
import ProjectLogo from "./project-logo";

export function ProjectCard({
	project,
	href,
	index = 0,
}: {
	project: any;
	href: string;
	index?: number;
}) {
	return (
		<Link
			href={href}
			className="group block border-b border-zinc-900 hover:border-zinc-800 pb-4 mb-0 transition-colors"
		>
			<div className="flex items-start gap-3 py-3">
				{project.metadata.logo && (
					<div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
						<ProjectLogo
							src={project.metadata.logo}
							alt={project.metadata.title}
						/>
					</div>
				)}

				<div className="flex-1 min-w-0">
					<div className="flex items-baseline justify-between gap-2">
						<h3 className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
							{project.metadata.title}
						</h3>
						<span className="text-[9px] text-zinc-700 uppercase tracking-wider shrink-0">
							{project.metadata.category}
						</span>
					</div>

					<p className="text-xs text-zinc-700 mt-0.5">
						{formatDate(project.metadata.publishedAt)}
					</p>

					<p className="text-xs text-zinc-600 leading-relaxed mt-2 line-clamp-2">
						{project.metadata.summary}
					</p>
				</div>
			</div>

			{project.metadata.image && (
				<div className="mt-2 overflow-hidden border border-zinc-900 rounded-sm">
					<ProjectBrowserImage
						src={project.metadata.image}
						alt={project.metadata.title}
						href={project.metadata.link ?? "https://www.ericcampbell.dev"}
					/>
				</div>
			)}
		</Link>
	);
}
