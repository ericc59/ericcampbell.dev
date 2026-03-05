import type { Metadata } from 'next';

import { ProgressChart } from './progress-chart';

const lastUpdated = 'March 4, 2026';

const metrics = [
  {
    label: 'ARC-1 Fixed Order (no router)',
    train: '367/400 (91.8%)',
    test: '204/400 (51.0%)',
    joint: '203/400 (50.8%)',
    source: 'reports/arc1_baseline_both.jsonl (repeat=3)',
  },
  {
    label: 'ARC-1 Router + Policy',
    train: '363/400 (90.8%)',
    test: '209/400 (52.3%)',
    joint: '208/400 (52.0%)',
    source: 'reports/arc1_rule_router_both.jsonl (repeat=3)',
  },
];

const heroStats = [
  { label: 'Best ARC-1 joint', value: '208/400', note: 'router + policy' },
  { label: 'Best ARC-1 test', value: '209/400', note: 'split-aware' },
  { label: 'Inference engines', value: '147', note: 'deterministic library' },
  { label: 'Router classes', value: '160', note: 'current stack' },
];

const progressData = [
  { checkpoint: 'v1', train: 76 },
  { checkpoint: 'v7', train: 130 },
  { checkpoint: 'v11', train: 227 },
  { checkpoint: 'v26', train: 274 },
  { checkpoint: 'v35', train: 358, test: 174 },
  { checkpoint: 'v36', train: 363, test: 199 },
  { checkpoint: 'v38', train: 366, test: 203 },
  { checkpoint: 'current', train: 363, test: 209 },
];

const howItWorks = [
  {
    title: 'Read the grid first',
    detail:
      'It extracts objects, separators, grouped objects, and scene relationships before solving.',
  },
  {
    title: 'Try direct methods before search',
    detail:
      'Object-centric, grid decomposition, hierarchical, relational, rule induction, and transform DSL run first.',
  },
  {
    title: 'Use a large engine library',
    detail:
      '147 specialized engines cover recurring pattern families when a known strategy fits.',
  },
  {
    title: 'Fall back to chained search',
    detail:
      'If direct methods fail, it tries inference chains and weighted A* search with strict pruning and shared time budgets.',
  },
];

const recentChanges = [
  'Runtime, training, and benchmark method coverage are now aligned.',
  'Split-aware reporting catches train-only gains earlier.',
  'The engine library grew without dropping deterministic behavior.',
  'Router + policy now beats fixed order on ARC-1 test and joint exact.',
];

const nowBuilding = [
  'Reduce the train/test gap on harder ARC-1 tasks.',
  'Run a fresh ARC-2 benchmark on the current stack.',
  'Keep adding reusable methods instead of one-off fixes.',
];

export const metadata: Metadata = {
  title: 'ARC Solver Build Log',
  description:
    'Product engineering build log for a deterministic ARC solver. Current ARC-1 joint exact: 203/400 (fixed order) and 208/400 (router + policy).',
  openGraph: {
    title: 'ARC Solver Build Log',
    description:
      'Architecture and current benchmark status for an ARC solver built as a product engineering project.',
  },
};

export default function ArcAgiPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-5 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6">
        <span className="text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
          Product Engineering
        </span>
        <h1 className="max-w-2xl text-zinc-100 text-xl font-medium leading-tight">
          ARC Solver Build Log
        </h1>
        <p className="max-w-2xl text-sm text-zinc-400 leading-relaxed">
          I&apos;m building a deterministic solver for{' '}
          <a
            href="https://arcprize.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            ARC
          </a>{' '}
          tasks. This is the current product-engineering snapshot: what the
          stack looks like, how performance is moving, and what I&apos;m working on
          next.
        </p>
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
        <Label>Current Status</Label>
        <div className="flex items-center justify-between gap-3 text-sm text-zinc-500">
          <p>Last updated: {lastUpdated}</p>
          <p className="hidden sm:block">Depth 3, deterministic, split-aware</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <h3 className="text-xs font-medium text-zinc-200">{metric.label}</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <MetricCell label="Train" value={metric.train} />
                <MetricCell label="Test" value={metric.test} />
                <MetricCell label="Joint" value={metric.joint} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-zinc-500">{metrics[1].source}</p>
      </section>

      <section className="space-y-3">
        <Label>Progress</Label>
        <ProgressChart data={progressData} />
        <p className="text-xs text-zinc-500">
          ARC-1 exact solves by checkpoint. Train is shown across the full
          timeline; test appears where split-aware measurements were recorded.
        </p>
      </section>

      <section className="space-y-3">
        <Label>How It Works</Label>
        <div className="grid gap-3 md:grid-cols-2">
          {howItWorks.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <h3 className="text-xs text-zinc-200 font-medium">{item.title}</h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          Implementation footprint: 147 inference engines, 7 analytical classes,
          4 chain methods, and 160 total router classes.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Label>Recent Changes</Label>
          <ul className="grid gap-2">
            {recentChanges.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 text-sm leading-relaxed text-zinc-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Label>Now Building</Label>
          <ul className="grid gap-2">
            {nowBuilding.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 text-sm leading-relaxed text-zinc-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}

function Label({ children }: { children: string }) {
  return (
    <h2 className="text-[11px] text-zinc-300 uppercase tracking-[0.12em] font-medium">
      {children}
    </h2>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}
