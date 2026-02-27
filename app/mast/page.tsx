import type { Metadata } from "next";
import { highlight } from "sugar-high";

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

			{/* Install */}
			<div className="space-y-4">
				<Label>Install</Label>
				<div className="space-y-3">
					<CodeBlock
						lang="rust"
						code={`# Cargo.toml
[dependencies]
mast-core = { git = "https://github.com/ericc59/mast" }
mast-embed-openai = { git = "https://github.com/ericc59/mast" }  # optional
mast-embed-local = { git = "https://github.com/ericc59/mast" }   # optional, on-device`}
					/>
					<CodeBlock
						lang="python"
						code={`pip install maturin
git clone https://github.com/ericc59/mast && cd mast/crates/mast-py
maturin develop --release`}
					/>
					<CodeBlock
						lang="node.js"
						code={`git clone https://github.com/ericc59/mast && cd mast/crates/mast-node
npm install && npm run build`}
					/>
					<CodeBlock
						lang="cli"
						code={`cargo install --git https://github.com/ericc59/mast mast-cli`}
					/>
				</div>
			</div>

			{/* Usage — Rust */}
			<div className="space-y-4">
				<Label>Usage</Label>
				<CodeBlock
					lang="rust"
					code={`use mast_core::{Mast, config::MastConfig, types::*};
use mast_embed_openai::OpenAIEmbedder;

let mut mast = Mast::open(MastConfig::default().with_db_path("agent.mast"))?;
let embedder = OpenAIEmbedder::new("text-embedding-3-small");

// store a memory
let mem = mast.store(StoreRequest {
    collection: "user:alice".into(),
    content: "Alice prefers dark mode and monospace fonts".into(),
    metadata: HashMap::from([("source".into(), "onboarding".into())]),
    tier: Tier::Active,
    ..Default::default()
}, &embedder).await?;

// vector recall
let results = mast.recall(RecallRequest {
    collection: "user:alice".into(),
    query: Some("ui preferences".into()),
    limit: 5,
    ..Default::default()
}, &embedder).await?;

// hybrid recall — vector + BM25 full-text
let results = mast.recall(RecallRequest {
    collection: "user:alice".into(),
    query: Some("ui preferences".into()),
    text_query: Some("dark mode".into()),
    search_mode: SearchMode::Hybrid { vector_weight: 0.6, text_weight: 0.4 },
    filter: Some(MetadataFilter::Eq("source".into(), "onboarding".into())),
    limit: 10,
    ..Default::default()
}, &embedder).await?;

// entity graph
mast.relate(RelateRequest {
    collection: "user:alice".into(),
    source: "alice".into(),
    target: "dark_mode".into(),
    relation: "prefers".into(),
    weight: 0.9,
})?;

let edges = mast.traverse(TraverseRequest {
    collection: "user:alice".into(),
    start: "alice".into(),
    max_depth: 3,
    ..Default::default()
})?;

mast.close()?;`}
				/>
				<CodeBlock
					lang="python"
					code={`from mast import Mast

db = Mast("agent.mast")

# store
memory = db.store("user:alice", "Alice prefers dark mode", embedder,
                   metadata={"source": "onboarding"}, tier="active")

# vector recall
results = db.recall("user:alice", embedder, query="ui preferences", limit=5)

# hybrid recall
results = db.recall("user:alice", embedder,
                    query="ui preferences", text_query="dark mode",
                    search_mode="hybrid")

# graph
db.relate("user:alice", "alice", "dark_mode", "prefers", weight=0.9)
edges = db.traverse("user:alice", "alice", max_depth=3)

# snapshots
db.snapshot("user:alice", "backup.jsonl")
db.restore("backup.jsonl", merge=True)

db.close()`}
				/>
				<CodeBlock
					lang="node.js"
					code={`const { MastDb } = require('mast-memory');

const db = new MastDb('agent.mast');

// store
const mem = db.store('user:alice', 'Alice prefers dark mode', embed, 384,
                     { source: 'onboarding' }, 'active');

// recall
const results = db.recall('user:alice', embed, 384, 'ui preferences',
                          null, 'vector', 5);

// hybrid recall
const hybrid = db.recall('user:alice', embed, 384, 'ui preferences',
                         'dark mode', 'hybrid', 10);

// graph
db.relate('user:alice', 'alice', 'dark_mode', 'prefers', 0.9);
const edges = db.traverse('user:alice', 'alice', 3);

db.close();`}
				/>
			</div>

			{/* CLI */}
			<div className="space-y-4">
				<Label>CLI</Label>
				<CodeBlock
					lang="bash"
					code={`# store a memory
mast store --db agent.mast -c "user:alice" \\
  --content "Alice prefers dark mode" \\
  --metadata source=onboarding --tier active

# vector recall
mast recall --db agent.mast -c "user:alice" \\
  --query-vec 0.1,0.2,0.3 --limit 5

# full-text search
mast recall --db agent.mast -c "user:alice" \\
  --text-query "dark mode" --search-mode fulltext

# hybrid search
mast recall --db agent.mast -c "user:alice" \\
  --query "preferences" --text-query "dark mode" \\
  --search-mode hybrid --limit 10

# entity graph
mast relate --db agent.mast -c "user:alice" \\
  --source alice --target dark_mode --relation prefers --weight 0.9
mast traverse --db agent.mast -c "user:alice" \\
  --start alice --max-depth 3

# collection management
mast info --db agent.mast
mast list --db agent.mast -c "user:alice"
mast vacuum --db agent.mast -c "user:alice"

# snapshot & restore
mast snapshot --db agent.mast -c "user:alice" --output backup.jsonl
mast restore --db agent.mast --input backup.jsonl --merge`}
				/>
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
						description="HNSW vector index (usearch) for approximate nearest neighbors. BM25 full-text index with Porter2 stemming. Inverted metadata index for fast filtered queries."
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
						detail="Vector similarity and BM25 keyword matching run in the same query, with min-max normalization and configurable weighting. No separate index calls, no manual result merging."
					/>
					<InsightRow
						title="Versioned serialization"
						detail="On-disk format is versioned from day one. Schema migrations are handled transparently on open. Old files always work with new code."
					/>
				</div>
			</div>

			{/* Embedder Trait */}
			<div className="space-y-4">
				<Label>Pluggable Embedders</Label>
				<p className="text-sm text-zinc-400 leading-relaxed">
					Core has zero vendor dependencies. Bring any embedding
					provider via the Embedder trait.
				</p>
				<CodeBlock
					lang="rust"
					code={`#[async_trait]
pub trait Embedder: Send + Sync {
    async fn embed(&self, text: &str) -> Result<Vec<f32>, MastError>;
    async fn embed_batch(&self, texts: &[String]) -> Result<Vec<Vec<f32>>, MastError>;
    fn dimensions(&self) -> usize;
}`}
				/>
				<div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400 mt-2">
					<span>
						OpenAI{" "}
						<span className="text-zinc-500">
							text-embedding-3-small
						</span>
					</span>
					<span>
						Voyage AI{" "}
						<span className="text-zinc-500">
							voyage-3
						</span>
					</span>
					<span>
						Local{" "}
						<span className="text-zinc-500">
							AllMiniLM-L6-v2, 384d, ~23MB
						</span>
					</span>
					<span>
						Mock{" "}
						<span className="text-zinc-500">
							deterministic, for tests
						</span>
					</span>
				</div>
			</div>

			{/* Performance */}
			<div className="space-y-4">
				<Label>Benchmarks</Label>
				<p className="text-sm text-zinc-400 leading-relaxed">
					13 criterion benchmarks across store, recall, delete,
					vacuum, and compaction. Run with{" "}
					<code className="text-xs bg-zinc-800/60 px-1.5 py-0.5 text-zinc-300">
						cargo bench -p mast-core
					</code>
				</p>
				<div className="space-y-0 mt-2">
					<BenchRow
						name="store_single"
						params="128d, 768d, 1536d"
						description="Single memory store with embedding generation and index update"
					/>
					<BenchRow
						name="store_batch"
						params="100&times;128d, 1000&times;128d, 100&times;768d, 1000&times;768d"
						description="Batch store — single embed_batch call, one transaction"
					/>
					<BenchRow
						name="recall_vector"
						params="100@128d, 1000@128d, 100@768d, 1000@768d"
						description="Vector similarity search over HNSW index"
					/>
					<BenchRow
						name="recall_filtered"
						params="1000@128d"
						description="Vector search with metadata filter predicate"
					/>
					<BenchRow
						name="recall_bm25"
						params="1000 memories"
						description="Full-text BM25 keyword search with Porter2 stemming"
					/>
					<BenchRow
						name="recall_hybrid"
						params="1000@128d"
						description="Combined vector + BM25 with min-max normalization"
					/>
					<BenchRow
						name="delete_single"
						params="1000 baseline"
						description="Single memory deletion with index cleanup"
					/>
					<BenchRow
						name="vacuum"
						params="500 expired"
						description="Bulk TTL expiration cleanup"
					/>
					<BenchRow
						name="compact"
						params="100 memories"
						description="Tier promotion with synthesis and re-embedding"
					/>
				</div>
			</div>

			{/* Tests */}
			<div className="space-y-4">
				<Label>Test Coverage</Label>
				<div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
					<span className="text-zinc-400">
						Core unit{" "}
						<span className="text-zinc-500">109</span>
					</span>
					<span className="text-zinc-400">
						Integration{" "}
						<span className="text-zinc-500">64</span>
					</span>
					<span className="text-zinc-400">
						Embedder{" "}
						<span className="text-zinc-500">16</span>
					</span>
					<span className="text-zinc-400">
						CLI{" "}
						<span className="text-zinc-500">24</span>
					</span>
					<span className="text-zinc-400">
						FFI{" "}
						<span className="text-zinc-500">7</span>
					</span>
					<span className="text-zinc-400">
						Total{" "}
						<span className="text-zinc-300">220+</span>
					</span>
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
					<span>fastembed</span>
					<span>PyO3</span>
					<span>napi-rs</span>
					<span>cbindgen</span>
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

function CodeBlock({ code, lang }: { code: string; lang: string }) {
	const html = highlight(code);
	return (
		<div>
			<span className="text-[10px] text-zinc-500 uppercase tracking-[0.15em]">
				{lang}
			</span>
			<pre className="bg-[#0c0c0e] border border-zinc-800 overflow-x-auto p-4 mt-1 text-[13px] leading-relaxed">
				<code dangerouslySetInnerHTML={{ __html: html }} />
			</pre>
		</div>
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

function BenchRow({
	name,
	params,
	description,
}: {
	name: string;
	params: string;
	description: string;
}) {
	return (
		<div className="py-2.5 border-b border-zinc-800 group">
			<div className="flex items-baseline gap-3">
				<span className="text-xs text-zinc-300 font-mono shrink-0 group-hover:text-zinc-100 transition-colors">
					{name}
				</span>
				<span
					className="text-[10px] text-zinc-500"
					dangerouslySetInnerHTML={{ __html: params }}
				/>
			</div>
			<p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
				{description}
			</p>
		</div>
	);
}
