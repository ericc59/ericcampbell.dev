import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "ARC-AGI Solver",
	description:
		"Building an ARC-AGI solver from scratch: DSL search, analytical inference, and ML-guided program synthesis. Currently solving 67.2% of ARC-1.",
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
					<span className="text-zinc-100">269/400</span> on ARC-1,{" "}
					<span className="text-zinc-100">420/1000</span> on ARC-2.
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
					Nine solver layers, tried in priority order. Each layer is a different
					strategy. The first one that succeeds wins.
				</p>

				<div className="space-y-0 mt-2">
					<SolverRow
						layer="-1"
						name="Strategy Memory"
						description="Recall solved program templates from similar tasks via 64-dim feature vectors (cosine similarity). Re-parameterize stored DSL sequences, rule structures, and transform programs for the new task. Leave-one-out by task_id prevents overfitting."
						type="analytical"
					/>
					<SolverRow
						layer="0"
						name="Object-Centric"
						description="Decompose grid into connected components, match input objects to output objects, learn per-object transforms (translate, recolor, rotate, slide-to-obstacle, per-object inference fallback)"
						type="analytical"
					/>
					<SolverRow
						layer="0.5"
						name="Grid Decomposition"
						description="Detect separator lines dividing grids into cells, solve overlay/boolean/stamp relationships between cells. Meta-grid mode: summarize cells as colors, run inference engines at cell level, reconstruct"
						type="analytical"
					/>
					<SolverRow
						layer="0.55"
						name="Hierarchical Grouping"
						description="Group objects by containment, same color, same shape, alignment (row/col), or proximity. 5 group operations: extract group, filter keep/remove groups, per-group inference (run inference solver on each group's sub-grid independently), group recolor. Bridges individual objects and full grid analysis."
						type="analytical"
					/>
					<SolverRow
						layer="0.6"
						name="Relational Perception"
						description="Build scene graphs from grids (objects, relations, symmetries), compute structural diffs between input/output scenes, match 6 composable meta-rules: marker stamp, fill-between, extension, template clone, relational recolor (5 strategies: contained/adjacent/same_shape/same_col/size_rank), containment fill"
						type="analytical"
					/>
					<SolverRow
						layer="0.65"
						name="Rule Induction"
						description="Search for transformation rules over SceneGraphs. Computes 25 object properties (intrinsic, relational, ranking, shape), classifies change patterns (filter/extract/recolor/classify/sort/move/fill), generates candidate rules per action kind, verifies against all training pairs. 8 action kinds: filter_keep, filter_remove, extract, recolor_to, classify, sort_by, move_by_property, fill_by_property."
						type="analytical"
					/>
					<SolverRow
						layer="0.67"
						name="Transform DSL"
						description="General transformation language over SceneGraphs. SELECT(selector) -> ACTION(params) programs with diff-driven candidate generation. 6 selector types (ByProperty, ByRelation, All, Complement, Intersection, Union), 10 action types (Recolor, Move, Remove, Copy, FillEnclosed, FillBBox, Extract, Connect, FillRowCol). gt/lt threshold ops for fine-grained selection. PropertyColor for relational recoloring. Move candidates: literal/property-based/gravity displacement. Extract candidates: crop to object bbox. Connect: fill bg between same-color objects along axes. FillRowCol: broadcast seed objects to fill rows/cols/crosses. 2-step composition with brute-force completion fallback. Hypothesis-refine loop: selector tightening via exclusion predicates on near-miss candidates (95%+), color fix completions from failure analysis."
						type="search"
					/>
					<SolverRow
						layer="0.75"
						name="Inference Engine"
						description="80 specialized sub-engines for specific pattern families: color mapping, gravity, tiling, tile recolor, gap fill, object extraction, enclosed fill, diagonal stamp, row/col period extension, bbox complement fill, rigid shift, pair rectangle fill, diagonal zigzag, staircase fill, position-aware pixel rules, pattern continuation, connect over background, diagonal trace, rotated stamp, neighbor recolor, legend substitution, recolor-to-closest, drag-from-marker, midpoint cross, pixel count output, spiral fill, object diagonal extend, enclosure project, block diagonal pair, cross product projection, etc."
						type="analytical"
					/>
					<SolverRow
						layer="1"
						name="DSL Search"
						description="Weighted A* over a space of 50 primitives. Composes multi-step programs (depth 3-4) mapping input to output"
						type="search"
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
							{ score: 165, label: "v8" },
							{ score: 175, label: "v9" },
							{ score: 178, label: "v10" },
							{ score: 227, label: "v11" },
							{ score: 232, label: "v12" },
							{ score: 233, label: "v13" },
							{ score: 236, label: "v14" },
							{ score: 238, label: "v15" },
							{ score: 241, label: "v16" },
							{ score: 242, label: "v17" },
							{ score: 243, label: "v18" },
							{ score: 250, label: "v19" },
							{ score: 255, label: "v20" },
							{ score: 256, label: "v21" },
							{ score: 258, label: "v22" },
							{ score: 259, label: "v23" },
							{ score: 260, label: "v24" },
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
							260/400 solved (65.0%)
						</span>
						<div className="flex items-center gap-4 text-[10px] text-zinc-400">
							<span>3,165 tests</span>
							<span>100% coverage</span>
							<span>14,007 stmts</span>
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
						title="80 inference sub-engines + compositional chaining"
						detail="Each one is a hand-crafted detector for a specific ARC pattern family. Individually narrow, collectively powerful. 80 engines and growing. Inference-to-inference chaining enables multi-step analytical transforms (e.g., extract + tile, recolor + symmetry completion) without DSL search."
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
						title="LLM-free solver"
						detail="Removed LLM layers from runtime and routing. The stack is now fully deterministic: analytical solvers + DSL search only."
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
						140 unsolved ARC-1 tasks remain. The system has excellent perception
						(SceneGraph, SceneDiff, 25 object properties) but all reasoning is
						hardcoded: 80 inference engines, 8 rule induction action kinds, 6
						relational meta-rules. Each new engine adds ~1-3 solves.
						Near-miss feeding from transform DSL into the hypothesis refinement
						loop is now wired. Router retrained with all 80 engines + 4 new
						analytical solvers.
					</p>
					<p>New architecture: 6 phases (3-8), targeting 280/400 (70%).</p>
				</div>
				<div className="space-y-0">
					<NextRow
						title="Phase 3d: Conditional + ForEach + Extend/Stamp Actions"
						detail="Phase 3c complete (UnionSelector, ConnectAction, FillRowColAction). Next: conditional branching, FOR_EACH iteration, extend/stamp actions. (+5-15 tasks beyond 3c)"
					/>
					<NextRow
						title="Phase 4: Hypothesis-Refine Loop (Complete)"
						detail="Near-miss tracking (>= 75% pixel accuracy), 5 refinement strategies: color remap, inference post-compose, DSL post-step, pixel correction, transform re-search. Activates after all solver layers fail."
					/>
					<NextRow
						title="Phase 5: Strategy Memory (Complete)"
						detail="64-dim feature vectors, cosine similarity recall, template re-parameterization (DSL/rule/transform). JSONL persistence, leave-one-out evaluation, --store/use-strategies CLI. Benchmark pending."
					/>
					<NextRow
						title="Phase 7: Multi-Scale Perception (Complete)"
						detail="Hierarchical grouping layer (L0.55): 5 strategies (containment, same_color, same_shape, alignment, proximity), 5 operations (extract, filter_keep, filter_remove, per_group_inference, recolor). Bridges objects and full grid."
					/>
					<NextRow
						title="Phases 6, 8: Transfer Abstraction, ARC-3 Agent"
						detail="Abstract strategies into parameterized templates. Interactive agent with Bayesian hypothesis search for ARC-3 environments."
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
						date="2026-02-28 17:00"
						title="Marker L-Connector Engine (+1 ARC-1)"
						changes={[
							"New inference engine marker_l_connector (#81) — detects two marker pairs (each 2 adjacent same-colored pixels) and draws an L-shaped path connecting them. The extending marker shoots along its axis until hitting a non-bg obstacle, turns 90 degrees, and meets the target marker. Supports both vertical-vertical and horizontal-horizontal orientations",
							"Solves task 2dd70a9a. 81 inference engines, 3,188 tests, 100% coverage",
						]}
					/>
					<ChangelogEntry
						date="2026-02-28 14:00"
						title="Significant Line Fill Engine (+2 ARC-1)"
						changes={[
							"New inference engine significant_line_fill with two strategies: (1) Uniform line fill — detects rows/columns entirely of one color and recolors them; (2) Extremal line fill — finds rows/columns with maximum count of a target color and fills the cross pattern",
							"Solves 2bee17df and c1d99e64",
						]}
					/>
					<ChangelogEntry
						date="2026-02-28 10:00"
						title="Near-Miss Feeding + Router Retrained"
						changes={[
							"Wired HypothesisPool near-miss feeding: transform DSL partials (top-10 from _rank_partial_matches) now fed into the hypothesis pool for refinement after all solver layers fail",
							"Pool threaded through SpecialistContext -> TransformDslSpecialist -> solve_by_transform_dsl -> _try_config. Both specialist and non-specialist paths receive the pool",
							"Router datagen updated: INFERENCE_ENGINES expanded from 23 to 80 engines (matching _ALL_STRATEGIES), 4 new solver functions added (hierarchical, relational, rule_induction, transform_dsl)",
							"Router retrained with complete solver coverage — previously ~57 engines were labeled 'unsolvable' due to missing INFERENCE_ENGINES entries",
							"89 router classes (80 inference + 7 analytical + 2 special), 3,165 tests, 14,007 stmts, 100% coverage",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 17:30"
						title="New Inference Engine: cross_product_projection"
						changes={[
							"cross_product_projection: markers on one row define column positions, markers on a perpendicular column define row positions. Fill the cross-product of bg positions with a learned color. Solves 2281f1f4",
							"77 inference engines total, 86 router classes",
							"3,051 tests, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 16:00"
						title="New Inference Engine: diagonal_corner_marks"
						changes={[
							"diagonal_corner_marks: two sub-patterns for corner/diagonal marker placement. (A) Pair anti-diagonal — pairs of same-shape blocks on a diagonal get anti-diagonal marker copies at 3x perpendicular displacement. (B) Per-block corners — each rectangular block gets up to 4 single-pixel markers at diagonal corners. Solves 22233c11 and 95990924",
							"76 inference engines total, 85 router classes",
							"3,040 tests, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 14:30"
						title="Object Count Encode + Color Band Order Engines"
						changes={[
							"object_count_encode: count connected components by (shape, color), encode count as left-justified fill in 1D output. Solves 1fad071e and similar count-to-binary-row tasks",
							"color_band_order: detect horizontal/vertical uniform color bands, output colors in spatial order. Three strategies: fixed-horizontal, fixed-vertical, auto-axis. Solves 4be741c5",
							"75 inference engines total, 84 router classes",
						]}
					/>
					<ChangelogEntry
						date="2026-02-28 00:30"
						title="Frame Extract + Nested Concentric Engines (+2 tasks, 260/400)"
						changes={[
							"frame_extract: rectangular frame detection + interior extraction. Detects uniform-color rectangular frame border and extracts the enclosed interior content. Targets: 1c786137",
							"nested_concentric: concentric rectangular band detection, miniaturized output. Identifies nested concentric color bands and produces a compact representation. Targets: eb5a1d5d",
							"71 inference engines (was 70), 80 router classes (was 79), 260/400 ARC-1 (65.0%)",
							"2,928 tests, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 23:45"
						title="Shape-Centered rot180 Symmetry Completion Engine"
						changes={[
							"symmetry_completion_centered: new inference engine that finds the optimal 180-degree rotation center for a shape and fills missing symmetric pixels with a new color. Unlike the existing symmetry_completion engine (which only uses the grid center), this dynamically finds the best rotation center per input by minimizing required additions. Solves task 1b60fb0c and similar tasks where shapes need rotational symmetry completion about a non-grid-center point.",
							"70 inference engines (was 69), 79 router classes (was 78)",
							"2,894 tests, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 22:30"
						title="Snap to Line + Bug Fixes (+3 tasks, 259/400)"
						changes={[
							"snap_to_line: stray pixels snap to nearest same-color spanning line (full-row/col of uniform color). Non-matching strays removed. Helpers: _detect_spanning_lines, _find_stray_pixels, _snap_pixel_to_line (+1: 1a07d186)",
							"Fixed diagonal_zigzag IndexError: nc could go out-of-bounds after bounce when grid width is 1. Added bounds check after bounce logic",
							"69 inference engines (was 66), 78 router classes (was 75), 259/400 ARC-1 (64.8%), 203 depth-1, 56 depth-2",
							"2,869 tests (+48), 12,756 statements (+180), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-28 08:00"
						title="Phase 4 + Phase 7: Hypothesis Refinement + Hierarchical Grouping"
						changes={[
							"Phase 7: Multi-Scale Perception — new Layer 0.55 in solver pipeline. ObjectGroup/HierarchicalScene types. 5 grouping strategies (containment, same_color, same_shape, alignment, proximity). 5 group operations (extract, filter_keep, filter_remove, per_group_inference, recolor). GroupProgram duck-types Program.",
							"Phase 4: Hypothesis-Refine Loop — HypothesisPool tracks near-miss candidates (>= 75% pixel accuracy). 5 refinement strategies: color remap (ColorRemapProgram), inference post-compose (ComposedRefinedProgram), DSL post-step, pixel correction (PixelCorrectionProgram), transform re-search. Activates after all solver layers fail.",
							"Pipeline integration: HierarchicalSpecialist added to specialist dispatch, solve() creates HypothesisPool and calls refine_hypotheses() as final fallback, 75 router classes (was 74)",
							"2,821 tests (+227), 12,576 statements (+857), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-28 04:30"
						title="Directional Stamp Engine (+1 task, 256/400)"
						changes={[
							"directional_stamp: template shape (largest object) stamped repeatedly in direction indicated by marker objects, recolored to marker color. Per-axis gap computation handles UP/DOWN/LEFT/RIGHT. Clips at grid edges. (+1: 045e512c)",
							"66 inference engines (was 65), 74 router classes (was 73), 256/400 ARC-1 (64.0%), 200 depth-1, 56 depth-2",
							"2,594 tests (+16), 11,719 statements (+83), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-28 01:00"
						title="4 New Marker-Rectangle Engines (+5 tasks, 255/400)"
						changes={[
							"marker_rect_line: markers sharing row/col range with rectangle draw lines from rect edge to marker position (+2: 2c608aff, d43fd935)",
							"marker_rect_color: markers project to nearest rectangle boundary cell, coloring it with marker color (+1: 1f642eb9)",
							"rect_stretch: bordered rectangle (border + interior colors) stretches toward isolated marker, maintaining border/interior pattern (+1: b548a754)",
							"staircase_triangle: horizontal bar generates growing triangle above and shrinking triangle below (+1: a65b410d)",
							"65 inference engines (was 61), 73 router classes (was 69), 255/400 ARC-1 (64.0%), 199 depth-1, 56 depth-2",
							"2,578 tests (+52), 11,636 statements (+319), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 22:00"
						title="6 New Inference Engines (+7 tasks, 250/400)"
						changes={[
							"midpoint_cross: two same-color isolated pixels with even Manhattan distance, draw cross at midpoint with learned color (+1: e9614598)",
							"pixel_count_output: count non-bg pixels, output 1-row grid of that width filled with the input's single non-bg color (+1: d631b094)",
							"spiral_fill: all-zero NxN input → clockwise spiral with learned color. Segment-length algorithm [N, N-1, N-1, N-3, N-3, ...] (+1: 28e73c20)",
							"object_diagonal_extend: L-shapes (3 in 2x2) or 2x2 core + protrusions trace diagonals from missing corners. 8-connectivity detection (+2: 7ddcd7ec, 6e19193c)",
							"enclosure_project: wall/content color auto-detection via bbox sparsity heuristic, corner-bend detection for diagonal projection (+1: ec883f72)",
							"block_diagonal_pair: two different-color 2x2 blocks extend diagonal traces from corners, learns color→direction mapping (+1: 5c0a986e)",
							"61 inference engines (was 55), 69 router classes (was 63), 250/400 ARC-1 (62.5%), 194 depth-1, 56 depth-2",
							"2,526 tests (+80), 11,317 statements (+421), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 18:00"
						title="Phase 5: Strategy Memory (242/400)"
						changes={[
							"New src/memory/ package: strategy store for recalling solved program templates on similar tasks",
							"64-dim feature vectors: grid stats (dims, colors, objects, symmetry, constraints, diffs, shape, histogram) for cosine similarity matching",
							"Template extraction: abstract DSL programs, rule programs, and transform DSL programs into re-parameterizable templates",
							"Re-parameterization: enumerate param combos for DSL steps, predicate values for rules, dispatch for method hints. Max 200 verify calls per template, 5 templates recalled",
							"StrategyStore: JSONL persistence, cosine similarity recall with top_k and min_sim thresholds, leave-one-out by task_id",
							"Layer -1 in hybrid solver: strategy memory recall before all other solver layers",
							"benchmark.py: --store-strategies and --use-strategies CLI flags for populating and recalling strategies",
							"2,446 tests (+92), 10,896 statements (+488), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 14:00"
						title="Phase 4: Hypothesis-Refine Loop (242/400)"
						changes={[
							"suggest_selector_fix: identifies over-selected objects by reverting modifications and measuring pixel improvement",
							"_refine_selector: tightens selectors on near-perfect candidates (95%+) via IntersectionSelector(original, Complement(exclusion_pred)) from property analysis",
							"_refine_color: generates targeted color-fix completions from failure analysis — consistent missing colors produce RecolorAction/FillBBoxAction/ConnectAction steps",
							"Integrated into _try_config after 2-step composition: selector tightening + color fix on top-10 partials scoring >= 0.95",
							"242/400 ARC-1 (60.5%, no regression), infrastructure for converting near-misses to solves",
							"2,446 tests (+18), 10,408 statements (+130), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 10:00"
						title="Phase 3c: UnionSelector + ConnectAction + FillRowColAction (242/400)"
						changes={[
							"UnionSelector: OR-combine multiple ByPropertySelectors for broader object selection. Pairwise union from subset selectors (strict subset of targets). 6 selector types total (was 5)",
							"ConnectAction: fill bg cells between same-color objects along horizontal/vertical/both axes. Pattern detection for additive + same_dims tasks",
							"FillRowColAction: broadcast seed objects to fill entire rows/cols/crosses with resolved color. Seed detection via row/col overlap with added pixels",
							"Pattern classification: connect_pattern and fill_row_col_pattern added under additive + same_dims condition",
							"242/400 ARC-1 (60.5%, no regression), 9 tdsl-solved tasks",
							"2,336 tests (+36), 10,278 statements (+192), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 21:00"
						title="Phase 3b: IntersectionSelector + gt/lt Ops + PropertyColor (242/400)"
						changes={[
							"IntersectionSelector: AND-combine multiple ByPropertySelectors for fine-grained object discrimination (e.g., size==1 AND color!=3). Superset detection + pairwise intersection search with 50-selector cap",
							"gt/lt threshold ops in selector generation: boundary values (val-1, val+1) enable >= and <= semantics. 5-value cap per property",
							"PropertyColor generation: relational recoloring via ADJACENT_4/8, CONTAINS, SAME_SHAPE relations. Added to both recolor and fill_bbox candidate generators",
							"IntersectionSelector used as fallback when single-predicate selectors fail to match targets exactly",
							"242/400 ARC-1 (60.5%, no regression), 9 tdsl-solved tasks",
							"2,300 tests (+14), 10,086 statements (+92), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 19:30"
						title="Phase 3a.1: Move/Extract/Completion (+1 task, 242/400)"
						changes={[
							"ExtractAction: crop grid to union bbox of selected objects, zeroing non-selected cells. Enables shape-changing transforms in the DSL",
							"Move candidate generation: literal displacement (all objects same offset), property-based displacement (different offsets per property value), gravity displacement (cardinal direction slide). Parallel to _gen_copy_candidates",
							"Extract candidate generation: match output shape to single-object bbox crops, verify across all training pairs",
							"move_pattern + extract_pattern classification in _classify_transform_patterns",
							"Completion improvements: brute-force fallback with AllSelector + RecolorAction/FillBBoxAction for residual colors",
							"Shape mismatch guard in _generate_completions prevents crash on extract partial steps",
							"242/400 ARC-1 (60.5%, +1 from 241), 186 depth-1, 56 depth-2",
							"2,286 tests (+23), 9,994 statements (+169), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 16:00"
						title="Phase 3a: Scene Transform DSL"
						changes={[
							"New Layer 0.67: general transformation language over SceneGraphs, between rule induction and inference engines",
							"transform_dsl.py: frozen dataclass grammar — Step, Selector (All/ByProperty/ByRelation/Complement), Action (Recolor/Move/Remove/Copy/FillEnclosed/FillBBox), ColorFn, DisplacementFn, TransformProgram",
							"transform_selectors.py: evaluate_selector dispatches ByProperty (reuses rule_search predicates), ByRelation (traverse scene graph), Complement (invert)",
							"transform_actions.py: apply_action with gravity displacement (4 dirs + obstacle stopping), property-based color/offset resolution via scene relations, FillEnclosed (BFS), FillBBox",
							"transform_search.py: diff-driven candidate generation (recolor/move/remove/copy/fill patterns), partial match ranking, 2-step composition from top-25 partials",
							"TransformDslProgram duck-types Program (execute/verify), TransformDslSpecialist in specialist pipeline",
							"63 router classes (was 62): 55 inference + 6 analytical + 2 special",
							"2,263 tests (+131), 9,825 statements (+728), 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-27 00:30"
						title="Generalization Plan Rewrite: Phases 3-8"
						changes={[
							"Replaced incremental Phase 3-4 plan (template cache + adaptive controller) with 6-phase learning-based architecture",
							"Phase 3: Scene Transform DSL — general transformation language over SceneGraphs with diff-driven program synthesis (+15-30 tasks)",
							"Phase 4: Hypothesis-Refine Loop — structured failure analysis feeds back into search (+5-10 tasks)",
							"Phase 5: MAST-backed strategy memory — store/recall via 64-dim engineered features, compaction tiers (+5-10 tasks)",
							"Phases 6-8: Transfer abstraction, multi-scale perception, ARC-3 interactive agent",
							"Conservative target: 280/400 (70%) after Phase 5",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 23:30"
						title="Phase 2b: Extended Rule Induction (+3 tasks, 241/400)"
						changes={[
							"8 new shape properties: is_unique_shape, shape_frequency, shape_complexity, bbox_height, bbox_width, elongation, is_symmetric_h, is_symmetric_v (25 total, was 17)",
							"sort_by action: reorder objects spatially by a property (e.g., sort by color, size_rank). Detects MOVED patterns in scene diffs",
							"move_by_property action: displace objects by property-dependent offsets (e.g., color 1 → shift right 2). Learns displacement_map from diffs",
							"fill_by_property action: seed objects broadcast color to fill rows/cols/crosses. Detects additive patterns with added_pixels",
							"8 action kinds total (was 5): filter_keep, filter_remove, extract, recolor_to, classify, sort_by, move_by_property, fill_by_property",
							"241/400 ARC-1 (60.2%, +3 from 238), 184 depth-1, 57 depth-2",
							"2,132 tests (+74), 9,097 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 21:00"
						title="Phase 2: Relational Rule Induction"
						changes={[
							"New Layer 0.65: Rule induction between relational perception and inference engines",
							"src/reasoning/properties.py: 17 object properties (intrinsic/relational/ranking)",
							"src/reasoning/rule_grammar.py: Predicate + Action + RelationalRule frozen dataclasses",
							"src/reasoning/rule_search.py: Change pattern classification, ~190 candidate rules, verify against all pairs",
							"5 action kinds: filter_keep, filter_remove, extract, recolor_to, classify",
							"RuleInductionSpecialist in specialist pipeline, added to hybrid solver + router",
							"62 router classes (was 61): 55 inference + 5 analytical + 2 special",
							"238/400 ARC-1 (59.5%, +2): b2862040 and e509e548 solved by recolor_to rules",
							"O(n^2) guard: skip scenes with >50 objects to prevent slowdowns",
							"2,058 tests (+126), 8,819 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 19:30"
						title="Constraint Pruning Phase 1.5: Enforce OutputColorsSubset + Additive"
						changes={[
							"OutputColorsSubset enforcement in _violates_constraints: prunes intermediate grids with colors not in any training input",
							"Additive constraint in select_primitives: excludes destructive primitives (remove_color, remove_smallest, remove_largest, fill_background, most_common_fill, keep_color)",
							"OutputColorsSubset in select_primitives: excludes color-introducing primitives (outline_objects, outline_objects_diagonal, expand_pixels, draw_border, fill_enclosed, fill_background)",
							"all_input_colors field on ConstraintSet populated from training input color union",
							"Constraints threaded to solve_compositional and solve_inference_chain via specialist wrappers",
							"236/400 ARC-1 (59.0%) — search pruning only, no new solves but faster convergence",
							"1,932 tests, 8,349 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 18:45"
						title="Constraint Extraction & Counterexample Learning (Phase 1)"
						changes={[
							"New src/reasoning/constraints.py: extract 9 constraint types from task pairs (SameShape, FixedOutputShape, ColorPreserved, ColorAbsent, ColorIntroduced, Additive, BgPreserved, ObjectCountPreserved, OutputColorsSubset)",
							"ConstraintSet with has()/get() for fast lookup, frozen/hashable for caching",
							"New src/reasoning/counterexamples.py: structured failure analysis (shape mismatch, pixel diffs, excess/missing colors, position-vs-color error rates)",
							"Constraints extracted once at solve() top, threaded through SpecialistContext to all solver layers",
							"_violates_constraints() in A* search, beam search, and policy beam: prunes intermediate grids containing absent colors",
							"constraints param added to search_program(), solve_inference(), _expand_node(), _expand_node_policy()",
							"All params None-defaulted: zero behavior change when absent, fully backward compatible",
							"1,922 tests, 8,341 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-26 14:30"
						title="Inference Chain Solver + 2 New Engines (+3 tasks, 236/400)"
						changes={[
							"Inference-to-inference compositional chaining: try all 55 engines as step1, run remaining 54 as step2 on intermediate result. Enables two-step analytical transforms without DSL search (+3 tasks)",
							"InferenceChainProgram: duck-types Program, chains step1.execute -> step2.execute with full verify",
							"solve_inference exclude parameter: prevents identity loops (engine A -> engine A) in chain search",
							"recolor_to_closest: recolor target-color pixels to nearest non-target anchor by Manhattan distance",
							"drag_from_marker: 2-color multicolor objects with directional marker, drag/trace to grid boundary",
							"New InferenceChainSpecialist in specialist dispatch, added to fixed solver priority order",
							"236/400 ARC-1 (59.0%), 176 depth-1, 60 depth-2",
							"1,867 tests, 8,176 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-25 15:22"
						title="4 More Inference Engines (+1 task, 233/400)"
						changes={[
							"diagonal_trace: multi-seed diagonal traces with extend/bounce_all modes, row+col boundary bouncing, edge/obstacle stop modes",
							"rotated_stamp: stamp template with per-seed rotation based on position (quadrant or fixed rule), extends stamp_template with D4 transforms (+1: d364b489)",
							"neighbor_recolor: recolor pixels based on abstract neighbor-count conditions (has_adjacent, count_ge, surrounded, no_adjacent) — generalizes beyond pixel_rules' exact feature lookup",
							"legend_substitution: detect legend/key region separated by uniform row/col, extract color-to-shape mappings, substitute markers in target region",
							"233/400 ARC-1 (58.2%), 173 depth-1, 60 depth-2",
							"1,834 tests, 7,965 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-25 22:00"
						title="4 New Inference Engines (+1 task, 232/400)"
						changes={[
							"mirror_concat: detect output as concatenation of flipped/rotated input copies (vertical, horizontal, 2x2 grid layouts with 7 transform types)",
							"grid_cell_rule: separator-based grid detection with per-cell coloring via position mapping or content classification strategies",
							"seed_broadcast: sparse seed pixels (<=8 non-bg) broadcast to fill entire rows, columns, or crosses",
							"damage_repair: detect rectangular 'damaged' regions and reconstruct using symmetry (h/v/rot180) or tile-based pattern repair",
							"Fixed pair_period_broadcast to determine axis at runtime per pair instead of fixed axis from first pair",
							"232/400 ARC-1 (58.0%), 172 depth-1, 60 depth-2",
							"1,749 tests, 7,524 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-25 12:00"
						title="2 New Inference Engines (+4 tasks, 231/400)"
						changes={[
							"connect_over_bg: connect same-colored pixels along axes (h/v/d1/d2/both/both_diag) overwriting only background cells, with optional exclude-most-common-color mode for ignoring grid lines (+4 tasks)",
							"pattern_continuation: detect repeating 2D tile period in output, solve input-to-tile mapping, extend pattern to fill output grid",
							"231/400 ARC-1 (57.8%), 171 depth-1, 60 depth-2",
							"1,686 tests, 7,053 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-24 22:00"
						title="Object Solver: SLIDE Transform + Compositional Solver (+49 tasks, 227/400)"
						changes={[
							"SLIDE transform in object solver: objects slide in a cardinal direction until hitting an obstacle or grid edge. Handles 'walls + movers' patterns where each mover stops at a different distance. 3-phase apply_rules: non-SLIDE rules first, copy static walls, then SLIDE rules sorted by proximity to wall",
							"Per-object inference fallback: when check_consistency fails, groups objects by selector and runs mini inference solver per group. Falls back to infer_transform for single-step transforms",
							"Compositional solver: combines inference + DSL search for multi-step compositional solutions",
							"Specialist wrappers: thin protocol-based dispatch (identity, object, grid, relational, inference, compositional, DSL) replaces fixed priority list as default solver path",
							"227/400 ARC-1 (56.8%), 166 depth-1, 61 depth-2",
							"1,679 tests, 6,897 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-24 17:00"
						title="Tile Recolor + Upscale Extension (+3 tasks, 178/400)"
						changes={[
							"tile_recolor: tile input 2x2, conditionally recolor bg cells via column_aware/diagonal_adjacency/row_aware strategies (+2: f5b8619d, 10fcaaa3)",
							"Upscale color_count rule: scale factor = number of distinct non-bg colors per pair (+1: b91ae062)",
							"gap_fill: fill bg gaps between same-color cells on same row/column with learned fill color (a699fb00 already solved by relational perception)",
							"178/400 ARC-1 (44.5%), 42 inference engines, 48 router classes",
							"1,622 tests, 6,546 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-24 10:00"
						title="4 New Inference Engines (+4 tasks, 175/400)"
						changes={[
							"pair_rectangle_fill: group same-color isolated cells, fill bounding rectangle between each pair (+1: 56ff96f3)",
							"diagonal_zigzag: seed cell at grid edge bounces diagonally, optional bg fill color (+2: a3df8b1e, e179c5f4)",
							"staircase_fill: 1-row input with N leading colored cells produces N-row staircase (growing/shrinking modes)",
							"row_period_fill: same-dims grids, extend each row's active portion period to fill trailing zeros (+1: d8c310e9)",
							"175/400 ARC-1 (43.8%), 40 inference engines, 46 router classes",
							"1,594 tests, 6,423 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-23 12:00"
						title="3 New Inference Engines (+2 tasks, 171/400)"
						changes={[
							"bbox_complement_fill: fill bg cells within each object's bounding box with a learned color",
							"col_period_extend: extend columns by repeating their smallest period, with optional global color remapping",
							"rigid_shift: translate all non-bg content by a fixed (dr, dc) offset",
							"171/400 ARC-1 (42.8%), 36 inference engines total",
							"1,548 tests, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-22 11:00"
						title="DSL Search Pruning Improvements"
						changes={[
							"BUG FIX: Added filter_params to A* inner loop (was only applied in beam search helpers). Eliminates ~25-30% of param combos per A* node expansion",
							"Multi-pair early rejection in A* and regular beam search at depth >= 2: rejects candidates whose secondary pair diff worsens vs parent, with visited hash unblocking",
							"Target-dimension pruning: filter_params now prunes overlay_subgrids (189->1-3 params), tile (8->0-1), upscale (2->0-1) by output dimensions",
							"Extended pruning constants: gravity primitives added to idempotent set, flip_h+flip_v added to cancel pairs (= rotate_180)",
							"1,505 tests, 6,031 statements, 100% coverage maintained",
						]}
					/>
					<ChangelogEntry
						date="2026-02-22 04:30"
						title="Parallel Beam Search + 6 New Inference Engines"
						changes={[
							"Extracted _expand_node and _expand_node_policy pure helpers for thread-safe beam node expansion",
							"Parallelized _beam_search_fallback and _policy_beam_search via ThreadPoolExecutor with snapshot-based dedup",
							"parallel_workers param threaded: search_program -> hybrid_solver -> specialists -> benchmark.py --search-workers N",
							"6 new inference engines: diagonal_stamp, row_period_extend, object_outline, translate_to_target, pattern_substitution, raycast_from_marker",
							"169/400 ARC-1 (42.2%), depth 3, 10s timeout",
							"157 depth-1, 10 depth-2, 2 depth-3",
						]}
					/>
					<ChangelogEntry
						date="2026-02-22 03:30"
						title="Phase A Batch 1: +4 tasks (169/400, 42.2%)"
						changes={[
							"Fixed _try_tile_transform: try all reference pairs (pair 0 can be symmetric). +2: 46442a0e, 8d5021e8",
							"New engine: _try_diagonal_stamp — partial-stamp clipping, output size as ratio/fixed/dynamic. +1: d13f3404",
							"New engine: _try_row_period_extend — truncated period support (row length not divisible by period). +1: 963e52fc",
							"_apply_diagonal_stamp clips OOB pixels, max n_copies formula for partial stamps",
							"_find_row_period handles truncated tiles where row[:p] tiled+truncated reproduces row",
							"Router: RuntimeError catch on load_state_dict, negative caching, full DEFAULT_ORDER",
							"29 inference engines, 35 router classes, 1,431 tests, 5,660 statements",
						]}
					/>
					<ChangelogEntry
						date="2026-02-22 00:45"
						title="PATTERNS.md Weekly Ops Snapshot Added"
						changes={[
							"Added a lightweight weekly sprint-board header to PATTERNS.md with current focus, owner, last benchmark, last updated date, and next checkpoint",
							"Added update cadence notes so the pattern document doubles as a live execution tracker rather than static analysis",
							"Aligned current focus to mirror_concat implementation for immediate Phase A work tracking",
						]}
					/>
					<ChangelogEntry
						date="2026-02-22 00:35"
						title="PATTERNS.md Refactored Into Execution Board"
						changes={[
							"Converted unsolved-pattern notes into an execution backlog table with status, confidence, effort, acceptance criteria, and regression risk per engine/fix",
							"Promoted mirror_concat as an explicit in-progress top-priority candidate in the composition cluster",
							"Kept all existing task-level analysis while making the document trackable for weekly implementation planning and benchmark attribution",
						]}
					/>
					<ChangelogEntry
						date="2026-02-22 00:20"
						title="Specialist Path Set As Default"
						changes={[
							"Updated hybrid solver default to use specialist-wrapper dispatch path (use_specialists=True by default)",
							"Kept legacy direct dispatch path available via use_specialists=False for parity checks and safe rollback",
							"Updated hybrid solver tests so legacy assertions explicitly opt out while specialist tests now validate default behavior",
						]}
					/>
					<ChangelogEntry
						date="2026-02-22 00:10"
						title="Phase B Started: Specialist Wrappers (Thin, Opt-In)"
						changes={[
							"Added src/reasoning/specialists/ contracts and static wrappers (identity, object, grid, relational, inference, dsl) around existing solver functions",
							"Added optional solve(..., use_specialists=True) protocol runner path in hybrid solver while preserving default fixed-priority behavior",
							"Added specialist-path tests for fixed and router-driven execution to ensure low-risk parity scaffolding",
						]}
					/>
					<ChangelogEntry
						date="2026-02-21 23:55"
						title="SPEC Updated: Solve-First Sequencing"
						changes={[
							"Revised SPEC.md roadmap to prioritize immediate pattern-engine wins before orchestration-heavy architecture work",
							"Set active sequence: mirror_concat/damage_repair/diagonal_trace engines first, then thin specialist wrappers, then counterexample learning",
							"Deferred full blackboard/controller/memory/ARC-3 work behind explicit plateau gates (or ARC-1 > 200 solved)",
						]}
					/>
					<ChangelogEntry
						date="2026-02-21 23:45"
						title="Dynamic Reasoning Engine SPEC Authored"
						changes={[
							"Added implementation-ready SPEC.md defining unified IR, blackboard controller, specialist protocol, verifier loop, memory architecture, and ARC-3 causal planning design",
							"Added concrete module contracts and interfaces to guide refactor from fixed solver pipeline to adaptive orchestration",
							"Added roadmap with acceptance gates, deterministic evaluation protocol, and ticketized immediate next steps",
						]}
					/>
					<ChangelogEntry
						date="2026-02-21 23:30"
						title="Unsolved Task Analysis + ARC-2 Benchmark"
						changes={[
							"ARC-2 training benchmark: 260/1000 (26.0%), up from 177/1000 (17.7%) after pipeline fix + recolor improvements",
							"Analyzed 90 of 235 unsolved ARC-1 tasks: top clusters are pattern continuation (21%), mirror concat (17%), conditional fill (14%)",
							"Identified 4 priority engines: mirror concat (~10-15), damage repair (~5-8), diagonal trace (~5-7), rotated stamp (~4-6)",
						]}
					/>
					<ChangelogEntry
						date="2026-02-21 21:15"
						title="Removed LLM Layers From Solver Pipeline"
						changes={[
							"Deleted src/llm package and all LLM-only tests (generator, prompts, sandbox, scorer, refiner, grid_format)",
							"Removed llm_dsl and llm_python from router classes/default order and from hybrid solver dispatch",
							"SolveResult no longer carries python_code; runtime now returns Program-only solve results",
							"Added explicit identity dispatch path and empty-train-pair guard in hybrid solver",
						]}
					/>
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
	type: "analytical" | "search";
}) {
	const typeColor = {
		analytical: "text-emerald-400/70",
		search: "text-amber-400/70",
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
