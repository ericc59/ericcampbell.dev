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
				<span className="text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
					Research
				</span>
				<h1 className="text-zinc-200 text-lg font-medium mt-3">
					ARC-AGI Solver
				</h1>
				<p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">
					A hybrid program synthesis system for solving{" "}
					<a
						href="https://arcprize.org/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-zinc-400 hover:text-zinc-200 transition-colors"
					>
						ARC-AGI
					</a>{" "}
					puzzles. No LLM required for core solving. Currently at{" "}
					<span className="text-zinc-200">130/400</span> on ARC-1.
				</p>
			</div>

			{/* What is ARC */}
			<div className="space-y-4">
				<Label>The Problem</Label>
				<div className="text-sm text-zinc-500 leading-relaxed space-y-3 max-w-lg">
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
				<p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
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
						description="Detect separator lines dividing grids into cells, solve overlay/boolean/stamp relationships between cells"
						type="analytical"
					/>
					<SolverRow
						layer="0.75"
						name="Inference Engine"
						description="23 specialized sub-engines for specific pattern families: color mapping, gravity, tiling, object extraction, etc."
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
				<p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
					ARC-1 benchmark (400 tasks), depth 3 search, 10s timeout per task. No
					LLM.
				</p>

				<div className="mt-2 flex items-end gap-1.5 h-24">
					{[
						{ score: 76, label: "v1" },
						{ score: 103, label: "v2" },
						{ score: 108, label: "v3" },
						{ score: 110, label: "v4" },
						{ score: 118, label: "v5" },
						{ score: 125, label: "v6" },
						{ score: 130, label: "v7" },
					].map(({ score, label }) => (
						<div key={label} className="flex flex-col items-center gap-1">
							<span className="text-[9px] text-zinc-500">{score}</span>
							<div
								className="w-8 bg-zinc-800 rounded-sm"
								style={{ height: `${(score / 400) * 80}px` }}
							/>
							<span className="text-[9px] text-zinc-600">{label}</span>
						</div>
					))}
					<div className="flex flex-col items-center gap-1 ml-4 opacity-30">
						<span className="text-[9px] text-zinc-600">400</span>
						<div
							className="w-8 border border-dashed border-zinc-700 rounded-sm"
							style={{ height: `${(400 / 400) * 80}px` }}
						/>
						<span className="text-[9px] text-zinc-600">max</span>
					</div>
				</div>

				<div className="text-[10px] text-zinc-600 mt-1">
					32.5% solve rate &middot; 1,192 tests &middot; 100% coverage &middot;
					4,525 statements
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
						title="23 inference sub-engines"
						detail="Each one is a hand-crafted detector for a specific ARC pattern family (gravity fill, stamp templates, diagonal tiling, color ranking, etc.). Individually narrow, collectively powerful."
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
				<div className="text-sm text-zinc-500 leading-relaxed space-y-3 max-w-lg">
					<p>
						The remaining 270 unsolved tasks fall into a few categories:
						multi-step reasoning that exceeds depth 3, spatial relationships the
						DSL can't express, and pattern types none of the 23 inference
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
				<div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-600">
					<span>Python 3.12</span>
					<span>NumPy</span>
					<span>PyTorch (optional)</span>
					<span>pytest</span>
					<span>uv</span>
				</div>
			</div>

			{/* Links */}
			<div className="flex items-center gap-5 text-[10px] text-zinc-600 pt-4">
				<a
					href="https://arcprize.org/"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-400 transition-colors"
				>
					ARC Prize
				</a>
				<a
					href="https://github.com/ericc59"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-zinc-400 transition-colors"
				>
					github
				</a>
			</div>
		</section>
	);
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-[10px] text-zinc-500 uppercase tracking-[0.15em]">
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
		analytical: "text-emerald-500/60",
		search: "text-amber-500/60",
		llm: "text-violet-500/60",
	}[type];

	return (
		<div className="py-3 border-b border-zinc-900 group">
			<div className="flex items-baseline justify-between">
				<div className="flex items-baseline gap-2">
					<span className="text-[10px] text-zinc-700 w-6 shrink-0">
						L{layer}
					</span>
					<span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
						{name}
					</span>
				</div>
				<span className={`text-[9px] uppercase tracking-wider ${typeColor}`}>
					{type}
				</span>
			</div>
			<p className="text-xs text-zinc-600 mt-1 ml-8 max-w-md leading-relaxed">
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
		<div className="py-3 border-b border-zinc-900">
			<div className="flex items-baseline gap-2">
				<span
					className={`text-[10px] shrink-0 ${negative ? "text-red-500/40" : "text-emerald-500/40"}`}
				>
					{negative ? "-" : "+"}
				</span>
				<div>
					<span className="text-sm text-zinc-400">{title}</span>
					<p className="text-xs text-zinc-600 mt-1 max-w-md leading-relaxed">
						{detail}
					</p>
				</div>
			</div>
		</div>
	);
}

function NextRow({ title, detail }: { title: string; detail: string }) {
	return (
		<div className="py-3 border-b border-zinc-900">
			<div className="flex items-baseline gap-2">
				<span className="text-[10px] text-zinc-700 shrink-0">&rarr;</span>
				<div>
					<span className="text-sm text-zinc-400">{title}</span>
					<p className="text-xs text-zinc-600 mt-1 max-w-md leading-relaxed">
						{detail}
					</p>
				</div>
			</div>
		</div>
	);
}
