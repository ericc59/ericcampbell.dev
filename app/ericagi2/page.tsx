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
	{ step: "perceive", desc: "64-dim feature vector from grid" },
	{ step: "recall", desc: "cosine similarity against library" },
	{ step: "apply", desc: "guard \u2192 bind \u2192 body \u2192 verify" },
	{ step: "search", desc: "beam search, 21 candidate types" },
	{ step: "extract", desc: "group by signature, anti-unify" },
	{ step: "learn", desc: "add patterns for next round" },
];

const changelog = [
	{
		date: "Mar 16, 9 PM",
		title: "Object-centric solver candidate generator",
		body: "Port ericagi object solver as candidate generator. Detect objects, match by IoU+shape+color, infer per-object transforms (delete, translate, recolor, rotate, flip). Consistency check across pairs, 2 connectivity configs. 69\u219272 train solves (17.2%\u219218.0%).",
	},
	{
		date: "Mar 16, 5 PM",
		title: "Port 7 ericagi inference engines",
		body: "Extract unique object (6 criteria), neighbor recolor, hollow rect ops (cross-hair/gap-spill/size-fill), minority extraction, pattern continuation, damage repair/extract, upscale. 8 new candidate generators, 130 new tests.",
	},
	{
		date: "Mar 15, 8 PM",
		title: "Perception infrastructure",
		body: "Frames, roles, legend detection, object extraction. RoleType enum, 5 directional RelTypes, frame detection via perimeter analysis. 42\u219246 solves.",
	},
	{
		date: "Mar 15, 4:30 PM",
		title: "Tile pattern learning",
		body: "Tile tasks extract into reusable pattern. PROPERTY binding fix for eager resolution. 7\u21928 library patterns.",
	},
	{
		date: "Mar 15, 12 AM",
		title: "Compound extraction loop",
		body: "7 distinct ActionKinds from generic PIXEL_RULE. 5 new task properties. LOO verification in pipeline.",
	},
	{
		date: "Mar 14, 11 PM",
		title: "Smart crop + object transforms",
		body: "Symmetry completion (4 axes), self-tile with mirror, grid decomposition. 39\u219242 solves.",
	},
	{
		date: "Mar 14, 9 PM",
		title: "Stamp template, grid decompose",
		body: "Stamp at seed markers, separator-based decomposition, pixel neighborhood rules. 32\u219239.",
	},
	{
		date: "Mar 14, 6 PM",
		title: "Iterative extraction + dedup",
		body: "Multi-round extraction pipeline with pattern name deduplication.",
	},
	{
		date: "Mar 14, 3 PM",
		title: "6 new candidate generators",
		body: "Pixel remap, object recolor/removal, symmetry, fill enclosed, connect same-color. 11\u219232 solves.",
	},
];

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

export default function Ericagi2Page() {
	return (
		<>
			<style>{`
				.eg2 {
					--accent: #e53aa3;
					--accent-dim: rgba(229, 58, 163, 0.15);
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
			`}</style>

			<section
				className="eg2"
				style={{
					background:
						"radial-gradient(ellipse at 40% 15%, rgba(229,58,163,0.03) 0%, transparent 55%)",
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
						style={{ color: "var(--muted)" }}
					>
						Pattern-learning ARC solver. Successor to{" "}
						<a href="/arc-agi" className="eg2-link">
							EricAGI
						</a>
						.
						<br />
						3,629 lines of Python. No LLMs.
					</p>
				</div>

				{/* Grid transformation */}
				<div
					className="mt-10 eg2-fade"
					style={{ animationDelay: "150ms" }}
				>
					<div className="flex items-center gap-6">
						<div>
							<ArcGrid data={INPUT} offset={400} />
							<p className="mt-2 eg2-label">input</p>
						</div>
						<span
							className="text-xl"
							style={{ color: "var(--dim)" }}
						>
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
								["46/400", "TRAIN"],
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
					<p className="eg2-section-title">HOW IT WORKS</p>
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
									style={{ color: "var(--accent)", width: "14px" }}
								>
									{String(i + 1).padStart(2, "0")}
								</span>
								<span
									className="text-xs font-medium shrink-0"
									style={{
										color: "var(--fg)",
										width: "5rem",
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

				{/* Changelog */}
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "450ms" }}
				>
					<p className="eg2-section-title">CHANGELOG</p>
					<div className="mt-4 space-y-0">
						{changelog.map((entry, i) => (
							<div
								key={i}
								style={{
									padding: "10px 0",
									borderBottom:
										i < changelog.length - 1
											? "1px solid var(--border)"
											: "none",
								}}
							>
								<div className="flex items-baseline gap-3">
									<span
										className="text-[10px] tabular-nums shrink-0"
										style={{
											color:
												i === 0
													? "var(--accent)"
													: "var(--dim)",
											width: "6.5rem",
										}}
									>
										{entry.date}
									</span>
									<span
										className="text-xs font-medium"
										style={{ color: "var(--fg)" }}
									>
										{entry.title}
									</span>
								</div>
								<p
									className="mt-1 text-[11px] leading-relaxed"
									style={{
										color: "var(--dim)",
										paddingLeft: "6.5rem",
										marginLeft: "0.75rem",
									}}
								>
									{entry.body}
								</p>
							</div>
						))}
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
