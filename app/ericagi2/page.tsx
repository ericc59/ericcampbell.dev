import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "ericagi2",
	description:
		"Pattern-learning ARC solver. Learns reusable patterns from solved tasks instead of hand-crafting inference engines.",
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
	color: ["color-remap", "object-recolor", "object-removal", "recolor-by-property"],
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
											animationName:
												"eg2-cell-appear, eg2-cell-glow",
											animationDuration: "0.3s, 0.8s",
											animationTimingFunction:
												"ease-out, ease-in-out",
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
				.eg2 {
					--accent: #e53aa3;
					--fg: #e4e4e7;
					--muted: #71717a;
					--dim: #52525b;
					--border: #27272a;
					--surface: rgba(24, 24, 27, 0.5);
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
					color: var(--dim);
				}

				.eg2-section-title {
					font-size: 11px;
					text-transform: uppercase;
					letter-spacing: 0.2em;
					font-weight: 500;
					color: var(--muted);
				}

				.eg2-divider {
					height: 1px;
					background: var(--border);
				}

				.eg2-tag {
					display: inline-block;
					font-size: 10px;
					letter-spacing: 0.04em;
					padding: 2px 6px;
					border: 1px solid var(--border);
					color: var(--muted);
					white-space: nowrap;
				}

				.eg2-cat {
					font-size: 10px;
					text-transform: uppercase;
					letter-spacing: 0.15em;
					color: var(--accent);
					width: 5.5rem;
					flex-shrink: 0;
					padding-top: 3px;
				}

				.eg2-count {
					font-size: 10px;
					color: var(--accent);
					font-weight: 500;
				}
			`}</style>

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
						ERICAGI2
					</h1>
					<p
						className="mt-2 text-sm leading-relaxed"
						style={{ color: "var(--muted)", maxWidth: "26rem" }}
					>
						Pattern-learning ARC solver. Successor to{" "}
						<a href="/arc-agi" className="eg2-link">
							EricAGI
						</a>
						. Instead of hand-crafted inference engines, this system
						learns reusable patterns from solved tasks and compounds
						them across rounds. 3,629 lines of Python, no LLMs.
					</p>
				</div>

				{/* Grid transformation */}
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "150ms" }}
				>
					<div className="flex items-center gap-6">
						<div>
							<ArcGrid data={INPUT} offset={400} />
							<p className="mt-2 eg2-label">input</p>
						</div>
						<span className="text-xl" style={{ color: "var(--dim)" }}>
							&#9656;
						</span>
						<div>
							<ArcGrid
								data={OUTPUT}
								offset={1200}
								highlight={CHANGED}
							/>
							<p className="mt-2 eg2-label">output</p>
						</div>
					</div>
				</div>

				<div
					className="eg2-divider mt-10 eg2-fade"
					style={{ animationDelay: "200ms" }}
				/>

				{/* Stats */}
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "250ms" }}
				>
					<div className="grid grid-cols-3 gap-2">
						{(
							[
								["72/400", "TRAIN"],
								["8/400", "EVAL"],
								["~14s", "TIME"],
								["3,629", "LINES"],
								["664", "TESTS"],
								["8", "PATTERNS"],
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
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "350ms" }}
				>
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
								<span
									className="text-xs"
									style={{ color: "var(--muted)" }}
								>
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
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "450ms" }}
				>
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
						style={{ color: "var(--dim)", maxWidth: "28rem" }}
					>
						Each grid is parsed into a scene graph: objects detected
						via connected components, classified by role, linked by
						spatial relations, and summarized as a 64-dim feature
						vector for library recall.
					</p>
					<div className="mt-4 space-y-3">
						<div className="flex gap-3">
							<span className="eg2-cat">
								roles{" "}
								<span className="eg2-count">
									{perception.roles.length}
								</span>
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
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "550ms" }}
				>
					<div className="flex items-baseline justify-between">
						<p className="eg2-section-title">
							CANDIDATE GENERATORS
						</p>
						<span className="eg2-count">{totalCandidates}</span>
					</div>
					<p
						className="mt-2 text-xs leading-relaxed"
						style={{ color: "var(--dim)", maxWidth: "28rem" }}
					>
						When no library pattern matches, beam search tries these
						generators. Each proposes candidate actions scored by
						minimum description length.
					</p>
					<div className="mt-4 space-y-3">
						{Object.entries(candidates).map(([cat, items]) => (
							<div key={cat} className="flex gap-3">
								<span className="eg2-cat">
									{cat}{" "}
									<span className="eg2-count">
										{items.length}
									</span>
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
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "650ms" }}
				>
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
						style={{ color: "var(--dim)", maxWidth: "28rem" }}
					>
						Learned patterns are stored as guard \u2192 bind \u2192
						body programs. Guards check preconditions, binds extract
						task-specific values, and the body applies parameterized
						actions.
					</p>
					<div className="mt-4 space-y-3">
						<div className="flex gap-3">
							<span className="eg2-cat">
								guard{" "}
								<span className="eg2-count">
									{patternDSL.guard.length}
								</span>
							</span>
							<Tags items={patternDSL.guard} />
						</div>
						<div className="flex gap-3">
							<span className="eg2-cat">
								bind{" "}
								<span className="eg2-count">
									{patternDSL.bind.length}
								</span>
							</span>
							<Tags items={patternDSL.bind} />
						</div>
						<div className="flex gap-3">
							<span className="eg2-cat">
								body{" "}
								<span className="eg2-count">
									{patternDSL.body.length}
								</span>
							</span>
							<Tags items={patternDSL.body} />
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
		</>
	);
}
