import type { Metadata } from 'next';

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

const architecture = [
  {
    title: 'Perception layers',
    detail:
      'The solver first reads structure: objects, separators, grouped objects, and scene relationships. This narrows the search space before any expensive solving starts.',
  },
  {
    title: 'Analytical solvers',
    detail:
      'Fast deterministic methods run first (object-centric, grid decomposition, hierarchical, relational, rule induction, and transform DSL).',
  },
  {
    title: 'Inference engine library',
    detail:
      '147 specialized inference engines handle recurring pattern families directly when a known strategy fits.',
  },
  {
    title: 'Compositional chains',
    detail:
      'When one step is not enough, the system tries chained methods (inference + inference, inference + DSL, and reverse compositional paths).',
  },
  {
    title: 'DSL search fallback',
    detail:
      'If analytical methods fail, weighted A* program search runs with strict pruning, depth 3, and a shared per-task time budget.',
  },
  {
    title: 'Deterministic scoring',
    detail:
      'Progress is tracked with split-aware train/test/joint exact metrics so improvements reflect generalization, not train-only fit.',
  },
];

const recentProgress = [
  'Unified registry and routing order now keep benchmark, training, and runtime method coverage in sync.',
  'Split-aware reporting is now standard, which made regressions easier to detect early.',
  'Engine count and specialist coverage expanded, while keeping deterministic behavior and full test coverage.',
  'Router+policy mode now improves ARC-1 test and joint exact over fixed-order mode, even when train exact is lower.',
];

const nextWork = [
  'Stabilize gains from router+policy mode while reducing train/test gap on harder ARC-1 tasks.',
  'Run and publish a fresh ARC-2 benchmark using the current solver stack.',
  'Keep pushing reusable methods that solve families of tasks, not just one-off patterns.',
];

export const metadata: Metadata = {
  title: 'ARC Solver',
  description:
    'Deterministic ARC puzzle solver built from analytical methods and DSL search. Current ARC-1 joint exact: 203/400 (fixed order) and 208/400 (router + policy).',
  openGraph: {
    title: 'ARC Solver',
    description:
      'Current architecture and benchmark status for a deterministic ARC puzzle solver.',
  },
};

export default function ArcAgiPage() {
  return (
    <section className="space-y-12">
      <header className="space-y-3">
        <span className="text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
          Research
        </span>
        <h1 className="text-zinc-100 text-lg font-medium">ARC Solver</h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          A deterministic solver for{' '}
          <a
            href="https://arcprize.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            ARC
          </a>{' '}
          tasks. This page focuses on what is implemented today: system
          architecture, current benchmark results, and the next execution
          priorities.
        </p>
      </header>

      <section className="space-y-4">
        <Label>Current Status</Label>
        <p className="text-sm text-zinc-500">Last updated: {lastUpdated}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded border border-zinc-800 bg-zinc-900/50 p-4 space-y-2"
            >
              <h3 className="text-xs text-zinc-200 font-medium">
                {metric.label}
              </h3>
              <p className="text-xs text-zinc-400">
                Train exact:{' '}
                <span className="text-zinc-200">{metric.train}</span>
              </p>
              <p className="text-xs text-zinc-400">
                Test exact: <span className="text-zinc-200">{metric.test}</span>
              </p>
              <p className="text-xs text-zinc-400">
                Joint exact:{' '}
                <span className="text-zinc-200">{metric.joint}</span>
              </p>
              <p className="text-[11px] text-zinc-500">{metric.source}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Label>Architecture</Label>
        <div className="space-y-2">
          {architecture.map((item) => (
            <div
              key={item.title}
              className="rounded border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <h3 className="text-xs text-zinc-200 font-medium">
                {item.title}
              </h3>
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

      <section className="space-y-4">
        <Label>Recent Progress</Label>
        <ul className="space-y-2">
          {recentProgress.map((item) => (
            <li
              key={item}
              className="text-sm text-zinc-400 leading-relaxed rounded border border-zinc-800 bg-zinc-900/30 p-3"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <Label>Next</Label>
        <ul className="space-y-2">
          {nextWork.map((item) => (
            <li
              key={item}
              className="text-sm text-zinc-400 leading-relaxed rounded border border-zinc-800 bg-zinc-900/30 p-3"
            >
              {item}
            </li>
          ))}
        </ul>
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
