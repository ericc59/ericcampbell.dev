import Link from "next/link";

export default function NotFound() {
	return (
		<section className="min-h-[60vh] flex items-center">
			<div className="space-y-6">
				<div>
					<span className="text-[10px] text-zinc-700">404</span>
					<h1 className="text-zinc-200 text-lg font-medium mt-1">
						Page not found
					</h1>
				</div>
				<p className="text-sm text-zinc-600 max-w-sm">
					The page you're looking for doesn't exist.
				</p>
				<Link
					href="/"
					className="inline-block text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
				>
					← back home
				</Link>
			</div>
		</section>
	);
}
