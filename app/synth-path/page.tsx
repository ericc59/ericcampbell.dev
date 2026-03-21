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
