import Image from "next/image";
import Link from "next/link";

export default function ToolsPage() {
	return (
		<section className="space-y-16">
			{/* Page header */}
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-px bg-amber" />
					<span className="font-mono text-xs text-amber tracking-widest uppercase">
						Utilities
					</span>
				</div>
				<h1 className="font-display text-4xl lg:text-6xl tracking-tight">
					Tools <span className="text-amber text-glow-subtle">&</span> Resources
				</h1>
				<p className="text-stone text-lg max-w-2xl leading-relaxed">
					Free tools I've built to make life easier. Use them for your own
					projects.
				</p>
			</div>

			{/* Tools grid */}
			<div className="relative">
				{/* Section header */}
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-xs text-ash">02 TOOLS</span>
					<div className="flex-1 h-px bg-elevated" />
				</div>

				{/* Grid */}
				<div className="grid gap-6">
					{/* Product Screenshot Tool */}
					<Link
						href="/tools/product-screenshot"
						className="group relative block bg-surface/30 border border-elevated hover:border-amber/30 transition-all duration-300"
					>
						{/* Corner accent */}
						<div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-transparent group-hover:border-amber/30 transition-colors duration-300" />

						<div className="flex flex-col md:flex-row">
							{/* Image */}
							<div className="md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-elevated/50 overflow-hidden">
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
										<span className="font-mono text-xs text-ash">01</span>
										<span className="font-mono text-xs text-amber bg-amber/10 px-2 py-0.5 border border-amber/20">
											FREE
										</span>
									</div>
									<h2 className="font-display text-2xl text-cream group-hover:text-amber transition-colors">
										Product Screenshot
									</h2>
									<p className="text-stone leading-relaxed">
										Create beautiful product screenshots with customizable
										backgrounds, device frames, and export options.
									</p>
								</div>

								<div className="flex items-center justify-between mt-6 pt-4 border-t border-elevated/50">
									<span className="font-mono text-xs text-stone group-hover:text-cream transition-colors">
										Launch tool
									</span>
									<svg
										className="w-4 h-4 text-stone group-hover:text-amber group-hover:translate-x-1 transition-all duration-300"
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
						<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</Link>

					{/* App Store Assets Tool */}
					<Link
						href="/tools/app-store-assets"
						className="group relative block bg-surface/30 border border-elevated hover:border-amber/30 transition-all duration-300"
					>
						{/* Corner accent */}
						<div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-transparent group-hover:border-amber/30 transition-colors duration-300" />

						<div className="flex flex-col md:flex-row">
							{/* Placeholder Image */}
							<div className="md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-elevated/50 bg-surface flex items-center justify-center h-48 md:h-auto">
								<div className="text-center">
									<div className="w-16 h-16 mx-auto mb-3 border-2 border-dashed border-elevated rounded-lg flex items-center justify-center">
										<svg
											className="w-8 h-8 text-ash"
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
									<span className="font-mono text-xs text-ash">PREVIEW</span>
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 p-6 flex flex-col justify-between">
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<span className="font-mono text-xs text-ash">02</span>
										<span className="font-mono text-xs text-amber bg-amber/10 px-2 py-0.5 border border-amber/20">
											FREE
										</span>
									</div>
									<h2 className="font-display text-2xl text-cream group-hover:text-amber transition-colors">
										App Store Assets
									</h2>
									<p className="text-stone leading-relaxed">
										Generate all required iOS App Store assets including icons
										and screenshots in every required size.
									</p>
								</div>

								<div className="flex items-center justify-between mt-6 pt-4 border-t border-elevated/50">
									<span className="font-mono text-xs text-stone group-hover:text-cream transition-colors">
										Launch tool
									</span>
									<svg
										className="w-4 h-4 text-stone group-hover:text-amber group-hover:translate-x-1 transition-all duration-300"
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
						<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</Link>
				</div>
			</div>
		</section>
	);
}
