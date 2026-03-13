import type { Metadata } from "next";
import Image from "next/image";
import mastImage from "public/images/projects/mast.png";
import { CodeTabs } from "./code-tabs";

const heroStats = [
	{
		label: "Storage",
		value: "Single file",
		note: "one .mast database on disk",
	},
	{
		label: "Recall",
		value: "Cosine similarity",
		note: "vector search + metadata filters",
	},
	{
		label: "Bindings",
		value: "Rust, Python, Node, C",
		note: "plus CLI tooling",
	},
	{ label: "Core model", value: "Embeddable", note: "library, not a server" },
];

const problemCards = [
	{
		title: "Single-file memory store",
		detail:
			"MAST gives AI applications a local memory database that opens from a file path instead of requiring a separate service.",
	},
	{
		title: "No daemon, no network hop",
		detail:
			"It opens like SQLite. Give it a file path, run queries in-process, and keep the latency and operational footprint low.",
	},
	{
		title: "Vector search with metadata filters",
		detail:
			"The core engine focuses on storing memories, cosine-similarity recall, collection isolation, and metadata filtering during search.",
	},
	{
		title: "Pluggable embedders",
		detail:
			"The storage layer stays vendor-neutral. Embedders are traits, so OpenAI, Voyage, mock embedders, or your own implementation can sit at the edge.",
	},
];

const operations = [
	{
		name: "STORE",
		description:
			"Write memory content, embeddings, metadata, tier, and timestamps in one ACID transaction.",
	},
	{
		name: "RECALL",
		description:
			"Run cosine-similarity search within a collection, optionally constrained by metadata filters.",
	},
	{
		name: "GET",
		description:
			"Fetch a memory directly by collection and ULID when you already know the identifier.",
	},
	{
		name: "INFO",
		description:
			"Inspect collection-level stats and database information from the same local engine.",
	},
];

const architectureLayers = [
	{
		name: "Storage",
		detail:
			"Single-file ACID storage via redb. Crash-safe copy-on-write B-trees. The file is the database.",
	},
	{
		name: "Vector index",
		detail:
			"usearch HNSW indexes with cosine similarity. Per-collection indexes are serialized into redb.",
	},
	{
		name: "Metadata + embedder boundary",
		detail:
			"Metadata filters are backed by an inverted index in redb, while embedders stay outside the core through a trait-based interface.",
	},
];

const keyDecisions = [
	{
		title: "Single file, not client-server",
		detail:
			"You link it into the agent process and open a path. That cuts deployment complexity and keeps recall local.",
	},
	{
		title: "Collection isolation",
		detail:
			"Recall in one collection never returns memories from another, so application namespaces stay clean by default.",
	},
	{
		title: "Core stays vendor-neutral",
		detail:
			"No cloud SDKs or runtime services in the core engine. Model dependencies stay at the edge.",
	},
	{
		title: "Stable core, optional integrations",
		detail:
			"The core engine stays focused. Bindings, CLI, and plugins like OpenClaw sit around it instead of being baked into storage internals.",
	},
];

const installTabs = [
	{
		id: "rust",
		label: "Rust",
		lang: "Cargo.toml",
		blurb: "Native crate with optional embedders.",
		code: `# Cargo.toml\n[dependencies]\nmast-core = { git = "https://github.com/ericc59/mast" }\nmast-embed-openai = { git = "https://github.com/ericc59/mast" }  # optional\nmast-embed-voyage = { git = "https://github.com/ericc59/mast" }  # optional`,
	},
	{
		id: "python",
		label: "Python",
		lang: "bash",
		blurb: "PyO3 bindings via maturin.",
		code: `pip install maturin\ngit clone https://github.com/ericc59/mast && cd mast/crates/mast-py\nmaturin develop --release`,
	},
	{
		id: "node",
		label: "Node",
		lang: "bash",
		blurb: "napi-rs bindings for local Node agents.",
		code: `git clone https://github.com/ericc59/mast && cd mast/crates/mast-node\nnpm install\nnpm run build`,
	},
	{
		id: "cli",
		label: "CLI",
		lang: "bash",
		blurb: "Useful for inspection and batch workflows.",
		code: `cargo install --git https://github.com/ericc59/mast mast-cli`,
	},
];

const usageTabs = [
	{
		id: "rust",
		label: "Rust",
		lang: "rust",
		blurb: "Full native flow: store, recall, get, and inspect.",
		code: `use mast_core::{Mast, config::MastConfig, types::*, embed::MockEmbedder};\nuse std::collections::HashMap;\n\nlet config = MastConfig::default().with_db_path("my.mast");\nlet mut mast = Mast::open(config)?;\nlet embedder = MockEmbedder::new(4);\n\nlet memory = mast.store(StoreRequest {\n    collection: "notes".into(),\n    content: "The quick brown fox".into(),\n    embedding: Some(vec![0.1, 0.9, 0.0, 0.0]),\n    metadata: HashMap::from([("source".into(), "test".into())]),\n    tier: Tier::Active,\n}, &embedder).await?;\n\nlet results = mast.recall(RecallRequest {\n    collection: "notes".into(),\n    query: None,\n    query_embedding: Some(vec![0.1, 0.9, 0.0, 0.0]),\n    limit: 5,\n    filter: Some(MetadataFilter::Eq("source".into(), "test".into())),\n}, &embedder).await?;\n\nlet mem = mast.get("notes", &memory.id)?;\nlet info = mast.info()?;\n\nmast.close()?;`,
	},
	{
		id: "python",
		label: "Python",
		lang: "python",
		blurb: "Simple local agent memory from Python.",
		code: `from mast import Mast\n\ndb = Mast("agent.mast")\n\nmemory = db.store(\n    "user:alice",\n    "Alice prefers dark mode",\n    embedder,\n    metadata={"source": "preferences"},\n    tier="active",\n)\n\nresults = db.recall(\n    "user:alice",\n    embedder,\n    limit=5,\n    filter={"source": "preferences"},\n)\n\ndb.close()`,
	},
	{
		id: "node",
		label: "Node",
		lang: "javascript",
		blurb: "napi bindings for agent runtimes in Node.",
		code: `const { MastDb } = require('mast-memory');\n\nconst db = new MastDb('agent.mast');\n\nconst memory = db.store(\n  'user:alice',\n  'Alice prefers dark mode',\n  embed,\n  384,\n  { source: 'preferences' },\n  'active'\n);\n\nconst results = db.recall(\n  'user:alice',\n  embed,\n  384,\n  undefined,\n  5\n);\n\ndb.close();`,
	},
	{
		id: "cli",
		label: "CLI",
		lang: "bash",
		blurb: "Store, recall, and inspect from the shell.",
		code: `mast store --db my.mast \\\n  --collection "user:alice" \\\n  --content "Alice prefers dark mode" \\\n  --embedding 0.1,0.2,0.3,0.4 \\\n  --metadata theme=dark --metadata source=preferences\n\nmast recall --db my.mast \\\n  --collection "user:alice" \\\n  --query-vec 0.1,0.2,0.3,0.4 \\\n  --limit 5\n\nmast info --db my.mast`,
	},
];

const benchmarkRows = [
	"store_single: single memory write with embedding and index update",
	"store_batch: batched writes in one transaction",
	"recall_vector: cosine-similarity retrieval over HNSW",
	"metadata_filter: filtered search over indexed metadata",
	"info: collection and database inspection",
	"ffi + bindings: integration coverage across interfaces",
	"tests: unit, integration, embedder, CLI, and FFI coverage",
];

const stack = [
	"Rust",
	"redb",
	"usearch",
	"fastembed",
	"PyO3",
	"napi-rs",
	"cbindgen",
];

export const metadata: Metadata = {
	title: "MAST",
	description:
		"MAST is a vector memory storage engine for AI applications: single-file storage, ACID transactions, cosine similarity search, and metadata filtering.",
	openGraph: {
		title: "MAST",
		description:
			"A single-file vector memory engine for AI applications, with ACID storage, cosine similarity search, and metadata filtering.",
		images: [
			{
				url: "https://www.ericcampbell.dev/images/projects/mast.png",
				width: 2752,
				height: 1536,
				alt: "MAST",
			},
		],
	},
};

export default function MastPage() {
	return (
		<section className="space-y-16">
			<Image
				src={mastImage}
				alt="MAST"
				width={2752}
				height={1536}
				className="rounded-2xl"
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
				priority
			/>

			<header className="space-y-6">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
						<div className="h-3 w-3 rounded-sm bg-amber-500" />
					</div>
					<span className="text-[10px] font-medium uppercase tracking-[0.15em] text-amber-500">
						Vector Storage Engine
					</span>
				</div>

				<div className="space-y-4">
					<h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-50">
						MAST
					</h1>
					<div className="max-w-4xl space-y-3">
						<p className="text-lg leading-relaxed text-zinc-300">
							Single-file vector memory storage for AI applications. ACID
							transactions, cosine similarity search, and metadata filtering in
							a library that embeds directly into your agent runtime.
						</p>
						<p className="text-sm leading-relaxed text-zinc-500">
							No daemon, no network hop, no separate service. Open a file path,
							store memories, query by vector similarity, and keep your model
							provider at the edge where it belongs.
						</p>
					</div>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{heroStats.map((stat, index) => (
						<div
							key={stat.label}
							className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-950/50 p-5 transition-colors hover:border-zinc-700/50"
						>
							<div className="absolute right-3 top-3 text-[10px] font-mono text-zinc-700">
								{String(index + 1).padStart(2, "0")}
							</div>
							<p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
								{stat.label}
							</p>
							<p className="mt-3 text-lg font-semibold text-zinc-100">
								{stat.value}
							</p>
							<p className="mt-2 text-xs leading-relaxed text-zinc-600">
								{stat.note}
							</p>
						</div>
					))}
				</div>
			</header>

			<section className="space-y-4">
				<Label>Why It Exists</Label>
				<div className="grid gap-4 md:grid-cols-2">
					{problemCards.map((card) => (
						<InfoCard
							key={card.title}
							title={card.title}
							detail={card.detail}
						/>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<Label>Core Operations</Label>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{operations.map((item) => (
						<InfoCard
							key={item.name}
							title={item.name}
							detail={item.description}
							mono
						/>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<Label>Install</Label>
				<CodeTabs tabs={installTabs} defaultTab="rust" />
			</section>

			<section className="space-y-4">
				<Label>Usage</Label>
				<CodeTabs tabs={usageTabs} defaultTab="rust" />
			</section>

			<section className="space-y-4">
				<Label>Architecture</Label>
				<div className="grid gap-4 md:grid-cols-3">
					{architectureLayers.map((layer) => (
						<InfoCard
							key={layer.name}
							title={layer.name}
							detail={layer.detail}
						/>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<Label>Why It Fits Agent Memory</Label>
				<div className="rounded-xl border border-zinc-800/50 bg-zinc-950/30 p-6">
					<p className="text-sm leading-relaxed text-zinc-300">
						Agent runtimes need durable local recall: user preferences, prior
						interactions, retrieved facts, and other memories that should be
						stored and queried without adding a separate vector database or
						network service.
					</p>
					<div className="mt-6 grid gap-4 md:grid-cols-3">
						<InfoCard
							title="Long-term recall"
							detail="Store user facts, summaries, and prior interactions so agents can retrieve useful context across sessions."
						/>
						<InfoCard
							title="Simple integration surface"
							detail="Open a file, call store and recall, and keep the memory layer inside the application process."
						/>
						<InfoCard
							title="Local-first operations"
							detail="Everything lives in one file, which fits local agents that need portable state and low-latency recall."
						/>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<Label>Key Decisions</Label>
				<div className="grid gap-4 md:grid-cols-2">
					{keyDecisions.map((item) => (
						<InfoCard
							key={item.title}
							title={item.title}
							detail={item.detail}
						/>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<Label>Benchmarks</Label>
				<div className="rounded-xl border border-zinc-800/50 bg-zinc-950/30 p-6">
					<p className="text-sm leading-relaxed text-zinc-400">
						Criterion coverage across store, recall, filters, and interface
						boundaries. Run with{" "}
						<InlineCode>cargo bench -p mast-core</InlineCode>.
					</p>
					<div className="mt-6 grid gap-3 md:grid-cols-2">
						{benchmarkRows.map((row, index) => (
							<div
								key={row}
								className="group rounded-lg border border-zinc-800/50 bg-zinc-950/50 px-4 py-3 text-xs text-zinc-400 hover:border-zinc-700/50 hover:text-zinc-300 transition-colors"
							>
								<span className="font-mono text-zinc-600 mr-2">
									{String(index + 1).padStart(2, '0')}
								</span>
								{row}
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<Label>Stack</Label>
				<div className="flex flex-wrap gap-3 text-xs">
					{stack.map((item, index) => (
						<span
							key={item}
							className="group rounded-lg border border-zinc-800/50 bg-zinc-950/30 px-4 py-2 text-zinc-400 hover:border-zinc-700/50 hover:bg-zinc-950/50 hover:text-zinc-300 transition-colors"
						>
							<span className="font-mono text-zinc-600 mr-2 text-[10px]">
								{String(index + 1).padStart(2, '0')}
							</span>
							{item}
						</span>
					))}
				</div>
			</section>

			<div className="flex items-center gap-5 pt-2 text-[10px] text-zinc-400">
				<a
					href="https://github.com/ericc59/mast"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-zinc-300"
				>
					GitHub
				</a>
			</div>
		</section>
	);
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-3">
			<h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-300">
				{children}
			</h2>
			<div className="h-px flex-1 bg-zinc-800/50" />
		</div>
	);
}

function InlineCode({ children }: { children: React.ReactNode }) {
	return (
		<code className="rounded bg-zinc-800/70 px-1.5 py-0.5 text-xs text-zinc-300">
			{children}
		</code>
	);
}

function InfoCard({
	title,
	detail,
	mono,
}: {
	title: string;
	detail: string;
	mono?: boolean;
}) {
	return (
		<div className="group rounded-xl border border-zinc-800/50 bg-zinc-950/30 p-5 transition-colors hover:border-zinc-700/50 hover:bg-zinc-950/50">
			<h3
				className={
					mono
						? "font-mono text-sm font-medium text-zinc-100"
						: "text-sm font-medium text-zinc-100"
				}
			>
				{title}
			</h3>
			<p className="mt-3 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
				{detail}
			</p>
		</div>
	);
}
