import Link from "next/link";

export default function NotFound() {
	return (
		<section className="min-h-[60vh] flex items-center justify-center">
			<div className="text-center space-y-8">
				{/* Error code */}
				<div className="relative">
					<span className="font-mono text-[12rem] lg:text-[16rem] font-light text-elevated leading-none">
						404
					</span>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="font-mono text-sm text-amber tracking-widest uppercase animate-pulse">
							Signal Lost
						</span>
					</div>
				</div>

				{/* Message */}
				<div className="space-y-4">
					<h1 className="font-display text-2xl text-cream">
						This page doesn't exist
					</h1>
					<p className="text-stone max-w-md mx-auto">
						The coordinates you're looking for aren't in our system. Perhaps the
						signal was interrupted.
					</p>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-center gap-4">
					<Link
						href="/"
						className="
							px-6 py-3
							bg-amber text-void font-mono text-sm font-medium
							border border-amber
							hover:bg-transparent hover:text-amber
							transition-all duration-300
						"
					>
						Return Home
					</Link>
					<a
						href="mailto:eric@campbell.ventures"
						className="
							px-6 py-3
							font-mono text-sm text-stone
							border border-elevated
							hover:border-amber/50 hover:text-cream
							transition-all duration-300
						"
					>
						Report Issue
					</a>
				</div>

				{/* Decorative element */}
				<div className="pt-8">
					<div className="inline-flex items-center gap-2 text-ash">
						<div className="w-2 h-2 rounded-full bg-alert animate-pulse" />
						<span className="font-mono text-xs">ERROR_PAGE_NOT_FOUND</span>
					</div>
				</div>
			</div>
		</section>
	);
}
