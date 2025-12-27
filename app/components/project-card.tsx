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
			className="group relative block bg-surface/30 border border-elevated hover:border-lime-400/30 transition-all duration-500"
		>
			{/* Index number */}
			<div className="absolute -top-3 -left-3 w-8 h-8 bg-void border border-elevated flex items-center justify-center">
				<span className="font-mono text-xs text-ash">
					{String(index + 1).padStart(2, "0")}
				</span>
			</div>

			{/* Corner accent */}
			<div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-transparent group-hover:border-lime-400/30 transition-colors duration-300" />

			{/* Content */}
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="p-6 space-y-4">
					<div className="flex items-start justify-between gap-4">
						{project.metadata.logo && (
							<div className="w-12 h-12 bg-elevated rounded flex items-center justify-center overflow-hidden">
								<ProjectLogo
									src={project.metadata.logo}
									alt={project.metadata.title}
								/>
							</div>
						)}
						<span className="font-mono text-xs text-lime-400 bg-lime-400/10 px-2 py-1 border border-lime-400/20 uppercase tracking-wider">
							{project.metadata.category}
						</span>
					</div>

					<div>
						<h3 className="font-display text-xl text-cream group-hover:text-lime-400 transition-colors duration-300">
							{project.metadata.title}
						</h3>
						<p className="font-mono text-xs text-ash mt-1">
							{formatDate(project.metadata.publishedAt)}
						</p>
					</div>

					<p className="text-stone text-sm leading-relaxed line-clamp-3">
						{project.metadata.summary}
					</p>
				</div>

				{/* Image */}
				{project.metadata.image && (
					<div className="mt-auto border-t border-elevated/50">
						<div className="overflow-hidden">
							<ProjectBrowserImage
								src={project.metadata.image}
								alt={project.metadata.title}
								href={project.metadata.link ?? "https://www.ericcampbell.dev"}
							/>
						</div>
					</div>
				)}

				{/* Footer bar */}
				<div className="px-6 py-4 border-t border-elevated/50 flex items-center justify-between">
					<span className="font-mono text-xs text-stone group-hover:text-cream transition-colors">
						View project
					</span>
					<svg
						className="w-4 h-4 text-stone group-hover:text-lime-400 group-hover:translate-x-1 transition-all duration-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</div>
			</div>

			{/* Bottom accent line */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</Link>
	);
}
