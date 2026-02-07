import Link from "next/link";

export default function NotFound() {
	return (
		<section className="min-h-[60vh] flex items-center justify-center">
			<div className="text-center space-y-10">
				{/* Error code */}
				<div className="relative">
					<span className="font-display text-[10rem] lg:text-[14rem] text-faint leading-none italic">
						404
					</span>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="font-mono text-[10px] text-copper tracking-[0.3em] uppercase">
							Signal Lost
						</span>
					</div>
				</div>

				{/* Message */}
				<div className="space-y-3">
					<h1 className="font-display text-2xl text-cream">
						This page doesn't exist
					</h1>
					<p className="text-ash max-w-md mx-auto text-sm">
						The coordinates you're looking for aren't in our system.
					</p>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-center gap-4">
					<Link
						href="/"
						className="
							px-5 py-2.5
							font-mono text-xs text-void
							bg-copper hover:bg-copper-light
							transition-colors duration-300
						"
					>
						Return Home
					</Link>
					<a
						href="mailto:eric@campbell.ventures"
						className="
							px-5 py-2.5
							font-mono text-xs text-ash
							border border-faint
							hover:border-copper/30 hover:text-cream
							transition-all duration-300
						"
					>
						Report Issue
					</a>
				</div>
			</div>
		</section>
	);
}
