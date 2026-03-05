import Link from 'next/link';
import type { Metadata } from 'next';

import { CodeTabs } from './code-tabs';

const heroStats = [
  {
    label: 'Storage',
    value: 'Single file',
    note: 'one .mast database on disk',
  },
  {
    label: 'Recall',
    value: 'Hybrid',
    note: 'vector + BM25 + metadata + graph',
  },
  {
    label: 'Bindings',
    value: 'Rust, Python, Node, CLI',
    note: 'native interfaces',
  },
  { label: 'Core model', value: 'Embeddable', note: 'library, not a server' },
];

const problemCards = [
  {
    title: 'One memory stack instead of four',
    detail:
      'Most agent memory systems glue together a vector store, metadata DB, graph layer, and compaction job. MAST collapses that into one embeddable engine.',
  },
  {
    title: 'No daemon, no network hop',
    detail:
      'It opens like SQLite. Give it a file path, run queries in-process, and keep the latency and operational footprint low.',
  },
  {
    title: 'Memory-specific primitives',
    detail:
      'Hybrid recall, graph traversal, TTL cleanup, snapshots, and time-tiered compaction are first-class operations instead of add-ons.',
  },
  {
    title: 'Pluggable models, stable storage',
    detail:
      'Core stays vendor-neutral. Embedders and compactors are traits, so you can swap model providers without changing the storage layer.',
  },
];

const operations = [
  {
    name: 'STORE',
    description:
      'Write content, metadata, embedding, timestamps, and graph links in one atomic transaction.',
  },
  {
    name: 'RECALL',
    description:
      'Run vector similarity, BM25 text search, metadata filtering, and graph-aware retrieval in one ranked result set.',
  },
  {
    name: 'RELATE',
    description:
      'Attach entity-to-entity and memory-to-entity edges so recall can follow relationships instead of only matching text.',
  },
  {
    name: 'COMPACT',
    description:
      'Promote raw memories into summaries, patterns, and core facts over time without pushing that logic into a separate system.',
  },
];

const architectureLayers = [
  {
    name: 'Storage',
    detail:
      'Single-file ACID storage via redb. Crash-safe copy-on-write B-trees. The file is the database.',
  },
  {
    name: 'Indexing',
    detail:
      'HNSW vector search, BM25 full-text, metadata indexes, and graph traversal primitives in the same engine.',
  },
  {
    name: 'Application',
    detail:
      'Pluggable embedders and compactors, four memory tiers, snapshots, restore, and tier-aware recall weighting.',
  },
];

const keyDecisions = [
  {
    title: 'Single file, not client-server',
    detail:
      'You link it into the agent process and open a path. That cuts deployment complexity and keeps recall local.',
  },
  {
    title: 'Compaction as synthesis',
    detail:
      'The goal is not just shorter text. The goal is promoting durable patterns and relationships into higher-value memory.',
  },
  {
    title: 'Core stays vendor-neutral',
    detail:
      'No cloud SDKs or runtime services in the core engine. Model dependencies stay at the edge.',
  },
  {
    title: 'Graph is built in',
    detail:
      'Relationships are not bolted on afterward. They are part of the recall model and storage format.',
  },
];

const installTabs = [
  {
    id: 'rust',
    label: 'Rust',
    lang: 'Cargo.toml',
    blurb: 'Native crate with optional embedders.',
    code: `# Cargo.toml\n[dependencies]\nmast-core = { git = "https://github.com/ericc59/mast" }\nmast-embed-openai = { git = "https://github.com/ericc59/mast" }  # optional\nmast-embed-local = { git = "https://github.com/ericc59/mast" }   # optional`,
  },
  {
    id: 'python',
    label: 'Python',
    lang: 'bash',
    blurb: 'PyO3 bindings via maturin.',
    code: `pip install maturin\ngit clone https://github.com/ericc59/mast && cd mast/crates/mast-py\nmaturin develop --release`,
  },
  {
    id: 'node',
    label: 'Node',
    lang: 'bash',
    blurb: 'napi-rs bindings for local Node agents.',
    code: `git clone https://github.com/ericc59/mast && cd mast/crates/mast-node\nnpm install\nnpm run build`,
  },
  {
    id: 'cli',
    label: 'CLI',
    lang: 'bash',
    blurb: 'Useful for inspection, snapshots, and batch workflows.',
    code: `cargo install --git https://github.com/ericc59/mast mast-cli`,
  },
];

const usageTabs = [
  {
    id: 'rust',
    label: 'Rust',
    lang: 'rust',
    blurb: 'Full native flow: store, hybrid recall, and graph traversal.',
    code: `use std::collections::HashMap;\n\nuse mast_core::{config::MastConfig, Mast, types::*};\nuse mast_embed_openai::OpenAIEmbedder;\n\nlet mut mast = Mast::open(MastConfig::default().with_db_path("agent.mast"))?;\nlet embedder = OpenAIEmbedder::new("text-embedding-3-small");\n\nlet mem = mast.store(StoreRequest {\n    collection: "user:alice".into(),\n    content: "Alice prefers dark mode and monospace fonts".into(),\n    metadata: HashMap::from([("source".into(), "onboarding".into())]),\n    tier: Tier::Active,\n    ..Default::default()\n}, &embedder).await?;\n\nlet results = mast.recall(RecallRequest {\n    collection: "user:alice".into(),\n    query: Some("ui preferences".into()),\n    text_query: Some("dark mode".into()),\n    search_mode: SearchMode::Hybrid { vector_weight: 0.6, text_weight: 0.4 },\n    filter: Some(MetadataFilter::Eq("source".into(), "onboarding".into())),\n    limit: 10,\n    ..Default::default()\n}, &embedder).await?;\n\nmast.relate(RelateRequest {\n    collection: "user:alice".into(),\n    source: "alice".into(),\n    target: "dark_mode".into(),\n    relation: "prefers".into(),\n    weight: 0.9,\n})?;\n\nlet edges = mast.traverse(TraverseRequest {\n    collection: "user:alice".into(),\n    start: "alice".into(),\n    max_depth: 3,\n    ..Default::default()\n})?;\n\nmast.close()?;`,
  },
  {
    id: 'python',
    label: 'Python',
    lang: 'python',
    blurb: 'Simple local agent memory from Python.',
    code: `from mast import Mast\n\ndb = Mast("agent.mast")\n\nmemory = db.store(\n    "user:alice",\n    "Alice prefers dark mode",\n    embedder,\n    metadata={"source": "onboarding"},\n    tier="active",\n)\n\nresults = db.recall(\n    "user:alice",\n    embedder,\n    query="ui preferences",\n    text_query="dark mode",\n    search_mode="hybrid",\n    limit=10,\n)\n\ndb.relate("user:alice", "alice", "dark_mode", "prefers", weight=0.9)\nedges = db.traverse("user:alice", "alice", max_depth=3)\n\ndb.snapshot("user:alice", "backup.jsonl")\ndb.close()`,
  },
  {
    id: 'node',
    label: 'Node',
    lang: 'javascript',
    blurb: 'napi bindings for agent runtimes in Node.',
    code: `const { MastDb } = require('mast-memory');\n\nconst db = new MastDb('agent.mast');\n\nconst memory = db.store(\n  'user:alice',\n  'Alice prefers dark mode',\n  embed,\n  384,\n  { source: 'onboarding' },\n  'active'\n);\n\nconst results = db.recall(\n  'user:alice',\n  embed,\n  384,\n  'ui preferences',\n  'dark mode',\n  'hybrid',\n  10\n);\n\ndb.relate('user:alice', 'alice', 'dark_mode', 'prefers', 0.9);\nconst edges = db.traverse('user:alice', 'alice', 3);\n\ndb.close();`,
  },
  {
    id: 'cli',
    label: 'CLI',
    lang: 'bash',
    blurb: 'Debugging, snapshots, and ops from the shell.',
    code: `mast store --db agent.mast -c "user:alice" \\\n  --content "Alice prefers dark mode" \\\n  --metadata source=onboarding --tier active\n\nmast recall --db agent.mast -c "user:alice" \\\n  --query "preferences" --text-query "dark mode" \\\n  --search-mode hybrid --limit 10\n\nmast relate --db agent.mast -c "user:alice" \\\n  --source alice --target dark_mode --relation prefers --weight 0.9\n\nmast snapshot --db agent.mast -c "user:alice" --output backup.jsonl`,
  },
];

const benchmarkRows = [
  'store_single: single memory store with embedding generation and index update',
  'store_batch: one transaction with batch embedding and index updates',
  'recall_vector: vector similarity over HNSW',
  'recall_bm25: full-text BM25 with Porter2 stemming',
  'recall_hybrid: blended vector + BM25 ranking',
  'vacuum: bulk TTL expiration cleanup',
  'compact: tier promotion with synthesis and re-embedding',
];

const stack = [
  'Rust',
  'redb',
  'usearch',
  'fastembed',
  'PyO3',
  'napi-rs',
  'cbindgen',
];

export const metadata: Metadata = {
  title: 'MAST',
  description:
    'MAST is an embeddable agent-memory engine: single-file storage, hybrid recall, graph traversal, and time-tiered compaction in one local database.',
  openGraph: {
    title: 'MAST',
    description:
      'The SQLite of agent memory: single-file storage plus vector, text, graph, and compaction primitives for local agents.',
  },
};

export default function MastPage() {
  return (
    <section className="space-y-12">
      <header className="space-y-5 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6">
        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-400">
          Open Source
        </span>
        <div className="space-y-3">
          <h1 className="text-lg font-medium text-zinc-100">MAST</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
            The SQLite of agent memory. MAST is an embeddable storage engine for
            local agents: vector search, full-text search, metadata filters,
            graph traversal, snapshots, and time-tiered compaction in one file.
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-500">
            It is designed for long-running local systems that need memory for
            benchmark histories, failure clusters, traces, regression notes, and
            retrieval of prior hypotheses without adding another hosted service.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"
            >
              <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-2 text-xl font-medium text-zinc-100">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <Label>Why It Exists</Label>
        <div className="grid gap-3 md:grid-cols-2">
          {problemCards.map((card) => (
            <InfoCard
              key={card.title}
              title={card.title}
              detail={card.detail}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Label>Core Operations</Label>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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

      <section className="space-y-3">
        <Label>Install</Label>
        <CodeTabs tabs={installTabs} defaultTab="rust" />
      </section>

      <section className="space-y-3">
        <Label>Usage</Label>
        <CodeTabs tabs={usageTabs} defaultTab="rust" />
      </section>

      <section className="space-y-3">
        <Label>Architecture</Label>
        <div className="grid gap-3 md:grid-cols-3">
          {architectureLayers.map((layer) => (
            <InfoCard
              key={layer.name}
              title={layer.name}
              detail={layer.detail}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Label>Why It Fits Local Systems</Label>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-sm leading-relaxed text-zinc-300">
            The engineering loop around any long-running local system produces a
            lot of memory: what failed, what overfit, what heuristics helped,
            what regressions came back, and what experiments are worth
            revisiting. MAST gives that loop a local memory layer instead of
            another hosted service.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InfoCard
              title="Experiment memory"
              detail="Store benchmark outputs, ablation summaries, and regression notes so the next run can retrieve relevant context instead of starting cold."
            />
            <InfoCard
              title="Trace retrieval"
              detail="Keep solver traces, task clusters, and failure patterns searchable with vector, text, metadata, and graph retrieval in one place."
            />
            <InfoCard
              title="Portable local state"
              detail="Everything lives in a file alongside the project, which fits the same deterministic, local-first mindset as the solver itself."
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <Label>Key Decisions</Label>
        <div className="grid gap-3 md:grid-cols-2">
          {keyDecisions.map((item) => (
            <InfoCard
              key={item.title}
              title={item.title}
              detail={item.detail}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Label>Benchmarks</Label>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-sm leading-relaxed text-zinc-400">
            Criterion coverage across store, recall, delete, vacuum, and
            compaction. Run with{' '}
            <InlineCode>cargo bench -p mast-core</InlineCode>.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {benchmarkRows.map((row) => (
              <div
                key={row}
                className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-400"
              >
                {row}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <Label>Stack</Label>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5"
            >
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
        <Link href="/arc-agi" className="transition-colors hover:text-zinc-300">
          ARC Solver
        </Link>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300">
      {children}
    </h2>
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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3
        className={
          mono ? 'font-mono text-sm text-zinc-100' : 'text-sm text-zinc-100'
        }
      >
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{detail}</p>
    </div>
  );
}
