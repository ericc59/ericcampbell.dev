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
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<span className="font-mono text-[10px] text-copper uppercase tracking-[0.2em]">
						Writing
					</span>
					<div className="flex-1 h-px bg-gradient-to-r from-copper/20 to-transparent" />
				</div>
				<h1 className="font-display text-4xl lg:text-5xl tracking-tight">
					Blog & Thoughts
				</h1>
				<p className="text-sand text-lg max-w-2xl leading-relaxed">
					Observations on engineering, startups, and building products. Signal,
					not noise.
				</p>
			</div>

			<div className="relative">
				<div className="flex items-center gap-4 mb-8">
					<span className="font-mono text-[10px] text-ash">
						{String(allBlogs.length).padStart(2, "0")} ENTRIES
					</span>
					<div className="flex-1 h-px bg-faint/50" />
				</div>

				<div className="space-y-0">
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
								className="group relative flex items-start justify-between py-5 border-b border-faint/50 hover:border-copper/20 transition-colors duration-300"
							>
								{/* Index */}
								<div className="font-mono text-[10px] text-ash opacity-40 group-hover:opacity-100 group-hover:text-copper transition-all duration-300 w-6 shrink-0 pt-0.5">
									{String(index + 1).padStart(2, "0")}
								</div>

								{/* Content */}
								<div className="flex-1 ml-4 space-y-1">
									<h2 className="font-display text-lg text-cream group-hover:text-copper transition-colors duration-300">
										{post.metadata.title}
									</h2>
									{post.metadata.summary && (
										<p className="text-ash text-sm line-clamp-1 max-w-xl">
											{post.metadata.summary}
										</p>
									)}
								</div>

								{/* Meta */}
								<div className="flex items-center gap-4 shrink-0 ml-4 pt-1">
									<Suspense
										fallback={
											<span className="font-mono text-[10px] text-ash">
												&mdash;
											</span>
										}
									>
										<Views slug={post.slug} />
									</Suspense>
									<span className="font-mono text-[10px] text-ash">
										{new Date(post.metadata.publishedAt).toLocaleDateString(
											"en-US",
											{
												month: "short",
												year: "numeric",
											},
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
		<span className="font-mono text-[10px] text-ash">
			<ViewCounter allViews={views} slug={slug} />
		</span>
	);
}
