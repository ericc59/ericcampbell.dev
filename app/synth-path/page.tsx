import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "SynthPath",
	description:
		"Pattern-learning ARC solver. This system is a neural guided program synthesis solver that learns reusable patterns from solved tasks and compounds them across rounds.",
};

const ARC = [
	"#111",
	"#1e93ff",
	"#f93c31",
	"#4fcc30",
	"#ffdc00",
	"#999",
	"#e53aa3",
	"#ff851b",
	"#87ceeb",
	"#8b0000",
];

const LOGO_INDICES = [1, 8, 3, 4, 2, 6, 7, 9];

const INPUT: number[][] = [
	[0, 0, 0, 0, 3],
	[0, 0, 0, 3, 0],
	[0, 0, 3, 0, 0],
	[0, 3, 0, 0, 0],
	[3, 0, 0, 0, 0],
];

const OUTPUT: number[][] = [
	[1, 0, 0, 0, 3],
	[0, 1, 0, 3, 0],
	[0, 0, 3, 0, 0],
	[0, 3, 0, 1, 0],
	[3, 0, 0, 0, 1],
];

const CHANGED = new Set(["0-0", "1-1", "3-3", "4-4"]);

const pipeline = [
	{ step: "perceive", desc: "build scene graph, 64-dim feature vector" },
	{ step: "recall", desc: "cosine similarity against pattern library" },
	{ step: "apply", desc: "guard \u2192 bind \u2192 body \u2192 verify" },
	{ step: "search", desc: "beam search with candidate generators" },
	{ step: "extract", desc: "group solutions, anti-unify, validate" },
	{ step: "learn", desc: "add new patterns to library for next round" },
];

const candidates: Record<string, string[]> = {
	global: [
		"flip-h",
		"flip-v",
		"rotate-90",
		"rotate-180",
		"rotate-270",
		"transpose",
	],
	color: [
		"color-remap",
		"object-recolor",
		"object-removal",
		"recolor-by-property",
	],
	object: [
		"object-transform",
		"per-object-mirror-rotate",
		"sort-objects",
		"extract-unique-object",
		"neighbor-recolor",
		"object-solver",
	],
	extraction: [
		"crop-content",
		"extract-by-role",
		"frame-interior",
		"minority-extraction",
		"damage-extract",
	],
	spatial: [
		"symmetry-completion",
		"fill-enclosed",
		"connect-same-color",
		"gravity",
		"cross-fill",
		"line-extension",
		"border-outline",
		"flood-fill",
		"diagonal-connect",
		"cross-extension",
		"gravity-align",
		"gap-fill",
		"rigid-shift",
		"directed-cross",
		"gravity-fill",
		"bbox-complement-fill",
		"translate-to-target",
		"connect-over-bg",
		"recolor-to-closest",
		"diagonal-stamp",
		"object-outline",
		"row-period-fill",
		"row-period-extend",
		"col-period-extend",
		"pattern-substitution",
		"morpho-grow",
		"morpho-shrink",
	],
	structural: [
		"tile",
		"stamp-template",
		"grid-decompose",
		"pixel-rules",
		"additive-extension",
		"pattern-continuation",
		"hollow-rect",
		"damage-repair",
		"upscale",
	],
	"role-aware": [
		"stamp-template-at-markers",
		"template-recolor-at-markers",
		"frame-fill",
		"separator-grid-ops",
		"legend-mapping",
	],
};

const totalCandidates = Object.values(candidates).flat().length;

const patternDSL = {
	guard: [
		"SAME_DIMS",
		"DIFFERENT_DIMS",
		"MIN_OBJECTS",
		"MAX_OBJECTS",
		"HAS_COLOR_CHANGE",
		"HAS_SYMMETRY",
		"HAS_SEPARATOR",
		"HAS_MARKERS",
		"IS_ADDITIVE",
		"OBJECTS_VARY_BY",
		"AND",
		"OR",
		"NOT",
	],
	bind: [
		"CONSTANT",
		"BACKGROUND_COLOR",
		"ALL_OBJECTS",
		"FILTER_OBJECTS",
		"PROPERTY",
		"RANK_BY",
		"LEARN_COLOR_MAP",
		"DIFF_COLORS",
		"UNIQUE_IN_OUTPUT",
		"MARKER_POSITIONS",
	],
	body: [
		"RECOLOR",
		"REMOVE",
		"MOVE",
		"MIRROR_OBJ",
		"ROTATE_OBJ",
		"MIRROR_GRID",
		"ROTATE_GRID",
		"TRANSPOSE",
		"GRAVITY",
		"FILL_ENCLOSED",
		"FLOOD_FILL",
		"EXTEND_LINE",
		"CONNECT",
		"CROP_CONTENT",
		"TILE",
		"FOLD_SYMMETRY",
		"GRID_DECOMPOSE",
		"FOR_EACH",
		"SEQUENCE",
		"CONDITIONAL",
		"LOOKUP",
		"UPSCALE_BLOCK",
		"EXTRACT_BY_PREDICATE",
		"STAMP_AT_MARKERS",
		"SEPARATOR_SUMMARY",
		"COLOR_SUBSTITUTE",
		"STACK_CONCAT",
		"DRAW_LINE",
		"RIGID_SHIFT",
		"DAMAGE_REPAIR",
		"PATTERN_EXTEND",
		"NEIGHBOR_RULE",
		"SLIDE_TO_WALL",
		"COUNT_ENCODE",
	],
};

const perception = {
	roles: ["FRAME", "SEPARATOR", "MARKER", "TEMPLATE", "LEGEND", "CONTENT"],
	relations: [
		"ADJACENT_4",
		"ADJACENT_8",
		"CONTAINS",
		"SAME_ROW",
		"SAME_COL",
		"SAME_COLOR",
		"SAME_SHAPE",
		"ALIGNED_H",
		"ALIGNED_V",
		"ABOVE",
		"BELOW",
		"LEFT_OF",
		"RIGHT_OF",
		"INSIDE",
	],
	properties: [
		"n_input_colors",
		"n_output_colors",
		"background_color",
		"n_nonbg_colors",
		"n_objects",
		"h_ratio",
		"w_ratio",
		"has_symmetry",
		"tile_mirror",
		"max_object_size",
		"min_object_size",
		"smallest_object_color",
		"largest_object_color",
		"most_frequent_input_color",
		"least_frequent_input_color",
		"color_only_in_input",
		"unique_output_color",
		"changed_color",
		"selector_hint",
	],
};

function ArcGrid({
	data,
	size = 18,
	offset = 0,
	highlight,
}: {
	data: number[][];
	size?: number;
	offset?: number;
	highlight?: Set<string>;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${data[0].length}, ${size}px)`,
				gap: "2px",
			}}
		>
			{data.flatMap((row, r) =>
				row.map((v, c) => {
					const delay = offset + (r * row.length + c) * 40;
					const changed = highlight?.has(`${r}-${c}`);
					return (
						<div
							key={`${r}-${c}`}
							className="eg2-cell"
							style={{
								width: size,
								height: size,
								backgroundColor: ARC[v],
								animationDelay: `${delay}ms`,
								...(changed
									? {
											animationName: "eg2-cell-appear, eg2-cell-glow",
											animationDuration: "0.3s, 0.8s",
											animationTimingFunction: "ease-out, ease-in-out",
										}
									: {}),
							}}
						/>
					);
				}),
			)}
		</div>
	);
}

function Tags({ items }: { items: string[] }) {
	return (
		<div className="flex flex-wrap gap-[3px]">
			{items.map((item) => (
				<span key={item} className="eg2-tag">
					{item}
				</span>
			))}
		</div>
	);
}

export default function Ericagi2Page() {
	return (
		<>
			<style>{`
				.eg2-breakout {
					width: 100vw;
					margin-left: calc(-50vw + 50%);
					display: flex;
					justify-content: center;
				}
				.eg2 {
					--accent: #e53aa3;
					--fg: #e4e4e7;
					--text: #a1a1aa;
					--muted: #71717a;
					--dim: #52525b;
					--border: #27272a;
					--surface: rgba(24, 24, 27, 0.5);
					max-width: 56rem;
					width: 100%;
					padding: 0 1.5rem;
				}

				@keyframes eg2-cell-appear {
					from { opacity: 0; transform: scale(0); }
					to { opacity: 1; transform: scale(1); }
				}
				@keyframes eg2-cell-glow {
					0%, 100% { filter: brightness(1); }
					40% { filter: brightness(2.2); }
				}
				.eg2-cell {
					animation: eg2-cell-appear 0.3s ease-out both;
				}

				@keyframes eg2-fade-up {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.eg2-fade { animation: eg2-fade-up 0.5s ease-out both; }

				.eg2-link { color: var(--accent); transition: color 0.15s; text-decoration: none; }
				.eg2-link:hover { color: #f472b6; }

				.eg2-label {
					font-size: 10px;
					text-transform: uppercase;
					letter-spacing: 0.2em;
					color: var(--muted);
				}

				.eg2-section-title {
					font-size: 11px;
					text-transform: uppercase;
					letter-spacing: 0.2em;
					font-weight: 500;
					color: var(--text);
				}

				.eg2-divider {
					height: 1px;
					background: var(--border);
				}

				.eg2-tag {
					display: inline-block;
					font-size: 10px;
					letter-spacing: 0.04em;
					padding: 3px 7px;
					border: 1px solid var(--border);
					color: var(--text);
					white-space: nowrap;
				}

				.eg2-cat {
					font-size: 10px;
					text-transform: uppercase;
					letter-spacing: 0.15em;
					color: var(--accent);
					width: 6.5rem;
					flex-shrink: 0;
					padding-top: 3px;
				}

				.eg2-count {
					font-size: 10px;
					color: var(--accent);
					font-weight: 500;
				}
			`}</style>

			<div className="eg2-breakout">
				<section
					className="eg2"
					style={{
						background:
							"radial-gradient(ellipse at 40% 8%, rgba(229,58,163,0.03) 0%, transparent 55%)",
					}}
				>
					{/* ARC logo mark */}
					<div className="eg2-fade">
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(4, 8px)",
								gap: "2px",
							}}
						>
							{LOGO_INDICES.map((ci, i) => (
								<div
									key={i}
									style={{
										width: 8,
										height: 8,
										backgroundColor: ARC[ci],
									}}
								/>
							))}
						</div>
					</div>

					{/* Title */}
					<div className="mt-5 eg2-fade" style={{ animationDelay: "50ms" }}>
						<h1
							className="text-xl font-medium tracking-tight"
							style={{ color: "var(--fg)" }}
						>
							SynthPath
						</h1>
						<p
							className="mt-2 text-sm leading-relaxed"
							style={{ color: "var(--text)", maxWidth: "32rem" }}
						>
							Pattern-learning ARC solver. This system is a neural guided
							program synthesis solver that learns reusable patterns from solved
							tasks and compounds them across rounds.
						</p>
					</div>

					<div
						className="eg2-divider mt-10 eg2-fade"
						style={{ animationDelay: "150ms" }}
					/>

					{/* Stats */}
					<div className="mt-8 eg2-fade" style={{ animationDelay: "250ms" }}>
						<div className="grid grid-cols-3 gap-2">
							{(
								[
									["92/400", "TRAIN"],
									["8/400", "EVAL"],
									["~14s", "TIME"],
								] as const
							).map(([val, label]) => (
								<div
									key={label}
									style={{
										border: "1px solid var(--border)",
										background: "var(--surface)",
										padding: "10px 12px",
									}}
								>
									<p
										className="text-sm font-medium tabular-nums"
										style={{ color: "var(--fg)" }}
									>
										{val}
									</p>
									<p className="mt-0.5 eg2-label">{label}</p>
								</div>
							))}
						</div>
					</div>

					<div
						className="eg2-divider mt-8 eg2-fade"
						style={{ animationDelay: "300ms" }}
					/>

					{/* Pipeline */}
					<div className="mt-8 eg2-fade" style={{ animationDelay: "350ms" }}>
						<p className="eg2-section-title">PIPELINE</p>
						<div className="mt-4 space-y-0">
							{pipeline.map((p, i) => (
								<div
									key={p.step}
									className="flex items-baseline gap-4"
									style={{
										padding: "6px 0",
										borderBottom:
											i < pipeline.length - 1
												? "1px solid var(--border)"
												: "none",
									}}
								>
									<span
										className="text-[10px] tabular-nums font-medium"
										style={{
											color: "var(--accent)",
											width: "14px",
										}}
									>
										{String(i + 1).padStart(2, "0")}
									</span>
									<span
										className="text-xs font-medium shrink-0"
										style={{
											color: "var(--fg)",
											width: "4.5rem",
										}}
									>
										{p.step}
									</span>
									<span className="text-xs" style={{ color: "var(--text)" }}>
										{p.desc}
									</span>
								</div>
							))}
						</div>
					</div>

					<div
						className="eg2-divider mt-8 eg2-fade"
						style={{ animationDelay: "400ms" }}
					/>

					{/* Perception */}
					<div className="mt-8 eg2-fade" style={{ animationDelay: "450ms" }}>
						<div className="flex items-baseline justify-between">
							<p className="eg2-section-title">PERCEPTION</p>
							<span className="eg2-count">
								{perception.roles.length +
									perception.relations.length +
									perception.properties.length}
							</span>
						</div>
						<p
							className="mt-2 text-xs leading-relaxed"
							style={{ color: "var(--muted)", maxWidth: "36rem" }}
						>
							Each grid is parsed into a scene graph: objects detected via
							connected components, classified by role, linked by spatial
							relations, and summarized as a 64-dim feature vector for library
							recall. Hierarchical mode detects separator-partitioned grids
							and builds per-cell sub-scenes for cell-summary tasks.
						</p>
						<div className="mt-4 space-y-3">
							<div className="flex gap-3">
								<span className="eg2-cat">
									roles{" "}
									<span className="eg2-count">{perception.roles.length}</span>
								</span>
								<Tags items={perception.roles} />
							</div>
							<div className="flex gap-3">
								<span className="eg2-cat">
									relations{" "}
									<span className="eg2-count">
										{perception.relations.length}
									</span>
								</span>
								<Tags items={perception.relations} />
							</div>
							<div className="flex gap-3">
								<span className="eg2-cat">
									properties{" "}
									<span className="eg2-count">
										{perception.properties.length}
									</span>
								</span>
								<Tags items={perception.properties} />
							</div>
						</div>
					</div>

					<div
						className="eg2-divider mt-8 eg2-fade"
						style={{ animationDelay: "500ms" }}
					/>

					{/* Candidate Generators */}
					<div className="mt-8 eg2-fade" style={{ animationDelay: "550ms" }}>
						<div className="flex items-baseline justify-between">
							<p className="eg2-section-title">CANDIDATE GENERATORS</p>
							<span className="eg2-count">{totalCandidates}</span>
						</div>
						<p
							className="mt-2 text-xs leading-relaxed"
							style={{ color: "var(--muted)", maxWidth: "36rem" }}
						>
							When no library pattern matches, beam search tries these
							generators. Each proposes candidate actions scored by minimum
							description length.
						</p>
						<div className="mt-4 space-y-3">
							{Object.entries(candidates).map(([cat, items]) => (
								<div key={cat} className="flex gap-3">
									<span className="eg2-cat">
										{cat} <span className="eg2-count">{items.length}</span>
									</span>
									<Tags items={items} />
								</div>
							))}
						</div>
					</div>

					<div
						className="eg2-divider mt-8 eg2-fade"
						style={{ animationDelay: "600ms" }}
					/>

					{/* Pattern DSL */}
					<div className="mt-8 eg2-fade" style={{ animationDelay: "650ms" }}>
						<div className="flex items-baseline justify-between">
							<p className="eg2-section-title">PATTERN DSL</p>
							<span className="eg2-count">
								{patternDSL.guard.length +
									patternDSL.bind.length +
									patternDSL.body.length}
							</span>
						</div>
						<p
							className="mt-2 text-xs leading-relaxed"
							style={{ color: "var(--muted)", maxWidth: "36rem" }}
						>
							Learned patterns are stored as guard \u2192 bind \u2192 body
							programs. Guards check preconditions, binds extract task-specific
							values, and the body applies parameterized actions.
						</p>
						<div className="mt-4 space-y-3">
							<div className="flex gap-3">
								<span className="eg2-cat">
									guard{" "}
									<span className="eg2-count">{patternDSL.guard.length}</span>
								</span>
								<Tags items={patternDSL.guard} />
							</div>
							<div className="flex gap-3">
								<span className="eg2-cat">
									bind{" "}
									<span className="eg2-count">{patternDSL.bind.length}</span>
								</span>
								<Tags items={patternDSL.bind} />
							</div>
							<div className="flex gap-3">
								<span className="eg2-cat">
									body{" "}
									<span className="eg2-count">{patternDSL.body.length}</span>
								</span>
								<Tags items={patternDSL.body} />
							</div>
						</div>
					</div>

					<div
						className="eg2-divider mt-8 eg2-fade"
						style={{ animationDelay: "700ms" }}
					/>

					{/* Changelog */}
					<div className="mt-8 eg2-fade" style={{ animationDelay: "750ms" }}>
						<p className="eg2-section-title">CHANGELOG</p>
						<div className="mt-4 space-y-3">
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 16:00 &mdash; Unified Symbolic Runtime +
									full family port: 35 transform handlers, 25
									induction strategies
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Full 8-phase runtime + family port. executor.py:
									35 transform handlers (18 new: extract, decompose,
									upscale, mirror_concat, fold_symmetry, slide_to_wall,
									pattern_extend, count_encode, color_count,
									row_col_projection, separator_summary, stack_concat,
									stamp, hollow_rect, object_extension, bbox_complement,
									recolor_closest, neighbor_rule). induction.py: 25
									strategies (8 new diff-dims + 7 new same-dims).
									42/400 tasks solvable standalone (train+test verified).
									Benchmark: 115/400 (+1), all 42 overlap with existing
									solves. Runtime provides speed (6.9ms vs 290ms beam)
									not new coverage yet. 2873 tests, 0 regressions.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-26 02:00 &mdash; fill_enclosed migrated into
									config runtime: first same-dims family migration
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Migrated fill_enclosed into config_exec. Added
									fill_enclosed op to config_executor with robust
									enclosed-region detection (tries each color as hole
									candidate, not just bg). Color sources: explicit,
									from_encloser (adjacent different-color pixels),
									from_context. Added _infer_fill_enclosed to
									config_infer. 2/5 fill_enclosed training tasks now
									solve through config_search/config_exec. The
									remaining 3 need multi-color fill or composition.
									Config runtime now covers: same-dims (recolor,
									remove, fill_between, fill_enclosed) + diff-dims
									(transform_tile). Eval 34/400, train 114/400
									(stable). 32 config tests passing (7 fill + 14
									same-dims + 11 diff-dims).
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 23:30 &mdash; Diff-dims in config runtime:
									transform_tile absorbs kronecker, 5 eval via config_search
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Extended config runtime to handle diff-dims
									transform tiling. Added transform_tile op to
									config_executor (row_transforms, block_grid,
									simple tile). Added _infer_transform_tile to
									config_infer, delegating to kronecker_infer for
									pattern detection. config_search seed schema
									now covers both same-dims and diff-dims
									(requires_same_dims=False). Result: 5 eval
									hypothesis solves now come through
									seed_schema:config_search instead of old
									kronecker_tile path. The config runtime IS the
									solver for these tasks. Old kronecker_tile seed
									demoted to LEGACY. Eval 34/400, train 114/400
									(stable). 25 config tests passing (14 same + 11 diff).
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 21:00 &mdash; Config proposer v2: richer
									encoding + explicit config candidates
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Upgraded proposer to predict explicit TransformConfig
									candidates alongside family rankings. Richer encoder:
									96-dim object-relational features (grid dims, color
									histograms, object counts/sizes/deltas, diff ratios,
									structural signals, pair consistency) concatenated
									with 64-dim global features &rarr; 160-dim combined.
									Leave-one-out: top-1 43.9%, top-3 60.5%, top-5 70.2%.
									Proposer now generates concrete TransformConfig
									candidates from top predicted families (recolor
									predicates, fill patterns, remove operations).
									ConfigPrediction carries both family_rankings and
									config_candidates. Integration via
									priority_families + encode_task(). Eval 34/400,
									train 114/400 (no regression). 11 tests passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 19:00 &mdash; Learned program proposer:
									neural proposal, symbolic execution
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									First learned proposer: nearest-neighbor on 64-dim
									task features predicts solve family from 114 training
									examples (37 families). Leave-one-out: top-1 49%,
									top-3 61%, top-5 69%. Proposer reorders seed schemas
									so predicted families are tried first. Wired into
									solve_by_hypothesis via priority_families param.
									Persisted to data/proposer.json. Architecture:
									proposer emits rankings &rarr; symbolic runtime
									executes &rarr; exact verification accepts/rejects.
									No opaque execution. Eval 34/400, train 114/400
									(no regression). 8 new tests, all passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 16:00 &mdash; Unified config runtime:
									one machine, many programs
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Architecture pivot: added config_exec body kind
									as the single gateway from ProgramIR to a unified
									config runtime. Three new modules:
									config_schema.py (TransformConfig = SelectSpec +
									TransformSpec + OutputSpec, serializable, typed),
									config_executor.py (fixed reviewed executor:
									select objects/pixels by predicate &rarr; apply
									recolor/remove/fill_source_color), config_infer.py
									(train-pair induction: fill_between, recolor by
									size/color, remove by color/size). Wired as
									config_search seed schema &mdash; configs route
									through existing ProgramIR verify/register/recall
									pipeline. Eval 34/400, train 114/400 (no regression).
									No new cluster-specific body kinds. The runtime is
									the substrate &mdash; capability growth now means
									widening the config vocabulary (predicates, transforms,
									relations), not adding code paths. 14 tests passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 12:00 &mdash; Same-dims machine: axis-fill
									executor + honest residual analysis
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built samedims_machine.py: constrained executor for
									same-dims tasks with axis-fill operations
									(between_same_color, extend_to_boundary on row/col/both).
									Also built object_config.py: select-by-predicate &rarr;
									recolor/remove meta-executor. Exhaustive testing on all
									unsolved tasks: 0 train + 0 eval solved by axis fill,
									0 by object recolor, 0 by global color substitution.
									Analysis: 16 train + 21 eval tasks have row/col-aligned
									added pixels, but the operations are object-relational
									(stamp, connect-toward-target, extend-pattern) not bulk
									axis fills. All remaining ~184 train + ~252 eval unsolved
									same-dims tasks require per-object spatial/relational
									reasoning. The machine substrate is correct; the
									induction vocabulary needs containment, adjacency,
									shape-match, and directional predicates. 15 tests passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 10:00 &mdash; Object-relational meta-executor:
									architecture correct, induction bottleneck identified
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built object_config.py: constrained meta-executor for
									same-dims tasks. Config language: select (by_size,
									by_color, by_position, by_relation) &times; action
									(recolor_to, remove) &times; source (explicit,
									from_largest, from_context, from_neighbor). Executor
									works correctly on synthetic examples. Honest finding:
									0 unsolved tasks solved. Same-dims tasks use highly
									relational / contextual predicates that change per
									training pair. Even brute-force fixed color-to-color
									recoloring fails (0/184 train, 0/252 eval). The
									bottleneck is not the executor machine &mdash; it is
									the induction engine&apos;s predicate vocabulary.
									Current vocabulary (smallest, largest, unique_color,
									fixed_color) is too narrow; the real tasks need
									shape-match, containment, adjacency, and other
									relational predicates. 7 new tests, all passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 07:00 &mdash; Extended kronecker:
									rot90/rot270 transforms, eval 32&rarr;34
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Audited all 7 PRIMITIVE_MISSING clusters (42 same-dims
									tasks). Finding: these tasks are complex object
									manipulations tagged &quot;periodic&quot; by
									edit_features but not actually tile-periodic. No new
									template family is justified. Instead, extended the
									existing transform_tiler vocabulary with rot90 and
									rot270. Updated: kronecker_infer.py,
									eval_body.py (TILE body), and
									primitive_templates.py. Result: eval 32&rarr;34/400
									(+2 new: 7953d61e, ed98d772 &mdash; both use
									[identity, rot90; rot180, rot270] 4-fold rotation
									tiling). Training 114/400 (stable). Scanned 18
									unsolved diff-dims eval tasks with integer scale.
									Honest: the remaining same-dims periodic gap
									requires genuinely new object-level capabilities,
									not a narrow tile template. 30 tests passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 04:00 &mdash; Full admission integration:
									primitive instances in live solver + eval gate
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Integrated primitive instances into the full
									autonomy stack. Solver: _try_primitive_instances()
									loads data/primitives.jsonl in hypothesis stage,
									tries each instance on the task, wraps as
									SynthProgram. Admission: gap detector finds
									PRIMITIVE_MISSING clusters &rarr; compile_sketch()
									&rarr; verify on cluster tasks &rarr; add to
									PrimitiveStore. Eval-first gate unchanged. The
									system can now propose, compile, verify, persist,
									and load primitive instances as data without code
									edits. Verified live: task 00576224 solved by
									transform_tiler instance loaded from
									data/primitives.jsonl. Manual boundary: template
									families (TEMPLATE_EXECUTORS) are fixed reviewed
									code; instances are data. 46 tests passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-25 02:00 &mdash; Template-based primitive
									graduation: sketch &rarr; compile &rarr; execute
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built template-based primitive graduation system.
									PrimitiveInstance = (template_name, serializable_params).
									Template registry: transform_tiler (per-block
									geometric transforms). Compiler: compile_sketch()
									maps operator sketch + training pairs &rarr;
									template instance via kronecker_infer. Graduate:
									compile &rarr; multi-task verify &rarr; persist.
									PrimitiveStore: JSONL persistence at
									data/primitives.jsonl. Real graduation: sketch
									&quot;proposed_kronecker_tile&quot; compiled to
									transform_tiler(3&times;3, [identity, flip_lr,
									identity]) and verified on eval task 00576224
									with test-pair PASS. Manual step removed: the
									system now proposes, compiles, verifies, and
									persists primitive instances as data without
									hand-writing an executor. 18 new tests, all passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 23:30 &mdash; Kronecker tile primitive:
									+4 eval solves from first auto-proposed primitive
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Implemented narrow kronecker_tile as a mode of the
									existing TILE body kind. Train-derived induction:
									infer scale + per-block transform pattern from
									training pairs only. Transforms: identity, flip_lr,
									flip_ud, rot180. Two patterns: row_transforms (same
									transform per row) and block_grid (explicit per-block).
									Added as seed schema with derive_params_fn. Added
									kronecker_row and kronecker_grid mirror modes to
									TILE body executor. Result: eval 28&rarr;32/400
									(+4 new solves: 00576224, 0c786b71, 59341089,
									833dafe3). Training: 113/400 (stable). This is the
									first primitive proposed by the gap detector that
									was validated by shadow execution, then implemented
									as a live body and produced real benchmark gains.
									12 new tests, all passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 21:00 &mdash; Tile derivation analysis:
									composition-first primitive assessment
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built tile_derivation.py: classifies all 17
									periodic-gap tasks by derivation type. Classes:
									kronecker_tile (4 tasks, mirror-variant tiling),
									color_band_fill (3, uniform rows from color stats),
									extract_downsample (3, output summarizes input),
									simple_upscale (2, direct tile &mdash; reducible),
									row/col_broadcast (3), reshape (1), inconsistent (1).
									Composition-first analysis: 2/17 reducible to existing
									bodies (simple_upscale). 15/17 require genuinely new
									derivation. 1/17 kronecker tile fully verified
									(00576224). Dominant remaining gap: kronecker_tile
									(4 tasks) + color_band_fill (3 tasks). The kronecker
									tile is the strongest next primitive candidate &mdash;
									4 eval tasks need input tiled with mirror/flip variants.
									8 new tests (19 total tile/periodic), all passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 19:00 &mdash; Train-derived periodic body:
									honest gap between shadow and real inference
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built periodic_body.py: train-derived inference that
									infers PeriodicConfig from training pairs only, executes
									on test without target access. Modes: row_period,
									col_period, tile_2d, axis_agnostic, upscale_tile.
									Source strategies: dense (densest block), top_left,
									scan (try all positions). Honest result: shadow
									executor verified 17 tasks (oracle target access), but
									train-derived inference solves only 1 (already solved).
									The gap is genuine: the shadow tasks need tile
									derivation (not tile extraction) &mdash; the output
									tile is a TRANSFORM of the input, not a copy. Simple
									row/col/2D repetition + densest-block extraction is
									insufficient. The periodic primitive gap remains open
									for a richer tile-derivation strategy. 10 new tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 16:00 &mdash; Shadow executor: periodic
									sketch solves 4 train + 13 eval (unsolved)
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built constrained shadow executor for periodic/tile
									operator sketches. Strategies: row-period detection,
									col-period detection, 2D tile detection, template
									broadcast. Not a live solver body &mdash; shadow-only
									for offline validation. Results: 4 currently-unsolved
									training tasks exactly verified (e26a3af2, e9afcf9a,
									0a938d79, 8eb1be9a). 13 currently-unsolved eval
									tasks exactly verified. This validates the periodic
									operator sketch as a genuine primitive gap &mdash;
									the shadow executor finds real solutions that the
									main solver cannot. If promoted to a live BodyKind,
									the potential gain is +4 train / +13 eval.
									11 tests, all passing. No solver changes.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 14:00 &mdash; Real gap classification +
									operator-sketch primitive proposals
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Connected gap detector to real semantic clusters from
									edit_features. 70 clusters, 20 with &ge;3 tasks.
									Gap types: 7 BIND_MISSING (partition bind, focused
									near-miss), 6 COMPOSITION_MISSING (additive+periodic
									pattern), 7 PRIMITIVE_MISSING (diffuse near-miss &gt;4
									bodies). Tag-to-sketch mapping: additive&rarr;additive
									composition, periodic&rarr;tile propagation,
									deletive&rarr;bg color, aligned_row&rarr;cardinal
									direction, new_colors&rarr;context_derived, etc.
									Sketches have unique semantic keys
									(e.g. by_predicate.tile.fixed.grid_boundary).
									Default-only sketches suppressed. Top proposals:
									proposed_deletive_periodic (18 tasks),
									proposed_periodic_recolor (6 tasks). 14 new tests
									(40 total gap+proposal), all passing. No solver
									changes.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 12:00 &mdash; Failure-driven candidate
									mining for admission loop
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added failure_mining.py: mines 2-step ProgramIR
									candidates from unsolved task near-misses. Tries
									step-1 seed schema near-miss (residual &lt; 50%)
									+ step-2 completion (geometric, gravity,
									remove, fill_enclosed with task-derived colors),
									and reverse direction (step-1 global transform +
									step-2 seed schema). Integrated into admission
									loop alongside library-trace and role-template mining.
									Candidates require min_cluster_size &ge; 2 tasks.
									Result: 0 failure-driven candidates found on current
									unsolved tasks &mdash; confirms the remaining 284
									unsolved training tasks genuinely need capabilities
									beyond 2-step compositions over existing body kinds.
									This is the correct honest output: the system is
									not generating noise. The admission gate correctly
									admits only the library-trace macro
									(damage_repair &rarr; periodic_tile_fill). 6 new
									tests (22 total admission+failure), 2601 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 10:00 &mdash; Live A/B eval-first admission:
									hardened gates, dual-split benchmarking
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Hardened admission into authoritative offline
									self-expansion. Four live benchmark runs per cycle:
									baseline train (126/400 174s), baseline eval
									(30/400 363s), trial train (126/400 174s), trial
									eval (30/400 362s). Eval is the authoritative
									no-regression gate. Gates: eval no-regression
									(fatal), train no-regression &gt; 1 (fatal),
									runtime &le; baseline &times; 1.5 + 30s (both
									splits), &ge; 1 validated candidate. Macros and
									role templates share one JSONL store with kind
									field. Role templates can now be admitted and
									persisted alongside macros. Removed stale-results
									baseline path &mdash; baseline always measured
									live. 1 macro admitted (damage_repair &rarr;
									periodic_tile_fill). 16 tests, 2595 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 08:00 &mdash; First real benchmark-gated
									admission: +10 solves, 1 macro admitted
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Ran the first real end-to-end admission pass.
									Baseline: 116/400 (existing results). Trial: 126/400
									(+10 solves with candidate macro injected).
									Gate: PASSED (no regression). Admitted:
									damage_repair &rarr; periodic_tile_fill macro (6
									source tasks, 3/3 exact verification, leave-one-out
									passed, param slots: mode &isin;
									{'{'}transpose, flip_lr+flip_ud+rot180{'}'},
									damage_color &isin; {'{'}0, 6{'}'}). Persisted to
									data/macros.jsonl. Report at
									data/results/admission_report.json. Fixed runtime
									gate to skip when baseline timing unknown (loaded
									from existing results, not timed). Added
									load_baseline_from_results() and
									run_trial_benchmark(). 5 new tests (19 total),
									2598 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 06:00 &mdash; Benchmark-gated offline
									artifact admission workflow
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built complete offline self-expansion loop in
									src/autocap/admission.py. Workflow: mine ProgramIR
									macros + role templates &rarr; validate exactly on
									multi-task evidence &rarr; A/B benchmark baseline
									vs trial &rarr; apply conservative gates (no
									regression, no runtime blowup, no single-task
									artifacts) &rarr; admit only passing artifacts
									to data/macros.jsonl. Gates: trial &ge; baseline
									solves, runtime &le; 1.5&times; baseline + 30s,
									&ge; 1 validated candidate. Dry run: mined 3
									macros + 2 role templates, 1 passed validation
									(damage_repair &rarr; periodic_tile_fill),
									4 rejected (compression gate). All artifacts remain
									JSONL data &mdash; no source-code mutation. Supports
									skip_benchmark mode for fast unit testing. 14 new
									tests, 2593 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 04:00 &mdash; Primitive-gap detector +
									operator sketch meta-DSL scaffold
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									First scaffold for automatic primitive invention.
									Three new modules in src/autocap/: (1)
									gap_detector.py &mdash; classifies failure clusters
									into BIND_MISSING, ROLE_MISSING,
									COMPOSITION_MISSING, or PRIMITIVE_MISSING using
									structural signals, beam near-misses, and body
									feature overlap. (2) operator_sketch.py &mdash;
									constrained meta-DSL for candidate primitives using
									fixed vocabulary enums: SelectionType (9),
									PropagationStyle (10), DirectionSource (7),
									StopCondition (7), ColorSource (6),
									CompositionMode (4). No Python code generation.
									(3) primitive_gates.py &mdash; validation gate
									scaffold: multi-task support, exact verification,
									compression benefit, leave-one-out stability,
									benchmark gate. All data structures are serializable,
									inspectable, and human-vetoable. Dry run on current
									clusters produces correct gap classifications and
									operator sketches. 26 new tests, 2579 passing. No
									active solver changes.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-24 00:30 &mdash; Selection persistence +
									compounding library gains
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added StepSelect.from_step for selection persistence across
									ProgramIR steps. Step 2 can reuse step 1&apos;s resolved
									selection instead of re-detecting from the mutated grid.
									This fixes the draw_ray+remove composition: without
									from_step, newly painted cells are also detected as markers
									and removed. 66e6c45b now solves via
									draw_ray(away_from_center)+remove(from_step=0).
									Library compounding is the real story: registered ProgramIR
									leaves from prior runs transfer via recall. Training:
									113/400 (from 104 baseline). Eval: 28/400 (from 26).
									library_recall: 67 train, 14 eval. 2,583 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 &mdash; AutoCapabilityLoop: automatic
									symbolic macro induction and validation
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built a safe automatic capability-growth loop
									(src/autocap). The system now automatically: (1) mines
									failure clusters from benchmark diagnostics by
									failure_reason x semantic_tag, (2) induces recurring
									multi-step ProgramIR macro templates from library
									entries, (3) proposes role+body_kind selection templates
									from existing perception roles, (4) validates each
									candidate via exact train verification + compression
									gate + overfit rejection + leave-one-out, (5) admits
									validated macros into a JSONL macro store, (6) exposes
									admitted macros to search_compositional and
									search_role_compositional as extra candidates. All
									artifacts are serializable and inspectable &mdash; no
									closures, no arbitrary code generation, no dynamic
									self-modification. Manual primitives remain the hard
									safety boundary. 9 focused tests, CLI at
									scripts/run_autocap.py. 2,584 tests passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 23:00 &mdash; Selection persistence +
									bg auto-detect: +9 train, +2 eval
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added StepSelect.from_step for cross-step selection
									persistence. Step 2 can now reference step 1&apos;s
									original selected objects instead of re-detecting from
									the mutated grid. This fixes draw_ray+remove_marker
									2-step compositions where painted ray cells were
									wrongly detected as new markers. Also fixed
									execute_program_ir bg: auto-detect from grid when
									ProgramIR.background is None (was hardcoded to 0).
									This unblocked extend_line, stamp_template,
									grid_decompose, and connect solves on non-zero-bg
									tasks. Net: +10 gained, -1 lost (predicate_recolor on
									varying-bg task that worked by coincidence with bg=0).
									113/400 train (+9), 28/400 eval (+2). 2,575 tests.
									Connect-between-markers (22 tasks) confirmed separate.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 22:00 &mdash; Role-enrichment: register
									role-structured ProgramIR for all solved tasks
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Role-search found 20 solvable training tasks but only
									registered 1 ProgramIR (library_recall solved them
									first). Fix: _maybe_register_role_ir runs role_search
									as post-solve enrichment for every solved task, registers
									any verified ProgramIR with StepSelect metadata. Only
									registers entries with role structure (avoids single-step
									duplicates). No _strengthen_guards for ProgramIR entries.
									ProgramIR: 34&rarr;42 entries, 19&rarr;26 signatures,
									1&rarr;4 role-annotated. New role entries: draw_ray
									(marker), draw_ray (by_color), draw_ray&rarr;draw_ray
									(by_color&times;2). Training: 103&rarr;113/400 (+10
									from enriched library recalls). Eval: 26&rarr;28/400
									(+2 &mdash; one from ProgramIR recall of
									draw_ray&rarr;remove with marker role). 5 new tests,
									2531 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 24:00 &mdash; Marker propagation cluster
									analysis + bg auto-detect fix
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Quantified marker_propagation cluster: 144 unsolved
									same-dims tasks with markers. Subclusters: 91 ray,
									22 connect, 17 mixed, 14 other. Added 2 new derived
									direction modes (toward_nearest_edge, away_from_nearest_edge)
									to existing 5 (center, corner, outward). Key finding:
									existing modes already covered the space &mdash; only 1
									task (ea786f4a) solvable by draw_ray alone. Real
									bottleneck was bg=0 hardcoding in execute_program_ir.
									Fixed: auto-detect bg from grid when ProgramIR.background
									is None. This unblocked 5 library recall solves
									(extend_line, stamp_template) that previously failed on
									non-zero-bg tasks. Net +4 (5 gained, 1 lost from bg
									change). 108/400 train (+4), 26/400 eval (stable).
									2,551 tests passing. Connect-between-markers (22 tasks)
									confirmed as a distinct semantic needing its own body
									kind &mdash; not a draw_ray variant.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 20:30 &mdash; Role-match recall bonus for
									ProgramIR entries
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Turns ProgramIR role metadata into a ranking signal.
									Task-side: compute_task_role_summary builds a scene
									graph for the first input and extracts detected roles
									(marker, frame, template, separator, content, legend).
									Entry-side: ProgramIR.role_signature provides the
									ordered tuple of StepSelect roles. Scoring:
									_role_bonus gives up to 0.05 for ProgramIR entries
									whose StepSelect roles match the task&apos;s scene
									roles. Only applies to role-annotated ProgramIR
									entries; non-role entries and plain PatternDef entries
									always get 0. Diagnostics: recall_with_diagnostics
									now shows role_bonus field alongside
									composition_bonus. Both recall() and
									recall_with_diagnostics() accept task_role_summary
									kwarg. Training 103/400, eval 26/400.
									12 new tests, 2500 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 18:00 &mdash; ProgramIR inventory: role
									annotation, color_substitute lowering, role_search
									registration
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Three targeted fixes to grow ProgramIR diversity:
									(1) role_search stage now attaches _program_ir to
									SynthProgram for ProgramIR registration &mdash;
									first role-annotated entry (draw_ray with
									StepSelect role=marker). (2) lower_synth_program
									now refines pixel_rule+color_map to color_substitute
									body kind and extract_object+selector to
									extract_by_predicate+predicate. New signature:
									fill_enclosed &rarr; color_substitute. (3) Added
									ProgramIR.role_signature, has_role_structure
									properties. Recall diagnostics now show signature
									and roles for ProgramIR entries. ProgramIR: 32&rarr;34
									entries, 19&rarr;21 signatures, 0&rarr;1
									role-annotated. registered_ir_from_role_search
									appears on both train and eval. 9 new tests, 2482
									passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 14:05 &mdash; Cluster-focused solve loop
									prompt
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added
									{" "}
									<code>scripts/prompts/capability_cluster.md</code>
									{" "}
									for
									<code>continuous_solve_loop.py</code>.
									The old default loop prompt was tuned for library/extraction
									hygiene. The new prompt is tuned for capability growth on a
									repeated failure cluster: inspect a small representative set
									of tasks, classify the shared gap correctly
									(bind/body/role/composition/registration), and make one
									reusable architecture improvement per iteration. This keeps
									the loop aimed at substrate growth instead of generic
									benchmark churn.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 23:30 &mdash; Guidance A/B evaluation:
									heuristic + learned MLP
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									First empirical validation of AlphaGo-style search
									guidance. Added --guidance=none/heuristic/learned CLI
									flag. Built trace dataset: 98 examples from 82 library
									entries (67 schema, 31 ProgramIR). Trained MLP policy
									(80.6% top-1 accuracy, 15 classes) and value model.
									A/B benchmark results (training 400 tasks, timeout 5s):
									none=104, heuristic=104, learned=104 &mdash; same solve
									count. Beam expansions: none=46 avg, heuristic=47,
									learned=46. Beam time: none=244ms, heuristic=251ms,
									learned=257ms. Eval: 26/400 all three. Conclusion:
									guidance substrate confirmed working (diagnostics
									report policy/value activity, 330 beam tasks tracked),
									but no efficiency or solve-count gain yet. Bottleneck:
									(1) 98 all-positive training examples too small &mdash;
									need negative examples from failed branches. (2) Value
									model trivially overfit (100% train acc on all-positive).
									(3) Heuristic biases too weak to change beam ordering
									materially given max_depth=3, beam_width=20 constraint.
									Next: collect beam-trace negatives, augment dataset,
									retrain with balanced labels. 2503 tests passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 14:00 &mdash; ProgramIR inventory growth:
									seed schemas + no_mapper fallback
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									ProgramIR inventory was too small: 15 entries, 9
									signatures. Two fixes: (1) Hypothesis stage now attaches
									verified ProgramIR to seed-schema SynthPrograms via
									_program_ir attribute. Registration stores it as a
									ProgramIR entry alongside the PatternDef &mdash;
									produces entries for extract_by_predicate, recolor,
									grid_decompose, fill_enclosed, partition_cell_map/broadcast,
									transpose, upscale_block, fold_symmetry. (2) Single-step
									no_mapper solves now fall back to ProgramIR lowering +
									registration when hypothesis_to_pattern fails. ProgramIR
									entries skip _strengthen_guards (self-verifying; restrictive
									guards only hurt recall). Result: ProgramIR 15&rarr;32
									entries, 9&rarr;19 unique signatures. Training recall hit
									rate 12.3%&rarr;16.5% (+4.2pp). library_recall solves
									46&rarr;61. Training 104/400, eval 26/400 unchanged. 4 new
									tests, 2473 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 11:30 &mdash; DRAW_RAY spatial propagation
									body kind
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New BodyKind.DRAW_RAY: ray propagation from seed/marker
									cells. Params: directions (cardinal/diagonal/all/specific),
									color (seed or explicit), seeds (_selected binding).
									Stops at grid boundary or non-bg obstacle. Integrated
									with StepSelect roles. Role search generates draw_ray
									candidates for 13 direction modes &times; seed/explicit
									colors. 101 tasks (40 train + 61 eval) match the ray
									pattern in analysis. However, most need per-marker
									direction derivation or inter-marker connection, not
									simple boundary rays. Result: 104/400 train (+1 new via
									role_search DRAW_RAY on 623ea044). 26/400 eval (stable).
									The cluster needs more sophisticated direction derivation
									for broader gains. 2,499 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 22:00 &mdash; AlphaGo-style search guidance
									layer
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added first neural-guided search layer: policy prior +
									value estimator integrated into beam search. SearchState
									representation (97-dim: 64 task features + 10 search
									progress + 23 body-kind histogram). Heuristic policy
									scorer uses co-occurrence transitions + structural biases.
									Heuristic value estimator detects dead-ends and stagnation.
									MLP policy/value architectures ready for training on search
									traces. CompositePolicy/CompositeValue blend learned +
									heuristic signals with graceful fallback. Beam search now
									accepts optional policy_scorer and value_estimator: policy
									reranks candidates, value prunes low-promise branches
									(threshold 0.03). Training data extraction from solved
									ProgramIR library entries and seed schema solves. 42 new
									tests, 2489 total (0 failures). Symbolic-first: exact
									verification unchanged, all guidance is advisory.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 08:30 &mdash; Role search expansion +
									exhaustive eval sweep
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Expanded role vocabulary: by_color, contained, container,
									unique_color, minority_color, by_shape. Expanded role
									search templates: select-by-color recolor, remove+fold,
									remove+connect, remove+damage_repair, 2-step marker
									recolor+fold. Exhaustive eval sweep: 0/253 same-dims
									unsolved by simple body kinds, 0/150 by role-select
									compositions, 0 by diff-dims extract/crop. The 374
									unsolved eval tasks genuinely require spatial operations
									beyond current body executors &mdash; the bottleneck is
									body set, not role infrastructure. 103/400 train, 26/400
									eval (stable). 2,428 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 09:00 &mdash; Positive composition-aware
									recall ranking for ProgramIR
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added positive composition matching to complement the
									negative structural pre-filter. Program-side:
									ProgramIR.precondition_tags extracts structural tags
									from step body kinds (damage, periodic, enclosed,
									connect, extract, geometric, partition). Task-side:
									compute_task_composition_tags derives matching signals
									cheaply (damage-color present, additive pixels,
									diff-dims, periodicity, partition detection). Scoring:
									_composition_bonus adds up to 0.10 based on Jaccard
									overlap of program tags vs task tags. Only ProgramIR
									entries receive the bonus; single-step recall is
									unaffected. Both recall() and recall_with_diagnostics()
									now accept task_composition_tags and show
									composition_bonus in diagnostics. Training 103/400,
									eval 26/400 &mdash; no regression. 19 new tests, 2459
									passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 06:30 &mdash; Composition-aware structural
									pre-filter for ProgramIR recall
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									ProgramIR recall had 99.5% waste: 600/603 attempts
									failed (verify_failed or guard_failed). The lowered
									similarity floor recalls compositions too broadly.
									Added program_ir_matches_task_structure() &mdash; a
									cheap structural pre-check before expensive
									verification. Two checks: (1) dimension compatibility
									&mdash; same-dims programs on same-dims tasks only,
									diff-dims programs (crop/extract) on diff-dims only.
									(2) damage_repair precondition &mdash; requires a
									plausible damage-color signal (color in input absent
									from output). 75 eval recall attempts now skip
									verification via &quot;structure_mismatch&quot;,
									saving ~1.6s total (recall 12.3s&rarr;10.7s, 13%
									reduction). Diagnostics show step signature and
									mismatch reason. Zero solve regressions: 103/400
									train, 26/400 eval. 12 new tests, 2399 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 04:00 &mdash; ProgramIR recall: multi-step
									compositions now recalled from library
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									ProgramIR entries were stored in the library (15
									multi-step programs) but never recalled &mdash; the
									recall path only executed PatternDef bodies, not stored
									ProgramIR. Three fixes: (1) _run_library_recall now
									checks entry.program_ir and executes full ProgramIR via
									verify_program_ir + _make_program_ir_program. (2)
									_pattern_candidates creates beam candidates that execute
									full ProgramIR for entries with program_ir. (3) Library
									recall uses a lower similarity floor for ProgramIR
									entries (min_sim&times;0.75) because they self-verify
									against all training pairs. Training: 103/400 (+1 new
									solve via composition recall). library_recall
									39&rarr;46 (+7), recall hit rate 10.3%&rarr;12.3%.
									Eval: 26/400 (+1 from unrelated role_search).
									library_recall 5&rarr;9 (+4), recall hit rate
									1.3%&rarr;2.3%. The damage_repair+periodic_tile_fill
									compositions and connect+connect composition now recall
									from library instead of re-discovering via hypothesis
									or beam search. 9 new tests, 2382 total passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 02:00 &mdash; Role-structured compositional
									search
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New architecture: StepSelect on ProgramStep for typed
									role-based object selection. Roles: marker, template,
									frame, separator, largest, smallest, by_color.
									_resolve_select builds scene graph, selects objects by
									role, injects as _selected binding for body executor.
									New pipeline stage: role_search (role-guided compositional
									search, 11.8ms train / 21.6ms eval). Generates candidates
									from scene role structure instead of brute-force.
									135/375 unsolved eval tasks have marker+template roles
									&mdash; the dominant failure cluster. First solve:
									12eac192 via &ldquo;select markers, recolor to 3&rdquo;
									(typed StepSelect program). Training: 103/400 (stable).
									Eval: 25&rarr;26 (+1 new role_search solve).
									library_recall: 6&rarr;9 on eval (ProgramIR leaves
									from prior runs). 2,411 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-23 00:30 &mdash; Zero-transfer audit +
									predicate_recolor exposure fix
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Audited all zero-transfer structural families. rotate_grid
									(3 train), mirror_concat (3), transpose (2), mirror_grid
									(2): genuinely absent from eval, not exposure gaps.
									fold_symmetry: 0 genuine eval matches (8 false-positive
									symmetric outputs). predicate_recolor seed schema had
									narrow predicate search (4) vs handwritten fallback (20+).
									Expanded to 8: not_is_smallest, not_is_largest,
									is_unique_color, is_minority_color. Added selectors in body
									executor + _background hint in execute_program_ir. Result:
									103/400 train (+1), predicate_recolor: 1&rarr;3 hypothesis
									solves. 25/400 eval unchanged. train_fit_test_fail:
									11&rarr;10. 2,391 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 23:30 &mdash; Fix 2-step composition
									lowering via resolved library pattern params
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Beam search finds 2-step compositions (e.g.
									fill_enclosed+remove, connect+connect, tile+rotate), but
									lowering to ProgramIR failed because library-recalled
									step-1 actions only stored opaque &quot;pattern&quot; name
									refs. lower_synth_program couldn&apos;t reconstruct the
									body. Fix: _pattern_candidates now stores _body_kind and
									_resolved_params on each recalled SynthAction, and
									lower_synth_program uses them to build ProgramSteps
									directly. Training: multi_action_verify_failed 9&rarr;1.
									Eval: multi_action_verify_failed 5&rarr;2,
									registered_ir_from_beam_search 0&rarr;2,
									already_in_library 5&rarr;6. One eval task now solved via
									library recall of a registered 2-step ProgramIR.
									Training/eval solve counts unchanged (102/25). 8 new
									tests, 2355 passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 22:00 &mdash; Hypothesis budget reclaim:
									marker_directed grid area guard
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Profiled all 32 seed schemas on eval: marker_directed
									consumed 22.4s (67% of total hypothesis time) across 270
									eval tasks with zero solves. On 20&times;20+ grids, its
									body executor costs 83ms/task but only verifies on
									grids &le;7&times;7 (area 49). Added max_grid_area=225 guard
									to SeedSchema. Training hypothesis time: 101ms&rarr;34ms
									avg (66% drop). Eval beam search gets more budget:
									397ms vs 354ms avg, +5.6% expansions (57 vs 54).
									Training gains: 2 new predicate_recolor hypothesis
									solves (freed time lets more schemas try). Eval stays
									25/400 but beam search coverage improves. No training
									regressions (102/400). 12 new tests, 2347 passing
									(excluding 7 pre-existing slide test failures from
									uncommitted work).
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 19:30 &mdash; TEMPLATE_RAY_STAMP:
									anchor-template propagation primitive
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New body kind: detect largest object as template + smaller
									objects as directional markers. For each marker, derive
									cardinal/diagonal direction from marker position relative
									to template bbox, compute stride from edge gap, then
									repeatedly stamp recolored template copies along that ray
									until grid boundary with edge clipping. Supports
									multi-marker additive composition and diagonal
									propagation. 045e512c now solves end-to-end via
									seed_schema:template_ray_stamp path (train verified + test
									verified). 5 files changed, 7 new tests, 2390 passing.
									Potential cluster: 61 unsolved tasks with similar
									misrouting through partition logic.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 18:00 &mdash; Per-object SLIDE: selective
									contact/process primitive
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Extended SLIDE_TO_WALL from global-only (all objects move)
									to per-object selective (chosen objects slide, others stay
									as obstacles). Params: direction, stop_mode
									(wall/obstacle), selector (by_color/by_size_rank/
									by_position_rank). Object solver now infers SLIDE when
									training pairs show varying-displacement translates with
									consistent cardinal direction &mdash; verified via
									simulation. Also fixed tuple selector resolution to handle
									by_color + list-form selectors (JSON roundtrip). 5 files
									changed, 27 new tests, 2375 passing. Remaining for richer
									contact: multi-object slide ordering, diagonal slide,
									anchor-relative targeting.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 16:30 &mdash; Primitive-mining audit: ericagi1
									&rarr; ericagi2 + by_position_rank selector
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Structured audit of all 53 primitives/operations from
									ericagi1. Result: 37 already present, 4 missing bind/select
									vocab, 1 missing primitive, 6 missing exposure, 5 rejected
									as brittle. Top 5 import candidates ranked by eval transfer
									value. Implemented #1: by_position_rank object selector
									&mdash; selects objects by spatial order (top-to-bottom,
									left-to-right). Critical fallback when color/size are
									ambiguous. 3 touch points: eval_body resolver,
									candidates.py selector key + action builder. 6 new tests,
									2339 passing. Deferred: per-object SLIDE (needs selectors
									first), by_shape selector, flood_fill_voronoi,
									grow/shrink_objects.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 01:00 &mdash; Container-projection analysis:
									one-off, not implemented
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Analyzed 855e0971 (hole-in-stripe projection).
									Rule: for each monochrome rectangular stripe, project
									holes along the orthogonal axis within the container.
									Scanned all 800 tasks (train + eval): exact match = 1.
									All 4 projection variants (orthogonal/same/always-h/always-v)
									also match 1 task only. 117/400 tasks have the
									stripe-with-hole structure (86 unsolved), but none share
									the projection action. Decision: one-off &mdash; not
									implemented per design constraint. Containment detection
									infrastructure could be reused later if a multi-task
									cluster emerges.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-22 00:30 &mdash; Local-rule audit + hypothesis label
									fix + pixel_feature overfit gate
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Audited all 12 neighborhood_rule and 17 residual
									pixel_rule training solves. Found: (1) hypothesis.py
									had same mislabeling bug as solver.py &mdash; 7
									seed-schema solves still reported as pixel_rule.
									Fixed via body_kind_to_action_kind() in hypothesis.py.
									pixel_rule: 17&rarr;1 residual (sequence body kind
									pattern). extract_object: 9&rarr;14, partition_cell_map:
									0&rarr;2, separator_cell_summary: 0&rarr;1. (2)
									neighborhood_rule: 11 of 12 are genuinely small (1-4
									rules). 1 task (b6afb2da) had 13-rule pixel_feature
									lookup table &mdash; classic overfit. Added tighter gate:
									pixel_feature mode with &gt;6 rules AND poor compression
									(&gt;40%) is now rejected. (3) meta_rule mode transfers
									(3 train &rarr; 1 eval = 0.33x). neighbor_recolor does
									not (7 train &rarr; 0 eval). Training: 104&rarr;104
									(b6afb2da rejected but cached). Eval: 25/400 unchanged.
									9 new tests (54 total in mapping file), 2333 total
									passing. Transfer audit now shows local-rule mode
									breakdown.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 23:15 &mdash; Structural action kind resolution
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									All 52 pixel_rule training solves were structural ops
									(rotate, flip, tile, connect, recolor, etc.) mislabeled
									as pixel_rule. Added body_kind_to_action_kind() mapping
									(29 direct + 15 override). Library recall now produces
									correct ActionKind instead of always PIXEL_RULE. Result:
									pixel_rule dropped from 52&rarr;17 (was 50% of training,
									now 16%). Newly visible families: tile_transform=7,
									recolor=7, connect=6, damage_repair=4, rotate_grid=3,
									mirror_concat=3, fold_symmetry=2, mirror_grid=2,
									transpose=2. Transfer picture now truthful:
									damage_repair 1.50x, tile_transform 0.50x,
									pixel_rule exactly 0.24x (matches overall ratio).
									Structural patterns also get lower MDL cost (1.0 vs 3.0),
									so overfit-detection no longer flags them. 102/400
									train, 25/400 eval &mdash; zero solve count change. 45
									new tests, 2324 total passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 22:30 &mdash; Train-vs-eval transfer audit
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Full transfer audit: 104/400 train vs 25/400 eval (0.24
									ratio). pixel_rule dominates training (50% of solves, 52
									train) but transfers at 0.19 &mdash; fair but below par.
									neighborhood_rule weak transfer (12&rarr;1, ratio 0.08).
									Strong transferrers: damage_repair (3&rarr;3, 1.00),
									upscale_block (3&rarr;2, 0.67), fill_enclosed/connect/recolor
									(1:1 each). Library recall: 41 solves on train, only 5 on
									eval &mdash; guard_failed dominates (2869 eval vs 2519
									train). Seed schemas transfer well:
									damage_repair_tile_fill solves 3 eval tasks. 15 families
									are train-only singletons. Top bottleneck: local-rule
									reliance (pixel_rule + neighborhood_rule = 62% of training
									wins but mostly train-side compression). Added
									scripts/transfer_audit.py for reproducible side-by-side
									reporting.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 20:45 &mdash; Body-executor parity fixes
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Fixed 5 parity gaps between SynthAction closures and body
									executors. connect: sequential H&rarr;V for connect_both,
									diagonal modes (d1/d2/both_diag/h/v). recolor: from_color/to_color
									substitution, object selectors (is_smallest, by_size_rank),
									color_map param alias. remove: pixel-level color removal.
									border_draw: bbox-outline mode. multi_action_verify_failed:
									8&rarr;6 (remaining are opaque pattern refs + neighbor_rule
									tables). library_recall: 35&rarr;39 (ProgramIR leaves now
									registered and recalled). 2,279 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Multi-action lowering audit
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Body mappings added for grow/shrink/object_outline.
									multi_action_unlowerable: 3&rarr;0. Remaining 8
									multi_action_verify_failed are body-executor parity gaps
									in individual steps (connect, recolor, fill_enclosed body
									executors produce different results from SynthAction closures),
									not composition issues. 2,247 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Docs consolidation: 102/400,
									zero fallback
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Docs updated to reflect: 102/400 solved, 32 seed schemas,
									zero handwritten fallback, 45+ body kinds. STATUS.md
									rewritten. CLAUDE.md updated. README.md with accounting
									semantics.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Zero handwritten fallback
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									PARTITION_MAX_CELL_FILL: fill cells with max non-bg count,
									clear rest. 29623171 was hiding an explicit
									&ldquo;fill most-marked cells&rdquo; rule, not a classifier.
									Both former classifier tasks now solve via seed schemas.
									Handwritten fallback: 0. The entire hypothesis layer is now
									seed-schema / ProgramIR driven. 2,247 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; PARTITION_CELL_BROADCAST: solve
									09629e4f
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New body kind PARTITION_CELL_BROADCAST: select one partition
									cell by criterion (least/most nonbg), broadcast its values
									as template over partition grid. 09629e4f now SOLVES
									(test-verified) &mdash; the hardest-analyzed partition task
									through V1-V6 modes and classifiers. 29623171 correctly does
									not match (sole remaining handwritten fallback). 6 new
									tests, 2,246 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; BORDER_DRAW executor + final
									fallback audit
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added BORDER_DRAW body executor (8-conn and 4-conn border
									around objects). border_draw now seed-schema-primary.
									partition_cell_classify (2 tasks) is the sole remaining
									handwritten fallback &mdash; it builds a per-task learned
									lookup table that cannot be a fixed seed schema. All other
									hypothesis families now run through seed schemas. 2,240
									tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Fix 3 body-executor parity gaps
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									GRID_DECOMPOSE: axis-aware separator detection for row/col-only
									splits. EXTRACT_BY_PREDICATE: frame_interior predicate uses scene
									perception for frame + interior crop. SEPARATOR_SUMMARY:
									unique/most_nonbg/least_nonbg return actual cell content. 3
									fewer handwritten fallbacks. Remaining: border_draw (1),
									partition_cell_classify (2). 2,240 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Fallback audit: 6 body-executor
									parity gaps
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Audited remaining 6 handwritten fallback tasks. All are
									genuine body-executor parity gaps, not missing schemas:
									border_draw (algorithm differs), frame_interior (missing
									extraction), select_unique_cell (wrong cell values),
									separator_operation (axis param ignored),
									partition_cell_classify (complex canonicalization). Need
									per-family body executor fixes, not more seed schemas.
									No code changes &mdash; measurement result. 2,240 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Parity fixes: retire handwritten
									fallback
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added missing body executors for MIRROR_CONCAT (h/v concat +
									flip) and OBJECT_EXTENSION (directional pixel extension).
									Fixed fill_enclosed to derive output-only colors. 11 of 13
									previously-handwritten tasks now use seed schemas. Remaining
									handwritten fallback: border_draw (1), frame_interior (1),
									partition-specific (4). 2,240 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Partition seed schemas (complete
									de-hardcoding)
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									4 partition schemas: select_unique_cell (3 modes),
									separator_cell_summary (5 modes), partition_cell_map
									(20 modes derived), partition_cell_classify (8 strategies
									derived). 30 total schemas. The entire hypothesis layer
									is now covered &mdash; every _hyp_* family has a seed
									schema that runs first. Handwritten code remains only as
									fallback. 7 new tests, 2,239 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Quantitative/object seed schemas
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									4 quantitative/object schemas: object_sort (3 keys),
									stack_objects (axis&times;sort derived), object_extension
									(4 dirs&times;2 stop modes), color_count_output. 26 total
									schemas. Honest note: object_extension body executor differs
									from handwritten _hyp_* &mdash; seed schema registered but
									match depends on body executor canonicality. Remaining
									handwritten: only partition families and
									separator_cell_summary. 5 new tests, 2,230 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Template/region seed schemas
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									3 template/region schemas: row_col_projection (3 modes),
									input_as_template (derives scale from dim ratios, 3 upscale
									modes), template_stamp (clear_source True/False). 22 total
									schemas. 9172f3a0 upscale now via seed schema. Remaining
									handwritten: stack_objects, object_extension/sort,
									color_count_output, partition families. 6 new tests,
									2,225 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Diff-derived seed schemas
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									3 diff-derived schemas: color_mapping (learns remap from
									diffs), crop_to_colored_region (per-color bbox crop),
									1x1_summary (5 summary modes). ProgramIR executor now
									auto-separates complex values into bindings. 19 total
									schemas. b1948b0a color remap now via seed schema.
									Remaining handwritten: template_stamp, stack_objects,
									object_extension/sort, input_as_template, row_col_projection,
									partition families. 6 new tests, 2,219 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Object-level seed schemas
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									4 object-level seed schemas: object_removal (predicates:
									smallest/markers/color_X), marker_directed (4 modes),
									predicate_recolor (predicate&times;color combos),
									border_draw (connectivity&times;color). 16 total schemas.
									5582e5ca now solves via seed_schema:marker_directed.
									Handwritten _hyp_* only for complex object-relational,
									partition, stack/crop. 7 new tests, 2,213 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Scene-derived seed schemas
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									4 new scene-derived seed schemas: extract_by_predicate
									(enumerates predicates), fill_enclosed (derives fill colors),
									damage_repair (detects damage color + symmetry),
									damage_repair_tile_fill (2-step with residual detection).
									12 total seed schemas. damage_repair and extract now solve
									via seed schema path, not handwritten Python. Handwritten
									_hyp_* only for complex object-relational and partition
									families. 6 new tests, 2,206 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Seed schemas: ProgramIR as primary
									hypothesis path
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									8 seed schemas lower manual hypotheses to explicit ProgramIR:
									gravity, mirror_grid, rotate_grid, transpose, fold_symmetry,
									mirror_concat, upscale_block, grid_decompose.
									solve_by_hypothesis tries seed schemas first, falls back to
									handwritten _hyp_* for unsupported families. hypothesis_source
									diagnostic tracks solve origin. Verified: flip/rotate tasks
									now solve via seed_schema path, damage_repair correctly falls
									back. 12 new tests, 2,200 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; ProgramIR compositional substrate
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Architecture pivot: explicit ProgramIR with ordered
									ProgramSteps (body_kind + params). Serializable, executable
									through existing body eval, no closures. Lowering from
									SynthProgram and PatternDef. Multi-action solver wins now
									register as ProgramIR-bearing library entries.
									search_compositional() searches 1-2 step programs.
									Verified: 0dfd9992 2-action solve &rarr; ProgramIR leaf.
									16 new tests, 2,188 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; PERIODIC_TILE_FILL composition
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New PERIODIC_TILE_FILL body kind: infers smallest 2D tile
									from non-damage pixels, fills residual holes. Damage repair
									hypothesis emits 2-action composition when peer symmetry
									repair leaves periodic residuals. +3 new solves: 0dfd9992,
									29ec7d0e, c3f564a4 (all test-verified). b8825c91 unaffected.
									3631a71a correctly not solved. 10 new tests, 2,172 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 &mdash; Damage-repair interpolation audit
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Audited 5 transpose-only damage-repair tasks with residual
									peer-repair holes. Cluster is heterogeneous: 3 tasks
									(0dfd9992, 29ec7d0e, c3f564a4) are 2D-periodic tile fill,
									2 tasks (3631a71a, 73251a56) are non-periodic context
									interpolation. Added inspector diagnostic: &ldquo;partial
									damage repair&rdquo; reports dc, symmetry, %resolved,
									residual count, and whether holes are periodic. No new
									family implemented &mdash; cluster too heterogeneous.
									2,166 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Registration accounting fix
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									no_registration_attempted was 100% library-recall solves
									(pixel_color_remap), not a leak. Tagged as
									&ldquo;already_in_library&rdquo;. Overfit-rejected local
									rules tagged as &ldquo;rejected_overfit_local_rule.&rdquo;
									Pure accounting, no solver change. 1 new test, 2,162 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Overfit local-rule rejection
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Reject neighborhood_rule and pixel_rule beam winners with
									&gt;15 original rules. These large memorized lookup tables
									produce train-fit-but-test-fail results (0-11% test
									accuracy). Verified: 2 worst offenders now rejected, small
									legitimate rules preserved, correct solves unaffected. New
									deferred_local_rule diagnostic flag. 6 new tests, 2,161
									total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 &mdash; Damage-repair family overhaul
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Audited 3631a71a and found 13-task damage-repair /
									symmetry-repair cluster (0/13 solved). Fixed existing
									DAMAGE_REPAIR family: body executor param mismatch
									(method vs mode), added transpose/rot90/rot180 support,
									iterative peer repair for chained damage, multi-symmetry
									repair, explicit damage-color detection. +1 new solve
									(b8825c91). 5 transpose-only tasks need pattern
									interpolation for diagonal self-peer regions &mdash;
									identified as future work, not a simple peer-repair
									extension. 2,159 tests, all passing.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Semantic edit-feature clustering
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New edit-semantic feature extraction: additive/recolor/
									deletive, periodic/diagonal, aligned objects, single fill
									color. scripts/semantic_clusters.py groups timeout tasks by
									edit semantics with heterogeneity warnings. Key finding:
									of 56 additive+aligned tasks, 46 are periodic/diagonal
									(pattern-gen, NOT line-fill). Previous coarse clustering
									was misleading &mdash; now explicit. 15 new tests, 2,155
									total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Timeout cluster deep dive
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Deep examination of the &ldquo;6 clean extension tasks&rdquo;
									cluster revealed they are NOT simple line-fills: they are
									complex pattern-generation tasks (fractals, checkerboards,
									growing L-shapes). No narrow reusable primitive covers them.
									Only 3 tasks in the entire timeout set have genuine
									straight-line fills. The timeout residual is genuinely hard
									&mdash; each task needs its own spatial reasoning logic.
									Train-fit-but-test-fail is dominated by overfit neighborhood
									_rule (7) and pixel_rule (3). No code changes &mdash; this
									is an honest measurement result.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 12:32 &mdash; Benchmark summary shows seed-schema sources
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Benchmark main output now prints a top-level hypothesis-source
									summary for solved hypothesis tasks, so seed_schema vs
									handwritten fallback counts are visible without digging into
									the diagnostics footer or per-task JSON. The benchmark and
									diagnostics summary now share the same rendering helper, and a
									targeted benchmark-output test covers the new path.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 12:15 &mdash; Seed-schema source visible in diagnostics
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									inspect_task now prints solve_source, solve_family,
									hypothesis_source, registration_result, and program step
									count in the solver section, so seed_schema vs handwritten
									fallback is visible without opening raw JSON. Benchmark
									diagnostics summary also reports hypothesis-source counts and
									top schemas/fallbacks for solved hypothesis tasks. Targeted
									diagnostics tests pass.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 &mdash; Accounting fix: hard-timeout
									diagnostics
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Fixed benchmark denominator mismatch (400 vs 399): when
									_SolverTimeout kills solver before diagnostics are created,
									benchmark now creates minimal SolveDiagnostics with
									failure_reason=&ldquo;hard_timeout.&rdquo; Remaining
									no_mapper: 11 (hollow_rect_op=3, 8 one-offs at 1 each).
									All low-volume one-offs left unmapped. 2,139 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 &mdash; Pattern mappers for top
									no_mapper families
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									5 new mappers: transpose, move, rotate_grid,
									bbox_complement (new BodyKind + eval_body),
									recolor_closest (new BodyKind + eval_body). Covers
									10/21 no_mapper cases from benchmark accounting.
									hollow_rect_op deliberately left unmapped (multi-mode
									semantics too complex for clean mapping). 2,144 tests
									pass.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 15:00 &mdash; General registration for
									non-hypothesis stages
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Any fresh verified single-action solve with a pattern mapper
									can now register as a library candidate, not just hypothesis
									solves. Covers beam_search, diff_synthesis, pixel_infer
									winners. Multi-action compositions excluded. Extraction
									pipeline uses register_patterns=False to avoid interference.
									Registration reasons now include stage source. 2 new tests,
									2,103 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 13:00 &mdash; Solve-to-library accounting
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Track where solved programs are lost: new
									registration_result field (registered/no_mapper/duplicate/
									rejected/not_hypothesis), solve_family, solve_source on
									SolveDiagnostics. Benchmark prints accounting summary.
									Validated: 5582e5ca fresh solve &rarr; hypothesis &rarr;
									object_removal &rarr; registered &rarr; OE leaf. Main
									leakage: cached solves bypass registration; non-hypothesis
									stages (beam_search) have no registration path. 8 new
									tests, 2,103 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 11:00 &mdash; OE empirical validation
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Ran ARC-1 training benchmark: 207 solved (72 beam, 26
									hypothesis, 9 library, 7 diff, 4 pixel). Library: 6
									entries (2 promoted, 4 candidate). 0 marker_directed
									solves, 2 object_removal solves (1 unique task). 0 real OE
									leaves because: (a) marker_directed doesn&apos;t match any
									real tasks yet, (b) cached solves bypass hypothesis
									registration. The OE pipeline is architecturally complete
									but upstream solve generation is the bottleneck &mdash;
									the families need to actually solve tasks before leaves
									can form.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 09:00 &mdash; OE backfill pipeline
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									PatternLibrary.backfill_oe_ir() attaches ObjectEditProgram
									IR to bridgeable entries (marker_directed, object_removal).
									scripts/oe_backfill.py runs offline audit: scan &rarr;
									backfill &rarr; anti-unify &rarr; report. Current library:
									0 real OE leaves (needs benchmark run with new families).
									Pipeline validated on synthetic data. Real OE parent
									creation requires solved tasks first. 10 new tests,
									2,093 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 07:00 &mdash; OE anti-unification
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Conservative anti-unification for ObjectEditProgram leaves.
									Groups by transform signature, lifts only safe literal
									fields (size_le, size_ge, color, derive.value). Rejects
									when transforms differ, derive sources differ, or non-liftable
									fields (role, color_source) differ. OEParentCandidate records
									template + param_slots + child provenance. Library method
									creates parents only when compressive (&ge;2 children, &ge;1
									lifted, &ge;2 source tasks). Parents stay candidate-only.
									Inspector shows OE-parent(Nsteps, Mparams). 15 new tests,
									2,083 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 05:00 &mdash; Object-edit leaf storage
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									ObjectEditProgram leaves now persist in PatternLibrary via
									object_edit_ir field. Coexists with existing PatternDef
									&mdash; supplementary metadata, not replacement. Solver
									attaches IR at hypothesis registration for MARKER_DIRECTED
									and OBJECT_REMOVAL. Properties: is_object_edit_leaf,
									object_edit_step_count. Inspector shows OE-leaf(Nsteps).
									Save/load round-trips through library persistence. No
									normalization &mdash; exact operational thresholds stored
									as-is. Leaf-first only, no parent abstractions yet. 8 new
									tests, 2,068 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 03:00 &mdash; ObjectEditProgram IR
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Minimal typed IR for object-level transforms:
									ObjSelector (role/size/color) &rarr; ColorDerivation
									(literal/scene-derived) &rarr; transform
									(remove/recolor/fill_interior/flood_adjacent). Fully
									serializable JSON round-trip, no closures. Multi-step
									sequential composition. Bridge converts MARKER_DIRECTED
									and OBJECT_REMOVAL to concrete IR leaves. Execution
									matches direct body evaluation exactly. Leaf-level
									infrastructure for future parent abstraction via
									anti-unification. 22 new tests, 2,060 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-21 01:00 &mdash; Marker-directed tightening +
									diagnostics scoping
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Fixed MARKER_DIRECTED serialization: proper
									BodyKind.MARKER_DIRECTED with dedicated body executor.
									hypothesis_to_pattern &rarr; execute_pattern round-trips
									correctly. Marker color derived per-input (minority marker)
									instead of baked from pair 0. Inspector now diagnoses
									marker-template tasks where simple modes are exhausted as
									&ldquo;likely needs object-spatial transform,&rdquo;
									explicitly scoping 025d127b-class tasks out of simple
									marker-directed family. 2,038 tests.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 23:00 &mdash; Marker-directed object
									transforms
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New MARKER_DIRECTED family for same-size tasks where marker
									objects indicate properties to apply to template objects. 4
									modes: remove_markers, marker_color_fill_interior,
									marker_recolor_templates, marker_fill_adjacent. Hypothesis
									+ candidate generation, gated by marker/template role
									presence. Targets 50 identified same-size timeout tasks
									that were falling back to irrelevant global transforms.
									10 new tests, 2,033 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 21:00 &mdash; Binding diagnostics + failure
									classification
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New resolve_bindings_with_diagnostics showing per-binding
									failure reasons (missing property, inconsistent color map,
									no unique output color). Inspector now shows specific bind
									failure reasons. Diagnosis distinguishes &ldquo;irrelevant
									recall&rdquo; (bind ok, verify fails) from &ldquo;real bind
									failure&rdquo; (specific reason). Library hygiene: rejected
									non-primitives not inserted (name slot stays open). Deferred
									stages correctly attributed in traces. 3 new properties. 8
									new tests, 2,021 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 21:00 &mdash; Overfit-bypass for
									neighborhood_rule
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									When diff_synthesis or pixel_infer returns a
									neighborhood_rule program, stash as fallback and let beam
									search try to find a generalizing alternative. Fixes
									&ldquo;early stage steal&rdquo; where overfitting programs
									prevent better ones from being found. 50cb2852 flips to
									solved. b230c067 improves 11&rarr;4 wrong pixels.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 20:15 &mdash; Known-truths candidate filter
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Beam search candidates now filtered by known-truth
									invariant: reject any candidate that corrupts pixels
									already correct across all train pairs. Median 80%
									candidate reduction across 186 timeout tasks. 154 tasks
									lose &gt;50% of useless candidates (flips, rotates,
									remaps that destroy correct pixels). Falls back to
									unfiltered if filter kills everything. Motivated by
									analysis showing 147 &ldquo;zero-expansion&rdquo; tasks
									where generic candidates all make things worse.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 19:30 &mdash; Per-color morpho ops +
									gravity candidates
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New diff_candidates module: per-color grow/shrink and
									per-color gravity as beam search candidates. Finer-grained
									than all-color variants &mdash; only expand, erode, or
									slide one specific color. 49 timeout tasks show improved
									pixel accuracy, 7 formerly zero-expansion tasks now have
									beam progress. Motivated by analysis showing 147 tasks
									generate candidates where zero reduce residual.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 18:30 &mdash; Morphological grow/shrink
									primitives
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added morphological dilation (grow) and erosion (shrink)
									as beam search candidate actions. Both support 4-connected
									and 8-connected neighborhoods. 20 timeout tasks show
									improved pixel accuracy when grow/shrink is used as a
									composition step (top: +37px on 6cdd2623 via shrink4).
									These are fundamental operations that were completely
									absent from the candidate set. 15 new tests, 1,985 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 17:00 &mdash; Rule-table compression
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Conservative exact compression for neighborhood_rule tables:
									remove irrelevant feature dimensions, factor dominant default
									outputs. Example: 7-rule 5-dim table &rarr; 3 rules on 2
									dims. Compressed at candidate creation time, stored in
									serializable params. Body executor handles relevant_dims +
									default_output. Quality audit: is_oversized_rule_table
									rejects &gt;20-entry tables with weak support. Inspector
									shows compression ratio. New rule_compress module. 7 new
									tests, 1,946 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 15:00 &mdash; Explicit neighborhood_rule
									representation
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Converted neighborhood_rule from hidden-logic closure family
									to explicit serializable representation. Rule tables now
									stored in params/body data as JSON-compatible structures.
									Two formats: pixel_feature (5-tuple feature &rarr; color
									dict) and neighbor_recolor (conditional rule list). Body
									executor dispatches by mode, falling back to legacy dict
									format. hypothesis_to_pattern mapper creates explicit
									patterns. Quality audit no longer flags neighborhood_rule as
									hidden_logic when rule_table present. New rule_table_size
									property. 11 new tests, 1,939 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 13:56 &mdash; Immediate learn-progress logging
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Restored visible benchmark progress when running with
									--learn. iterative_extract now emits task_start events before
									each solve, so benchmark.py prints an immediate
									[learn ...] starting line instead of staying silent until the
									first task finishes. Also fixed the extraction progress
									helper placement in benchmark.py so diagnostics summary and
									learn logging stay cleanly separated.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 13:44 &mdash; Cooperative beam-search timeout fix
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Fixed a real timeout bug exposed by task 3631a71a. The
									pipeline deadline was only checked between stages, so once
									beam_search started it could run for minutes despite a 5s
									task budget. beam_search now accepts a cooperative deadline
									and bails before candidate generation and during candidate
									evaluation. Repro: 3631a71a previously recorded ~195.6s in
									beam_search; after the fix, a 6s solve_with_diagnostics run
									returns in ~6.15s with beam_search capped at ~3.66s. Added
									regression tests for expired and mid-loop beam deadlines.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 13:00 &mdash; Generalized primitive-quality
									audit
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Quality audit now covers all pattern families, not just
									classifiers. New properties: extractability_class
									(explicit/partial/hidden_logic), is_literal_heavy (multi-
									constant no lifting), has_hidden_logic (closure-dependent
									families). quality_score penalizes: hidden-logic 70%,
									literal-heavy 50%, memorizing classifiers 90%.
									reject_non_primitives gates: hidden-logic single-source,
									literal-heavy single-source, memorizing classifiers.
									Inspector shows quality/lit_ratio/family/flags per recalled
									pattern. Benchmark table adds Ext column with L/H/M flags.
									14 new tests, 1,928 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 11:00 &mdash; Classifier quality as
									system-wide filter
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									V6 metrics now gate the entire pattern lifecycle. New
									PatternEntry fields: classifier_sig_count,
									classifier_test_unseen, classifier_n_test_cells,
									classifier_strategy. quality_score applies 90% penalty for
									memorizing classifiers (&gt;50% unseen rate).
									reject_non_primitives gates them before promotion. Metrics
									computed at hypothesis registration time, serialized in
									library, shown in benchmark table. partition_cell_map mapper
									added for pattern serialization. 13 new tests, 1,914 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 09:00 &mdash; Compressive cell signatures
									(Partition V6)
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									8 canonicalization strategies ordered by compression: 5
									compressive (n_nonbg, color_freq_profile, n_colors_n_objs,
									occupancy, occupancy_n_colors) then 3 exact (color_rank,
									color_rank_posn, sorted_color_set). Inspector shows
									per-strategy: signature count, consistency, test unseen rate.
									Classifier tries compressive first &mdash; genuinely solvable
									tasks use few signatures that generalize to test; memorization
									is clearly flagged via test_unseen metric. 3 new tests,
									1,887 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 07:00 &mdash; Cell pattern classifier
									(Partition V5)
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New partition cell classifier family: treats each cell as a
									structured token, computes canonical signatures under 4
									strategies (occupancy, color_rank, color_rank_posn,
									sorted_color_set), builds sig&rarr;output lookup from
									training pairs. Distinct from summary modes &mdash; learns a
									lookup table rather than computing a fixed function. Inspector
									shows per-strategy consistency/conflict/match status.
									Correctly train-fits 09629e4f (36 sigs) but flags
									non-generalization. 6 new tests, 1,883 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 05:00 &mdash; Template completion reasoning
									(Partition V4)
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added 4 template completion modes for position-based
									reasoning: missing_position_fill (consensus color at absent
									majority-template position), extra_position_color (color at
									position unique to this cell), sparse_position_color (color
									at rarest position), dense_position_color (color at most
									common position). 20 total partition modes across 4
									categories (palette/relational/structural/completion).
									Pre-computes cross-cell position-color maps for O(1) per-cell
									lookups. Inspector categorizes modes with per-category
									failure reporting. 6 new tests, 1,875 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 03:00 &mdash; Cross-cell relational reasoning
									(Partition V2)
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Extended partition cell map with 4 cross-cell relational
									modes: missing_from_global_palette,
									missing_from_row_palette, missing_from_col_palette,
									unique_vs_grid. Pre-computes per-cell palette stats and
									threads them through execution. Inspector now probes all 8
									modes per partition task, showing match/fail with per-mode
									cell mismatch counts. Diagnosis reports when all modes fail
									or when a winning mode is found. Refactored body executor
									into shared _partition_cell_fill for hypothesis/candidate
									reuse. 8 new tests, 1,862 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-20 01:00 &mdash; Partition cell map operator
									family
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New general partition/cell operator for same-size
									separator-grid tasks. PARTITION_CELL_MAP operates over
									detected partition cells, applying per-cell summary
									functions (dominant non-bg, unique non-bg, max/min color)
									and rendering back into the same cell layout with scaffold
									preserved. Added as ActionKind, BodyKind, hypothesis
									family, and beam search candidate generator. TaskContext
									now caches partition scenes (has_partition, partitions
									properties). 17 new tests, 1,854 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 23:00 &mdash; Task inspection tool
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New diagnostic inspector: python scripts/inspect_task.py
									--task-id ID. Shows task summary, hierarchical perception
									(plain vs partitioned), structural triples by category,
									hint predictions, library recall with per-pattern
									guard/bind/verify probing, full solver diagnostics with
									stage timings, and synthesized bottleneck diagnosis. Reuses
									existing pipeline (solve_with_diagnostics,
									recall_with_diagnostics) &mdash; no duplicate solve logic.
									Supports --json for machine-readable output, --show-grids
									for cell details. Diagnosis engine identifies 11 bottleneck
									classes from recorded signals. 25 new tests, 1,837 total.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 21:30 &mdash; Phase 4: separator-aware
									hierarchical perception
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									New perception path for separator-partitioned grids (e.g.
									09629e4f). Detects full-span separator rows/cols, extracts
									rectangular cells between them, builds per-cell sub-scenes
									with local background inference. New types: CellRegion,
									PartitionScene, HierarchicalScene.
									build_hierarchical_scene() overlays partition detection on
									existing scene graph. Structural triples gain 8 partition
									predicates (has_separator_grid, uniform_cells, cell
									palette/symmetry/object_count varies, cell_summary_task).
									SolveDiagnostics extended with perception_mode,
									partition_rows/cols/cell_count. Benchmark prints partition
									perception aggregate stats. 19 new tests, 1,809 total, 100%
									coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 18:00 &mdash; Neural-guided search, tiered library,
									diagnostics infrastructure
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									HintNet multi-head classifier predicts task priors (size
									family, action kind, flags) to rerank library recall,
									candidates, and beam search &mdash; model only reranks,
									verification stays in control. Pattern library now uses
									candidate/promoted/rejected tiers: promotion requires &ge;2
									distinct provenance tasks and non-source success;
									failure-based auto-demotion for high-use low-success patterns;
									default recall returns only promoted patterns. New --diag mode
									in benchmark.py emits per-task JSON with stage timing, recall
									quality, candidate coverage, beam stats, failure taxonomy, and
									hint quality metrics. Bug fixes: pixel_infer now tries
									geometric extractors before color maps (fixes generalization
									failure on fliplr tasks); action-family grouping now
									consistent between training and runtime; expensive solver
									stages (pixel infer, body sweep, neural) now respect timeout
									budget.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-19 14:00 &mdash; Comprehensive solve diagnostics
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added SolveDiagnostics dataclass capturing per-task timing,
									recall quality, failure taxonomy, and hint accuracy metrics.
									New solve_with_diagnostics() function instruments every
									pipeline stage (8 stages) with monotonic timing. Library gains
									recall_with_diagnostics() exposing cosine/hint_bonus/ hybrid
									scores per recalled pattern. Benchmark gets --diag flag that
									saves per-task JSON and prints aggregated summary:
									solved-by-stage breakdown, failure taxonomy, recall hit rate,
									avg stage time, hint quality metrics. 25 new tests, 1,695
									total, 100% coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-16 22:00 &mdash; Meta-strategy: auto-discover abstract
									rules
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Built diff-driven synthesis that replaces blind beam search
									with structural analysis. Meta-strategy tries 10 abstract
									feature extractors (neighbor count, object size rank, border
									detection) and picks the simplest one consistent across all
									training pairs. Leave-one-out validation prevents overfitting.
									Key insight: pixel-level memorization doesn&apos;t generalize;
									abstract features (IS_BORDER, NEIGHBOR_COUNT, SIZE_RANK) do.
									Also: candidate filtering by same_dims/diff_dims, param-shape
									sub-grouping in extraction, first-step decomposition for
									partial pattern learning. 92/400 train (+4), 1,391 tests, 100%
									coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-16 18:00 &mdash; Learning loop fixes: 3 param
									coordination fixes
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Three fixes to unblock the pattern learning loop. Fix 1: body
									executor normalizes short-form fold_symmetry modes
									(&ldquo;lr&rdquo;&rarr;&ldquo;sym_lr&rdquo;, etc.) so
									hypothesis params flow through the DSL pipeline. Fix 2: split
									mixed ActionKind groups &mdash; PATTERN_CONTINUATION,
									HOLLOW_RECT_OP, FRAME_FILL now have distinct signatures for
									cleaner extraction grouping. Fix 3: added selector_hint task
									property for property-based selector explanation in
									extract_object groups. 1,321 tests, 100% coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-16 16:30 &mdash; 13 new BodyKinds for pattern
									generalization
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added 13 new BodyKind enum values with full implementations:
									UPSCALE_BLOCK, EXTRACT_BY_PREDICATE, STAMP_AT_MARKERS,
									SEPARATOR_SUMMARY, COLOR_SUBSTITUTE, STACK_CONCAT, DRAW_LINE,
									RIGID_SHIFT, DAMAGE_REPAIR, PATTERN_EXTEND, NEIGHBOR_RULE,
									SLIDE_TO_WALL, COUNT_ENCODE. These enable the learning loop to
									generalize hypothesis solutions into reusable patterns. MOVE
									and EXTEND_LINE unstubbed (delegate to RIGID_SHIFT and
									DRAW_LINE). Updated antiunify mappings for 16 action types.
									Pattern DSL body vocabulary: 21 &rarr; 34. 1,313 tests, 100%
									coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-17 00:15 &mdash; Port 12 inference engines (batch 3)
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Ported 12 more inference engines from ericagi as candidate
									generators: directed cross, gravity fill, bbox complement
									fill, translate to target, connect over bg, recolor to
									closest, diagonal stamp, object outline, row period
									fill/extend, col period extend, pattern substitution. 88/400
									train (22.0%), 54 candidate generators, 1,168 tests, 100%
									coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-16 23:30 &mdash; Output construction hypothesis
									families
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added 7 new hypothesis families targeting diff-dims tasks:
									separator cell summary, upscale block, stack objects, crop to
									colored region, select unique cell from separator grid, 1x1
									summary, and input-as-template. These handle the 138 unsolved
									diff-dims tasks (crop, scale, summary, stacking categories).
									88/400 train (+12), 17 hypotheses total, 1,226 tests, 100%
									coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-16 22:45 &mdash; Hypothesis families + ported
									inference engines
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added 6 new hypothesis families (template stamp, color
									mapping, gravity, symmetry completion, fill enclosed, extract
									by predicate) for instant pattern recognition before beam
									search. Ported 5 inference engines as candidates (diagonal
									connect, cross extension, gravity align, gap fill, rigid
									shift). 76/400 train (+3), 10 hypotheses, 42 candidate
									generators, 1050 tests, 100% coverage.
								</p>
							</div>
							<div
								style={{
									borderLeft: "2px solid var(--accent)",
									paddingLeft: "12px",
								}}
							>
								<p
									className="text-xs font-medium"
									style={{ color: "var(--fg)" }}
								>
									2026-03-16 20:30 &mdash; Role-aware candidate generators
								</p>
								<p
									className="mt-1 text-xs leading-relaxed"
									style={{ color: "var(--muted)" }}
								>
									Added 5 scene-graph-driven candidate generators that use role
									classification (FRAME, SEPARATOR, MARKER, TEMPLATE, LEGEND) to
									propose structured transformations: stamp template at markers,
									template recolor at markers, frame interior fill, separator
									grid operations, and legend color mapping. 73/400 train (+1),
									951 tests, 100% coverage.
								</p>
							</div>
						</div>
					</div>

					{/* ARC palette strip */}
					<div className="mt-12 flex gap-[2px]">
						{ARC.slice(1).map((color, i) => (
							<div
								key={i}
								style={{
									flex: 1,
									height: "3px",
									backgroundColor: color,
									opacity: 0.5,
								}}
							/>
						))}
					</div>
				</section>
			</div>
		</>
	);
}
