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
			className="group relative block border border-faint/30 hover:border-copper/15 transition-all duration-500"
		>
			{/* Index */}
			<div className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-void border border-faint/50 flex items-center justify-center">
				<span className="font-mono text-[9px] text-ash">
					{String(index + 1).padStart(2, "0")}
				</span>
			</div>

			{/* Content */}
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="p-5 space-y-3">
					<div className="flex items-start justify-between gap-3">
						{project.metadata.logo && (
							<div className="w-10 h-10 bg-elevated rounded flex items-center justify-center overflow-hidden">
								<ProjectLogo
									src={project.metadata.logo}
									alt={project.metadata.title}
								/>
							</div>
						)}
						<span className="font-mono text-[9px] text-copper bg-copper-muted px-1.5 py-0.5 uppercase tracking-widest">
							{project.metadata.category}
						</span>
					</div>

					<div>
						<h3 className="font-display text-xl text-cream group-hover:text-copper transition-colors duration-300">
							{project.metadata.title}
						</h3>
						<p className="font-mono text-[10px] text-ash mt-1">
							{formatDate(project.metadata.publishedAt)}
						</p>
					</div>

					<p className="text-sand text-sm leading-relaxed line-clamp-3">
						{project.metadata.summary}
					</p>
				</div>

				{/* Image */}
				{project.metadata.image && (
					<div className="mt-auto border-t border-faint/30">
						<div className="overflow-hidden">
							<ProjectBrowserImage
								src={project.metadata.image}
								alt={project.metadata.title}
								href={project.metadata.link ?? "https://www.ericcampbell.dev"}
							/>
						</div>
					</div>
				)}

				{/* Footer */}
				<div className="px-5 py-3 border-t border-faint/30 flex items-center justify-between">
					<span className="font-mono text-[10px] text-ash group-hover:text-cream transition-colors">
						View project
					</span>
					<svg
						className="w-3.5 h-3.5 text-ash group-hover:text-copper group-hover:translate-x-0.5 transition-all duration-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-label="View project"
						role="img"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</div>
			</div>
		</Link>
	);
}
