import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Free Developer Tools",
	description:
		"Free tools for framing product screenshots and generating iOS App Store assets.",
};

export default function ToolsPage() {
	return (
		<section className="space-y-16">
			{/* Page header */}
			<div>
				<h1 className="text-zinc-200 text-lg font-medium">Tools & Resources</h1>
				<p className="text-base text-zinc-400 mt-2 max-w-lg leading-relaxed">
					Free tools I built for product and App Store work.
				</p>
			</div>

			{/* Tools grid */}
			<div className="relative">
				{/* Section header */}
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-xs text-zinc-400">02 TOOLS</span>
					<div className="flex-1 h-px bg-zinc-800" />
				</div>

				{/* Grid */}
				<div className="grid gap-6">
					{/* Product Screenshot Tool */}
					<Link
						href="/tools/product-screenshot"
						className="group relative block bg-zinc-900/30 border border-zinc-800 hover:border-emerald-400/30 transition-all duration-300"
					>
						{/* Corner accent */}
						<div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-transparent group-hover:border-emerald-400/30 transition-colors duration-300" />

						<div className="flex flex-col md:flex-row">
							{/* Image */}
							<div className="md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/50 overflow-hidden">
								<Image
									src="/images/tools/product-screenshot.png"
									alt="Product Screenshot Tool"
									className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 768px) 100vw, 320px"
									width={1973}
									height={1234}
								/>
							</div>

							{/* Content */}
							<div className="flex-1 p-6 flex flex-col justify-between">
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<span className="font-mono text-xs text-zinc-400">01</span>
										<span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/20">
											FREE
										</span>
									</div>
									<h2 className="text-base font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
										Product Screenshot
									</h2>
									<p className="text-zinc-400 leading-relaxed">
										Frame product screenshots, customize the background, and
										export the result.
									</p>
								</div>

								<div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800/50">
									<span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
										Launch tool
									</span>
									<svg
										className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300"
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
						</div>

						{/* Bottom accent line */}
						<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</Link>

					{/* App Store Assets Tool */}
					<Link
						href="/tools/app-store-assets"
						className="group relative block bg-zinc-900/30 border border-zinc-800 hover:border-emerald-400/30 transition-all duration-300"
					>
						{/* Corner accent */}
						<div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-transparent group-hover:border-emerald-400/30 transition-colors duration-300" />

						<div className="flex flex-col md:flex-row">
							{/* Placeholder Image */}
							<div className="md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/50 bg-zinc-900 flex items-center justify-center h-48 md:h-auto">
								<div className="text-center">
									<div className="w-16 h-16 mx-auto mb-3 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center">
										<svg
											className="w-8 h-8 text-zinc-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<span className="font-mono text-xs text-zinc-400">PREVIEW</span>
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 p-6 flex flex-col justify-between">
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<span className="font-mono text-xs text-zinc-400">02</span>
										<span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/20">
											FREE
										</span>
									</div>
									<h2 className="text-base font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
										App Store Assets
									</h2>
									<p className="text-zinc-400 leading-relaxed">
										Generate App Store icons and screenshots at every required
										iOS size.
									</p>
								</div>

								<div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800/50">
									<span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
										Launch tool
									</span>
									<svg
										className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300"
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
						</div>

						{/* Bottom accent line */}
						<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</Link>
				</div>
			</div>
		</section>
	);
}
