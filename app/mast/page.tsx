import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "MAST",
	description:
		"The SQLite of agent memory. Embeddable storage engine with vector search, full-text, graph, and time-tiered compaction in a single file.",
	openGraph: {
		title: "MAST",
		description:
			"The SQLite of agent memory. Embeddable storage engine with vector search, full-text, graph, and time-tiered compaction in a single file.",
	},
};

export default function MastPage() {
	return (
		<section className="space-y-16">
			{/* Header */}
			<div>
				<span className="text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
					Open Source
				</span>
				<h1 className="text-zinc-100 text-lg font-medium mt-3">MAST</h1>
				<p className="text-sm text-zinc-400 mt-2 leading-relaxed">
					The SQLite of agent memory. An embeddable storage engine
					with vector search, full-text search, entity graph, and
					time-tiered compaction &mdash; in a single file.
				</p>
			</div>

			{/* The Problem */}
			<div className="space-y-4">
				<Label>The Problem</Label>
				<div className="text-sm text-zinc-400 leading-relaxed space-y-3">
					<p>
						Agent memory is fragmented. Vector databases for
						embeddings. Relational stores for metadata. Graph
						databases for entity relationships. Separate compaction
						logic bolted on top. Developers end up cobbling 3-4
						systems together just to give an agent persistent
						context.
					</p>
					<p>
						MAST unifies all of this in one embeddable library. No
						servers. No network hops. One file on disk. Open the
						file, store memories, recall them &mdash; with the full
						power of vector search, keyword matching, graph
						traversal, and temporal compaction available in every
						query.
					</p>
				</div>
			</div>

			{/* How It Works */}
			<div className="space-y-4">
				<Label>How It Works</Label>
				<p className="text-sm text-zinc-400 leading-relaxed">
					Four core operations. Each one atomic.
				</p>
				<div className="space-y-0 mt-2">
					<OperationRow
						name="STORE"
						description="Write a memory, generate its embedding, and update all indexes in one atomic transaction. Content, metadata, timestamps, and entity links all land together."
					/>
					<OperationRow
						name="RECALL"
						description="Hybrid query combining vector similarity, BM25 keyword matching, metadata filters, and tier blending. One call, one ranked result set."
					/>
					<OperationRow
						name="COMPACT"
						description="Promote memories up the tier hierarchy: raw events become summaries, summaries become patterns, patterns become core identity. Synthesis, not summarization."
					/>
					<OperationRow
						name="RELATE"
						description="First-class entity graph. Link memories to entities, entities to each other. Traverse relationships during recall to surface contextually relevant memories."
					/>
				</div>
			</div>

			{/* Architecture */}
			<div className="space-y-4">
				<Label>Architecture</Label>
				<p className="text-sm text-zinc-400 leading-relaxed">
					Three layers, bottom to top. Everything lives in a single
					file.
				</p>
				<div className="space-y-0 mt-2">
					<ArchRow
						name="Storage"
						description="Single-file ACID storage via redb. Copy-on-write B-trees for crash safety. No WAL, no journal, no compaction pauses. The file is the database."
					/>
					<ArchRow
						name="Indexing"
						description="HNSW vector index (usearch) for approximate nearest neighbors. BM25 full-text index with configurable tokenization. Inverted metadata index for fast filtered queries."
					/>
					<ArchRow
						name="Application"
						description="Pluggable Embedder and Compactor traits. Four memory tiers: raw, summary, pattern, core. Tier-aware recall blends across levels with configurable weighting."
					/>
				</div>
			</div>

			{/* Key Decisions */}
			<div className="space-y-4">
				<Label>Key Decisions</Label>
				<div className="space-y-0">
					<InsightRow
						title="Single file, not client-server"
						detail="Like SQLite, MAST is a library you link into your process. No daemon, no port, no connection string. Open a file path, get a database. Deploy anywhere you can write to disk."
					/>
					<InsightRow
						title="Compaction as synthesis, not summarization"
						detail="Summarization loses signal. Compaction in MAST promotes memories through tiers by extracting patterns and relationships, preserving the important structure while reducing volume."
					/>
					<InsightRow
						title="Zero vendor deps in core"
						detail="The core library depends only on redb and usearch. No cloud SDKs, no API keys, no runtime services. Embedders and compactors are pluggable traits &mdash; bring your own model or use the defaults."
					/>
					<InsightRow
						title="Graph as first-class citizen"
						detail="Entity relationships aren't an afterthought. Every memory can link to entities, and entity-entity edges carry typed relations. Graph traversal is integrated into the recall query planner."
					/>
					<InsightRow
						title="Hybrid search in one query"
						detail="Vector similarity and BM25 keyword matching run in the same query, with reciprocal rank fusion for scoring. No separate index calls, no manual result merging."
					/>
					<InsightRow
						title="Versioned serialization"
						detail="On-disk format is versioned from day one. Schema migrations are handled transparently on open. Old files always work with new code."
					/>
				</div>
			</div>

			{/* Bindings */}
			<div className="space-y-4">
				<Label>Bindings</Label>
				<div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400">
					<span>
						Rust{" "}
						<span className="text-zinc-500">(native)</span>
					</span>
					<span>
						Python{" "}
						<span className="text-zinc-500">(PyO3)</span>
					</span>
					<span>
						Node.js{" "}
						<span className="text-zinc-500">(napi-rs)</span>
					</span>
					<span>C FFI</span>
					<span>CLI</span>
				</div>
			</div>

			{/* Stack */}
			<div className="space-y-4">
				<Label>Stack</Label>
				<div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400">
					<span>Rust</span>
					<span>redb</span>
					<span>usearch</span>
					<span>PyO3</span>
					<span>napi-rs</span>
				</div>
			</div>

			{/* Links */}
			<div className="flex items-center gap-5 text-[10px] text-zinc-400 pt-4">
				<a
					href="https://github.com/ericc59/mast"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-300 transition-colors"
				>
					GitHub
				</a>
			</div>
		</section>
	);
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
			{children}
		</span>
	);
}

function OperationRow({
	name,
	description,
}: {
	name: string;
	description: string;
}) {
	return (
		<div className="py-3 border-b border-zinc-800 group">
			<div className="flex items-baseline gap-3">
				<span className="text-xs text-zinc-300 font-mono shrink-0 group-hover:text-zinc-100 transition-colors">
					{name}
				</span>
			</div>
			<p className="text-xs text-zinc-400 mt-1 leading-relaxed">
				{description}
			</p>
		</div>
	);
}

function ArchRow({
	name,
	description,
}: {
	name: string;
	description: string;
}) {
	return (
		<div className="py-3 border-b border-zinc-800 group">
			<span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
				{name}
			</span>
			<p className="text-xs text-zinc-400 mt-1 leading-relaxed">
				{description}
			</p>
		</div>
	);
}

function InsightRow({
	title,
	detail,
}: {
	title: string;
	detail: string;
}) {
	return (
		<div className="py-3 border-b border-zinc-800">
			<div className="flex items-baseline gap-2">
				<span className="text-[10px] shrink-0 text-emerald-400/60">
					+
				</span>
				<div>
					<span className="text-sm text-zinc-300">{title}</span>
					<p className="text-xs text-zinc-400 mt-1 leading-relaxed">
						{detail}
					</p>
				</div>
			</div>
		</div>
	);
}
