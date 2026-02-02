import { getBlogPosts } from "app/db/blog";
import { getBlogViewsCount } from "app/db/queries";
import Link from "next/link";
import { Suspense } from "react";
import ViewCounter from "./view-counter";

export const metadata = {
	title: "Blog",
	description:
		"Writing on AI infrastructure, SDK design, startup engineering, and building developer tools. Lessons from 4 acquired startups.",
};

export default function BlogPage() {
	const allBlogs = getBlogPosts();

	return (
		<section className="space-y-16">
			{/* Page header */}
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-px bg-lime-400" />
					<span className="font-mono text-xs text-lime-400 tracking-widest uppercase">
						Writing
					</span>
				</div>
				<h1 className="font-display text-4xl lg:text-6xl tracking-tight">
					Blog <span className="text-lime-400 text-glow-subtle">&</span>{" "}
					Thoughts
				</h1>
				<p className="text-stone text-lg max-w-2xl leading-relaxed">
					Observations on engineering, startups, and building products. Signal,
					not noise.
				</p>
			</div>

			{/* Blog posts */}
			<div className="relative">
				{/* Section header */}
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-xs text-ash">
						{String(allBlogs.length).padStart(2, "0")} ENTRIES
					</span>
					<div className="flex-1 h-px bg-elevated" />
				</div>

				{/* Posts list */}
				<div className="space-y-1">
					{allBlogs
						.sort((a, b) => {
							if (
								new Date(a.metadata.publishedAt) >
								new Date(b.metadata.publishedAt)
							) {
								return -1;
							}
							return 1;
						})
						.map((post, index) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="group relative block py-6 px-4 -mx-4 hover:bg-surface/30 transition-all duration-300"
							>
								{/* Index */}
								<div className="absolute left-4 top-6 font-mono text-xs text-ash opacity-50 group-hover:opacity-100 group-hover:text-lime-400 transition-all duration-300">
									{String(index + 1).padStart(2, "0")}
								</div>

								{/* Content */}
								<div className="ml-12 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
									<div className="space-y-1">
										<h2 className="font-display text-lg text-cream group-hover:text-lime-400 transition-colors duration-300">
											{post.metadata.title}
										</h2>
										{post.metadata.summary && (
											<p className="text-stone text-sm line-clamp-1 max-w-xl">
												{post.metadata.summary}
											</p>
										)}
									</div>

									<div className="flex items-center gap-6 shrink-0">
										<Suspense
											fallback={
												<span className="font-mono text-xs text-ash">—</span>
											}
										>
											<Views slug={post.slug} />
										</Suspense>
										<span className="font-mono text-xs text-ash">
											{new Date(post.metadata.publishedAt).toLocaleDateString(
												"en-US",
												{
													month: "short",
													year: "numeric",
												},
											)}
										</span>
									</div>
								</div>

								{/* Arrow indicator */}
								<div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<svg
										className="w-4 h-4 text-lime-400"
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

								{/* Bottom border */}
								<div className="absolute bottom-0 left-12 right-4 h-px bg-elevated group-hover:bg-lime-400/20 transition-colors duration-300" />
							</Link>
						))}
				</div>
			</div>
		</section>
	);
}

async function Views({ slug }: { slug: string }) {
	const views = await getBlogViewsCount();

	return (
		<span className="font-mono text-xs text-stone">
			<ViewCounter allViews={views} slug={slug} />
		</span>
	);
}
