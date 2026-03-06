import type { Metadata } from 'next';

import { ProgressChart } from './progress-chart';

const lastUpdated = 'March 6, 2026';

const metrics = [
  {
    label: 'ARC-1 Fixed Order (no router)',
    train: '367/400 (91.8%)',
    test: '204/400 (51.0%)',
    joint: '203/400 (50.8%)',
    source: 'reports/arc1_baseline_both.jsonl (repeat=3)',
  },
  {
    label: 'ARC-1 Router + Policy + Early Probe (best training-task run)',
    train: '348/400 (87.0%)',
    test: '267/400 (66.8%)',
    joint: '266/400 (66.5%)',
    source:
      'reports/arc1_training_after_probe.jsonl; local benchmark on ARC-1 training tasks, depth=3, timeout=10s, workers=8, metric=both, router + policy + early symbolic probe',
  },
  {
    label: 'ARC-1 Evaluation Tasks (current solver)',
    train: '156/400 (39.0%)',
    test: '64/400 (16.0%)',
    joint: '64/400 (16.0%)',
    source:
      'reports/arc1_evaluation_after_probe.jsonl; local benchmark on ARC-1 evaluation tasks, depth=3, timeout=10s, workers=8, metric=both, router + policy + early symbolic probe',
  },
];

const heroStats = [
  {
    label: 'Best ARC-1 train-task joint',
    value: '266/400',
    note: 'router + policy + early probe',
  },
  {
    label: 'ARC-1 evaluation joint',
    value: '64/400',
    note: 'held-out task set',
  },
  { label: 'Inference engines', value: '156', note: 'deterministic library' },
  { label: 'Router classes', value: '169', note: 'current stack' },
];

const progressData = [
  { checkpoint: 'v1', train: 19.0 },
  { checkpoint: 'v7', train: 32.5 },
  { checkpoint: 'v11', train: 56.8 },
  { checkpoint: 'v26', train: 68.5 },
  { checkpoint: 'v35', train: 89.5, test: 43.5 },
  { checkpoint: 'v36', train: 90.8, test: 49.8 },
  { checkpoint: 'v38', train: 91.5, test: 50.8 },
  { checkpoint: 'current', train: 87.0, test: 66.8 },
];

const architectureSteps = [
  {
    step: '01',
    title: 'macro_synthesis',
    category: 'synthesis',
    summary: 'Typed macro synthesis before the heuristic stack',
    detail:
      'Runs first. Synthesizes high-level symbolic programs like region rewrite, selective mirror concat, frame completion, grid-cell rules, and small scene summaries before the fixed-order specialist stack starts.',
    coverage: { arc1: '6.0%', arc2: '0.0%' },
  },
  {
    step: '02',
    title: 'object_centric',
    category: 'specialist',
    summary: 'Connected-component object solver',
    detail:
      'Works over extracted objects and object matches, and tries to solve the task with direct object-level transforms.',
    coverage: { arc1: '2.8%', arc2: '2.0%' },
  },
  {
    step: '03',
    title: 'grid_decomposition',
    category: 'specialist',
    summary: 'Separator-aware grid solver',
    detail:
      'Detects row and column separators, converts the task into cell-level structure, and solves regular grid compositions before broader search runs.',
    coverage: { arc1: '3.5%', arc2: '2.2%' },
  },
  {
    step: '04',
    title: 'hierarchical',
    category: 'specialist',
    summary: 'Grouped-object solver',
    detail:
      'Builds hierarchical scenes by grouping objects through containment, color, shape, alignment, and proximity, then applies per-group operations and inference.',
    coverage: { arc1: '0.3%', arc2: '0.3%' },
  },
  {
    step: '05',
    title: 'relational',
    category: 'specialist',
    summary: 'Scene-graph relational solver',
    detail:
      'Builds scene relations and structural diffs, then applies relational rules over objects and layouts instead of enumerating raw pixel programs.',
    coverage: { arc1: '2.3%', arc2: '1.6%' },
  },
  {
    step: '06',
    title: 'rule_induction',
    category: 'specialist',
    summary: 'Rule search over object properties',
    detail:
      'Induces rules over object properties and relations, then verifies them across training pairs. Used for tasks that can be expressed as consistent object-level rules.',
    coverage: { arc1: '0.8%', arc2: '0.9%' },
  },
  {
    step: '07',
    title: 'transform_dsl',
    category: 'specialist',
    summary: 'Scene-graph transformation DSL',
    detail:
      'Searches a higher-level transformation language over selectors and actions on scene structure before falling back to lower-level program search.',
    coverage: { arc1: '1.0%', arc2: '0.7%' },
  },
  {
    step: '08',
    title: 'analytical_inference',
    category: 'engine',
    summary: '156 deterministic inference engines',
    detail:
      'Covers recurring families like separator logic, projection, tiling, assembly, damage repair, lattice normalization, and pixel-rule systems. This is still the largest single execution layer in the stack.',
    coverage: { arc1: '39.8%', arc2: '17.8%' },
  },
  {
    step: '09',
    title: 'compositional_inference',
    category: 'chain',
    summary: 'Inference + search composition',
    detail:
      'Tries a direct inference step followed by a cleanup search when a single solver is close but not exact.',
    coverage: { arc1: '2.5%', arc2: '1.8%' },
  },
  {
    step: '10',
    title: 'reverse_compositional',
    category: 'chain',
    summary: 'Reverse composition path',
    detail:
      'Runs an analytical step first and then composes it with search in reverse order when that ordering is a better fit for the task.',
    coverage: { arc1: '0.0%', arc2: '0.0%' },
  },
  {
    step: '11',
    title: 'inference_chain',
    category: 'chain',
    summary: 'Inference -> inference chaining',
    detail:
      'Allows multi-step analytical transformations without dropping immediately into full DSL search.',
    coverage: { arc1: '0.0%', arc2: '0.0%' },
  },
  {
    step: '12',
    title: 'inference_inference_dsl',
    category: 'chain',
    summary: 'Inference -> inference -> DSL',
    detail:
      'Uses two inference stages to build an intermediate state, then a shallow DSL cleanup pass to finish the task.',
    coverage: { arc1: '0.0%', arc2: '0.0%' },
  },
  {
    step: '13',
    title: 'dsl_search',
    category: 'search',
    summary: 'Weighted A* over the DSL',
    detail:
      'Late fallback. Depth-3 search with aggressive pruning, target-consistency checks, shared per-task deadlines, and macro-aware synthesis hooks to keep the search space bounded.',
    coverage: { arc1: '7.3%', arc2: '0.7%' },
  },
];

export const metadata: Metadata = {
  title: 'EricAGI',
  description:
    'EricAGI is a deterministic hybrid ARC solver: explicit symbolic program synthesis and reasoning, an early typed macro-synthesis layer, a cheap symbolic probe before inference, and small neural router and policy models used only to prioritize search. Best ARC-1 training-task joint exact: 266/400. Current ARC-1 evaluation-task joint exact: 64/400. ARC-2 joint exact: 281/1000.',
  openGraph: {
    title: 'EricAGI',
    description:
      'Architecture and current benchmark status for EricAGI, a deterministic hybrid ARC solver with early macro synthesis, a symbolic probe before inference, symbolic search, and small neural guidance.',
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
          EricAGI
        </h1>
        <p className="max-w-2xl text-sm text-zinc-400 leading-relaxed">
          EricAGI is a deterministic hybrid solver for{' '}
          <a
            href="https://arcprize.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            ARC
          </a>{' '}
          tasks: explicit symbolic program synthesis and reasoning, an early
          typed macro-synthesis layer, a cheap symbolic probe before heavy
          inference, and small neural router and policy models that only
          prioritize search. This page is the current product-engineering
          snapshot of the stack, the best training-task results, and the real
          held-out evaluation numbers.
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
              <h3 className="text-xs font-medium text-zinc-200">
                {metric.label}
              </h3>
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
          ARC-1 training-task exact score by checkpoint. Train is shown across
          the full timeline; test appears where split-aware measurements were
          recorded for the same training-task set.
        </p>
      </section>

      <section className="space-y-3">
        <Label>Architecture</Label>
        <div className="space-y-3">
          {architectureSteps.map((item, index) => (
            <div
              key={item.step}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-xs font-medium text-zinc-200">
                  {item.step}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="text-sm font-medium text-zinc-100">
                      {item.title}
                    </h3>
                    <span className="w-fit rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-300">
                    {item.summary}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {item.detail}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <MetricCell
                      label="ARC-1 solved"
                      value={item.coverage.arc1}
                    />
                    <MetricCell
                      label="ARC-2 solved"
                      value={item.coverage.arc2}
                    />
                  </div>
                </div>
              </div>
              {index < architectureSteps.length - 1 ? (
                <div className="ml-5 mt-3 h-4 w-px bg-zinc-800" />
              ) : null}
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          Current execution starts with <code>macro_synthesis</code>, then a
          cheap <code>simple_symbolic_probe</code> runs before heavy inference,
          and the fixed-order specialist stack runs as{' '}
          <code>
            object_centric -&gt; grid_decomposition -&gt; hierarchical -&gt;
            relational -&gt; rule_induction -&gt; transform_dsl -&gt;
            analytical_inference -&gt; compositional_inference -&gt;
            reverse_compositional -&gt; inference_chain -&gt;
            inference_inference_dsl -&gt; dsl_search
          </code>
          . Percentages above are current joint-exact solves attributed to the
          top-level layer that ultimately solved each task. ARC-1 coverage is
          from <code>reports/arc1_training_after_probe.jsonl</code>; ARC-2
          coverage is from <code>reports/arc2_router_policy_current.jsonl</code>
          .
        </p>
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
