import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "ARC-AGI Solver",
	description:
		"Building an ARC-AGI solver from scratch: DSL search, analytical inference, and ML-guided program synthesis. Currently solving 32.5% of ARC-1.",
	openGraph: {
		title: "ARC-AGI Solver",
		description:
			"Building an ARC-AGI solver from scratch: DSL search, analytical inference, and ML-guided program synthesis.",
	},
};

export default function ArcAgiPage() {
	return (
		<section className="space-y-16">
			{/* Header */}
			<div>
				<span className="text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
					Research
				</span>
				<h1 className="text-zinc-100 text-lg font-medium mt-3">
					ARC-AGI Solver
				</h1>
				<p className="text-sm text-zinc-400 mt-2 leading-relaxed">
					A hybrid program synthesis system for solving{" "}
					<a
						href="https://arcprize.org/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-zinc-300 hover:text-zinc-100 transition-colors"
					>
						ARC-AGI
					</a>{" "}
					puzzles. No LLM required for core solving. Currently at{" "}
					<span className="text-zinc-100">130/400</span> on ARC-1.
				</p>
			</div>

			{/* What is ARC */}
			<div className="space-y-4">
				<Label>The Problem</Label>
				<div className="text-sm text-zinc-400 leading-relaxed space-y-3">
					<p>
						ARC (Abstraction and Reasoning Corpus) is a benchmark for measuring
						general intelligence. Each task shows 2-3 input/output grid examples
						that demonstrate a transformation rule. The solver must infer the
						rule and apply it to an unseen test input.
					</p>
					<p>
						Grids are 2D arrays of integers 0-9 (colors), up to 30x30.
						Transformations range from simple rotations to complex multi-step
						reasoning about objects, patterns, and spatial relationships.
					</p>
					<p>
						The hard part: every task has a different rule. There's no training
						set that teaches you "how to solve ARC." You need genuine
						abstraction.
					</p>
				</div>
			</div>

			{/* Architecture */}
			<div className="space-y-4">
				<Label>Architecture</Label>
				<p className="text-sm text-zinc-400 leading-relaxed">
					Six solver layers, tried in priority order. Each layer is a different
					strategy. The first one that succeeds wins.
				</p>

				<div className="space-y-0 mt-2">
					<SolverRow
						layer="0"
						name="Object-Centric"
						description="Decompose grid into connected components, match input objects to output objects, learn per-object transforms"
						type="analytical"
					/>
					<SolverRow
						layer="0.5"
						name="Grid Decomposition"
						description="Detect separator lines dividing grids into cells, solve overlay/boolean/stamp relationships between cells. Meta-grid mode: summarize cells as colors, run inference engines at cell level, reconstruct"
						type="analytical"
					/>
					<SolverRow
						layer="0.6"
						name="Relational Perception"
						description="Build scene graphs from grids (objects, relations, symmetries), compute structural diffs between input/output scenes, match 6 composable meta-rules: marker stamp, fill-between, extension, template clone, relational recolor (5 strategies: contained/adjacent/same_shape/same_col/size_rank), containment fill"
						type="analytical"
					/>
					<SolverRow
						layer="0.75"
						name="Inference Engine"
						description="27 specialized sub-engines for specific pattern families: color mapping, gravity, tiling, object extraction, enclosed fill, position-aware pixel rules, etc."
						type="analytical"
					/>
					<SolverRow
						layer="1"
						name="DSL Search"
						description="Weighted A* over a space of 50 primitives. Composes multi-step programs (depth 3-4) mapping input to output"
						type="search"
					/>
					<SolverRow
						layer="2"
						name="LLM DSL"
						description="Ask an LLM to generate DSL programs, verify against training pairs"
						type="llm"
					/>
					<SolverRow
						layer="3"
						name="LLM Python"
						description="Last resort: LLM writes arbitrary Python, executed in a sandboxed subprocess"
						type="llm"
					/>
				</div>
			</div>

			{/* Progress */}
			<div className="space-y-4">
				<Label>Progress</Label>
				<p className="text-sm text-zinc-400 leading-relaxed">
					ARC-1 benchmark (400 tasks), depth 3 search, 10s timeout per task. No
					LLM.
				</p>

				<div className="mt-2 rounded border border-zinc-800 bg-zinc-900/50 p-5">
					<div className="flex items-end gap-0 h-32">
						{[
							{ score: 76, label: "v1" },
							{ score: 103, label: "v2" },
							{ score: 108, label: "v3" },
							{ score: 110, label: "v4" },
							{ score: 118, label: "v5" },
							{ score: 125, label: "v6" },
							{ score: 130, label: "v7" },
						].map(({ score, label }, i, arr) => (
							<div
								key={label}
								className="flex-1 flex flex-col items-center gap-1.5"
							>
								<span
									className={`text-[10px] ${i === arr.length - 1 ? "text-zinc-200 font-medium" : "text-zinc-400"}`}
								>
									{score}
								</span>
								<div
									className={`w-full rounded-sm ${i === arr.length - 1 ? "bg-emerald-500/40" : "bg-zinc-700"}`}
									style={{ height: `${(score / 400) * 120}px` }}
								/>
								<span className="text-[10px] text-zinc-400">{label}</span>
							</div>
						))}
					</div>

					<div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
						<span className="text-[10px] text-zinc-300">
							130/400 solved (32.5%)
						</span>
						<div className="flex items-center gap-4 text-[10px] text-zinc-400">
							<span>1,500 tests</span>
							<span>100% coverage</span>
							<span>5,701 stmts</span>
						</div>
					</div>
				</div>
			</div>

			{/* What Worked */}
			<div className="space-y-4">
				<Label>What Worked</Label>
				<div className="space-y-0">
					<InsightRow
						title="Analytical solvers before search"
						detail="Object-centric, grid decomposition, and inference engines are fast (< 100ms) and handle tasks that would take the DSL search minutes to find. They now account for the majority of solves."
					/>
					<InsightRow
						title="Target-informed parameter pruning"
						detail="Restricting recolor destinations, color maps, and fill operations to only colors present in the target output. Cuts the search branching factor dramatically."
					/>
					<InsightRow
						title="Multi-pair early rejection"
						detail="At search depth >= 2, reject candidates whose secondary pair pixel diff worsens vs parent. Kills dead-end branches early without losing solutions."
					/>
					<InsightRow
						title="False-positive hash unblocking"
						detail="When a program matches the first training pair but fails multi-pair verification, remove its hash from the visited set. Prevents one false positive from blocking all programs that produce the same intermediate grid."
					/>
					<InsightRow
						title="Relational perception"
						detail="Separate perception from reasoning: build scene graphs (objects, relations, symmetries), compute structural diffs, then match 6 composable meta-rules. Template clone copies objects to marker positions; relational recolor uses containment/adjacency/shape relations; containment fill detects enclosed regions."
					/>
					<InsightRow
						title="27 inference sub-engines"
						detail="Each one is a hand-crafted detector for a specific ARC pattern family (gravity fill, stamp templates, diagonal tiling, color ranking, enclosed fill, etc.). Individually narrow, collectively powerful."
					/>
					<InsightRow
						title="Feature-based pruning"
						detail="If input/output have same dimensions, exclude shape-changing primitives. If colors are preserved, exclude color changers. Simple heuristic, massive search space reduction."
					/>
					<InsightRow
						title="Beam search fallback"
						detail="After A* exhausts its node budget, beam search (width=100) continues from the best frontier nodes. Catches solutions that A* couldn't reach within budget."
					/>
				</div>
			</div>

			{/* What Didn't Work */}
			<div className="space-y-4">
				<Label>What Didn't Work</Label>
				<div className="space-y-0">
					<InsightRow
						title="Bidirectional search"
						detail="Planned but never implemented. Most ARC primitives aren't cleanly invertible (crop loses size info, gravity loses positions). The forward-only A* with good pruning was sufficient."
						negative
					/>
					<InsightRow
						title="Brute-force depth increases"
						detail="Going from depth 3 to depth 4 explodes the search space (50^4 = 6.25M). Smarter pruning and analytical solvers were always a better investment than deeper search."
						negative
					/>
					<InsightRow
						title="Pure ML routing without rules"
						detail="The transformer router (~27K params) needs rule-based fallback. With only 400 labeled tasks, the model isn't reliable enough alone. Rules + model beats model-only."
						negative
					/>
					<InsightRow
						title="Generic object matching"
						detail="Early object solver used greedy matching without shape awareness. Adding shape-based selectors, broadcast selectors, and compound transforms (rotation + recolor) was necessary to handle real tasks."
						negative
					/>
				</div>
			</div>

			{/* Key Design Decisions */}
			<div className="space-y-4">
				<Label>Key Decisions</Label>
				<div className="space-y-0">
					<InsightRow
						title="Linear programs, not DAGs"
						detail="Programs are tuples of (primitive, params) applied sequentially. No branching, no data flow graphs. Simpler search space, sufficient for depth 3-4."
					/>
					<InsightRow
						title="LLM-free first"
						detail="Every component works without API calls. The LLM layers are optional amplifiers, not crutches. The core 32.5% solve rate is pure compute."
					/>
					<InsightRow
						title="50 primitives, not 200"
						detail="Enough expressiveness to cover common transformations without drowning the search. 7 geometric, 7 color, 8 spatial, 10 object, 8 pattern, 10 higher-order."
					/>
					<InsightRow
						title="Duck-typed program objects"
						detail="ObjectProgram, GridProgram, InferenceProgram all duck-type the Program interface (execute + verify). The hybrid solver doesn't care which layer produced the solution."
					/>
				</div>
			</div>

			{/* What's Next */}
			<div className="space-y-4">
				<Label>What's Next</Label>
				<div className="text-sm text-zinc-400 leading-relaxed space-y-3">
					<p>
						The remaining 270 unsolved tasks fall into a few categories:
						multi-step reasoning that exceeds depth 3, spatial relationships the
						DSL can't express, and pattern types none of the 25 inference
						engines recognize.
					</p>
					<p>The plan:</p>
				</div>
				<div className="space-y-0">
					<NextRow
						title="More inference engines"
						detail="Analyze unsolved tasks, identify common pattern families, build targeted sub-engines. Each new engine is cheap to add and can unlock 5-15 tasks."
					/>
					<NextRow
						title="Policy network refinement"
						detail="The CNN policy (~60K params) guides beam search by predicting which primitive to try next. Training on more solved programs and better synthetic data."
					/>
					<NextRow
						title="ARC-AGI-3 (interactive games)"
						detail="Turn-based grid games launching March 2026. Requires a fundamentally different approach: exploration, causal discovery, and planning on 64x64 grids."
					/>
				</div>
			</div>

			{/* Tech Stack */}
			<div className="space-y-4">
				<Label>Stack</Label>
				<div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400">
					<span>Python 3.12</span>
					<span>NumPy</span>
					<span>PyTorch (optional)</span>
					<span>pytest</span>
					<span>uv</span>
				</div>
			</div>

			{/* Changelog */}
			<div className="space-y-4">
				<Label>Changelog</Label>
				<div className="space-y-0">
					<ChangelogEntry
						date="2026-02-21"
						title="Recolor Engine Improvements + Benchmark Pipeline Fix"
						changes={[
							"Added solve_relational to benchmark.py pipeline (was missing between grid decomposition and inference layers, unlocking Phase A rule solves)",
							"Fixed relational recolor: added from_color filter to prevent bidirectional recoloring (e.g. nearest_same_shape no longer swaps both objects)",
							"New same_col_marker strategy: recolor objects based on SAME_COL relation to differently-colored objects",
							"New size_rank strategy: recolor all same-colored objects by size-based ranking with learned size-to-color mapping",
							"1,500 tests (was 1,482), 5,701 statements (was 5,632), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-21"
						title="Phase B: 3 New Relational Meta-Rules"
						changes={[
							"TemplateCloneRule: copy template objects to marker positions with anchor modes (top_left/center) and color modes (preserve/marker)",
							"RelationalRecolorRule: recolor objects based on scene relations (contained_marker, adjacent_marker, nearest_same_shape)",
							"ContainmentFillRule: detect enclosed bg regions via BFS, fill with border_color/fixed/marker_inside strategies",
							"6 total meta-rules in relational perception (was 3), 1,482 tests (was 1,423), 5,632 statements (was 5,358), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-21"
						title="Relational Perception System"
						changes={[
							"New src/perception/ package: scene graph builder, structural diff engine, composable meta-rules (MarkerStamp, FillBetween, Extension)",
							"Layer 0.6 in hybrid solver: relational perception slots between grid decomposition and inference engines",
							"Separates perception from reasoning: build rich scene graph once, match relational patterns across training pairs",
							"ML router updated: 35 output classes (was 34), new 'relational' solver class",
							"1,423 tests (was 1,289), 5,358 statements (was 4,847), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-21"
						title="Symmetry Completion Engine"
						changes={[
							"Symmetry completion inference engine: additive fill from mirror positions (h/v/both/transpose/rot180), unlike DSL primitives which overwrite one half",
							"Fixed missing marker_rectangle_fill in ML router SOLVER_CLASSES (32→34 output classes)",
							"27 inference engines (was 26), 1,289 tests (was 1,264), 4,847 statements (was 4,794), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-20"
						title="Eval Benchmarking + Marker Rectangle Fill"
						changes={[
							"Benchmark --split flag: run on evaluation splits (arc-1 eval 400 tasks, arc-2 eval 120 tasks) to measure generalization",
							"Marker rectangle fill engine: detects isolated same-color corner markers forming axis-aligned rectangles, fills interior with learned color (af902bf9 task class)",
							"26 inference engines (was 25), 1,264 tests (was 1,242), 4,794 statements (was 4,713), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-20"
						title="Verbose Solver Tracing"
						changes={[
							"3-level verbose benchmark: -v per-task, -vv layer trace (obj/grid/inf/dsl), -vvv per-engine trace (25 inference engines individually)",
							"Engine-level tracing iterates inference engines one-by-one via solve_inference(engines=[name]) for precise debugging",
						]}
					/>
					<ChangelogEntry
						date="2026-02-20"
						title="Cross-Dataset Improvements"
						changes={[
							"Enclosed region fill engine: detects border-enclosed areas and fills with learned color (00d62c1b task class)",
							"Extended pixel rules: position-aware features (border distance, parity, diagonal neighbors) for spatial-context transforms",
							"Grid cell majority fill: meta-grid summarizer picks most common non-bg color per cell, handles noisy/mixed cells",
							"25 inference engines (was 23), 1,242 tests (was 1,214), 4,713 statements (was 4,584), 100% coverage maintained",
						]}
					/>
				</div>
			</div>

			{/* Links */}
			<div className="flex items-center gap-5 text-[10px] text-zinc-400 pt-4">
				<a
					href="https://arcprize.org/"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-300 transition-colors"
				>
					ARC Prize
				</a>
				<a
					href="https://github.com/ericc59"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-300 transition-colors"
				>
					github
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

function SolverRow({
	layer,
	name,
	description,
	type,
}: {
	layer: string;
	name: string;
	description: string;
	type: "analytical" | "search" | "llm";
}) {
	const typeColor = {
		analytical: "text-emerald-400/70",
		search: "text-amber-400/70",
		llm: "text-violet-400/70",
	}[type];

	return (
		<div className="py-3 border-b border-zinc-800 group">
			<div className="flex items-baseline justify-between">
				<div className="flex items-baseline gap-2">
					<span className="text-[10px] text-zinc-400 w-6 shrink-0">
						L{layer}
					</span>
					<span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
						{name}
					</span>
				</div>
				<span className={`text-[9px] uppercase tracking-wider ${typeColor}`}>
					{type}
				</span>
			</div>
			<p className="text-xs text-zinc-400 mt-1 ml-8 leading-relaxed">
				{description}
			</p>
		</div>
	);
}

function InsightRow({
	title,
	detail,
	negative,
}: {
	title: string;
	detail: string;
	negative?: boolean;
}) {
	return (
		<div className="py-3 border-b border-zinc-800">
			<div className="flex items-baseline gap-2">
				<span
					className={`text-[10px] shrink-0 ${negative ? "text-red-400/60" : "text-emerald-400/60"}`}
				>
					{negative ? "-" : "+"}
				</span>
				<div>
					<span className="text-sm text-zinc-300">{title}</span>
					<p className="text-xs text-zinc-400 mt-1 leading-relaxed">{detail}</p>
				</div>
			</div>
		</div>
	);
}

function ChangelogEntry({
	date,
	title,
	changes,
}: {
	date: string;
	title: string;
	changes: string[];
}) {
	return (
		<div className="py-3 border-b border-zinc-800">
			<div className="flex items-baseline gap-2">
				<span className="text-[10px] text-zinc-400 shrink-0 w-20">{date}</span>
				<div>
					<span className="text-sm text-zinc-300">{title}</span>
					<ul className="mt-1 space-y-1">
						{changes.map((change, i) => (
							<li key={i} className="text-xs text-zinc-400 leading-relaxed">
								&bull; {change}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

function NextRow({ title, detail }: { title: string; detail: string }) {
	return (
		<div className="py-3 border-b border-zinc-800">
			<div className="flex items-baseline gap-2">
				<span className="text-[10px] text-zinc-400 shrink-0">&rarr;</span>
				<div>
					<span className="text-sm text-zinc-300">{title}</span>
					<p className="text-xs text-zinc-400 mt-1 leading-relaxed">{detail}</p>
				</div>
			</div>
		</div>
	);
}
