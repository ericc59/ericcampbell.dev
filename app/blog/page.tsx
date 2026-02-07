import { getBlogPosts } from "app/db/blog";
import { getBlogViewsCount } from "app/db/queries";
import Link from "next/link";
import { Suspense } from "react";
import ViewCounter from "./view-counter";

export const metadata = {
	title: "Blog",
	description:
		"Writing on AI infrastructure, SDK design, startup engineering, and building developer tools.",
};

export default function BlogPage() {
	const allBlogs = getBlogPosts();

	return (
		<section className="space-y-12">
			<div>
				<span className="text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
					Writing
				</span>
				<h1 className="text-zinc-200 text-lg font-medium mt-3">
					Blog & Thoughts
				</h1>
				<p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">
					Signal, not noise.
				</p>
			</div>

			<div>
				<div className="text-[10px] text-zinc-700 mb-6">
					{String(allBlogs.length).padStart(2, "0")} entries
				</div>
				<div className="space-y-0">
					{allBlogs
						.sort((a, b) => {
							if (
								new Date(a.metadata.publishedAt) >
								new Date(b.metadata.publishedAt)
							)
								return -1;
							return 1;
						})
						.map((post, index) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="group flex items-start justify-between py-3 border-b border-zinc-900 hover:border-zinc-800 transition-colors"
							>
								<div className="flex items-baseline gap-3">
									<span className="text-[10px] text-zinc-800 group-hover:text-zinc-600 transition-colors w-4 shrink-0">
										{String(index + 1).padStart(2, "0")}
									</span>
									<div>
										<span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
											{post.metadata.title}
										</span>
										{post.metadata.summary && (
											<p className="text-xs text-zinc-700 mt-0.5 line-clamp-1 max-w-sm">
												{post.metadata.summary}
											</p>
										)}
									</div>
								</div>
								<div className="flex items-center gap-4 shrink-0 ml-4 pt-0.5">
									<Suspense
										fallback={
											<span className="text-[10px] text-zinc-800">&mdash;</span>
										}
									>
										<Views slug={post.slug} />
									</Suspense>
									<span className="text-[10px] text-zinc-700">
										{new Date(post.metadata.publishedAt).toLocaleDateString(
											"en-US",
											{ month: "short", year: "2-digit" },
										)}
									</span>
								</div>
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
		<span className="text-[10px] text-zinc-700">
			<ViewCounter allViews={views} slug={slug} />
		</span>
	);
}
