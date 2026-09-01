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
						<h2 className="text-base font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
							{project.metadata.title}
						</h2>
						<span className="text-[10px] text-zinc-400 uppercase tracking-wider shrink-0">
							{project.metadata.category}
						</span>
					</div>

					<p className="text-xs text-zinc-400 mt-1">
						{formatDate(project.metadata.publishedAt)}
					</p>

					<p className="text-sm text-zinc-400 leading-relaxed mt-2 line-clamp-2">
						{project.metadata.summary}
					</p>
				</div>
			</div>

			{project.metadata.image && (
				<div className="mt-3 overflow-hidden border border-zinc-900 rounded-sm opacity-75 group-hover:opacity-100 transition-opacity">
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
