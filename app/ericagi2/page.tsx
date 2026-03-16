import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";

export const metadata: Metadata = {
	title: "ericagi2",
	description:
		"Pattern-learning ARC solver. Learns reusable patterns from solved tasks instead of hand-crafting inference engines.",
};

const serif = EB_Garamond({
	subsets: ["latin"],
	style: ["normal", "italic"],
	weight: ["400", "500"],
	display: "swap",
});

const ARC = [
	"#0a0a0a",
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
	offset = 0,
	highlight,
}: {
	data: number[][];
	offset?: number;
	highlight?: Set<string>;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${data[0].length}, 13px)`,
				gap: "1.5px",
			}}
		>
			{data.flatMap((row, r) =>
				row.map((v, c) => {
					const delay = offset + (r * row.length + c) * 35;
					const changed = highlight?.has(`${r}-${c}`);
					return (
						<div
							key={`${r}-${c}`}
							className="eg2-cell"
							style={{
								width: 13,
								height: 13,
								backgroundColor: ARC[v],
								animationDelay: `${delay}ms`,
								...(changed
									? {
											animationName: "eg2-cell-appear, eg2-cell-glow",
											animationDuration: "0.25s, 0.8s",
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

export default function Ericagi2Page() {
	return (
		<>
			<style>{`
				.eg2 {
					--ochre: #c49a6c;
					--cream: #ede6d8;
					--sand: #9a8e7d;
					--bark: #2d2822;
				}

				@keyframes eg2-cell-appear {
					from { opacity: 0; transform: scale(0.3); }
					to { opacity: 1; transform: scale(1); }
				}
				@keyframes eg2-cell-glow {
					0%, 100% { filter: brightness(1); }
					40% { filter: brightness(2); }
				}
				.eg2-cell {
					animation: eg2-cell-appear 0.25s ease-out both;
					border-radius: 1px;
				}

				@keyframes eg2-fade-up {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.eg2-fade { animation: eg2-fade-up 0.5s ease-out both; }

				@keyframes eg2-arrow {
					0%, 100% { opacity: 0.3; }
					50% { opacity: 1; }
				}
				.eg2-link {
					color: var(--ochre);
					transition: color 0.15s ease;
				}
				.eg2-link:hover {
					color: var(--cream);
				}
			`}</style>

			<section
				className="eg2"
				style={{
					background:
						"radial-gradient(ellipse at 20% -10%, rgba(196,154,108,0.035) 0%, transparent 65%)",
					margin: "-1rem -0.5rem 0",
					padding: "1rem 0.5rem 0",
				}}
			>
				{/* Hero */}
				<div className="flex items-start justify-between gap-6">
					<div className="eg2-fade">
						<h1
							className={serif.className}
							style={{
								fontSize: "2.75rem",
								lineHeight: 1,
								letterSpacing: "-0.02em",
								color: "var(--cream)",
								fontStyle: "italic",
								fontWeight: 400,
							}}
						>
							ericagi2
						</h1>
						<p
							className="mt-3 leading-relaxed"
							style={{ fontSize: "13px", color: "var(--sand)" }}
						>
							Pattern-learning ARC solver. Successor to{" "}
							<a
								href="/arc-agi"
								className="eg2-link"
							>
								EricAGI
							</a>
							.
							<br />
							3,629 lines of Python. No LLMs.
						</p>
					</div>

					<div
						className="flex items-center gap-3 shrink-0 pt-1 eg2-fade"
						style={{ animationDelay: "150ms" }}
					>
						<div className="text-center">
							<ArcGrid data={INPUT} offset={300} />
							<p
								className="mt-1.5 uppercase"
								style={{
									fontSize: "9px",
									letterSpacing: "0.15em",
									color: "var(--sand)",
								}}
							>
								in
							</p>
						</div>
						<span
							style={{
								fontSize: "1.125rem",
								color: "var(--ochre)",
								animation: "eg2-arrow 2.5s ease-in-out infinite",
								animationDelay: "1.4s",
							}}
						>
							&#9656;
						</span>
						<div className="text-center">
							<ArcGrid data={OUTPUT} offset={1100} highlight={CHANGED} />
							<p
								className="mt-1.5 uppercase"
								style={{
									fontSize: "9px",
									letterSpacing: "0.15em",
									color: "var(--sand)",
								}}
							>
								out
							</p>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div
					className="mt-8"
					style={{
						height: "1px",
						background:
							"linear-gradient(to right, var(--ochre), transparent 80%)",
						opacity: 0.4,
					}}
				/>

				{/* Stats */}
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "250ms" }}
				>
					<div className="flex items-end gap-10">
						<div>
							<p
								className={serif.className}
								style={{
									fontSize: "3.5rem",
									lineHeight: 1,
									color: "var(--ochre)",
									fontWeight: 400,
									letterSpacing: "-0.02em",
								}}
							>
								46
							</p>
							<p
								className="mt-1 uppercase"
								style={{
									fontSize: "10px",
									letterSpacing: "0.15em",
									color: "var(--sand)",
								}}
							>
								of 400 train tasks
							</p>
						</div>
						<div style={{ borderLeft: "1px solid var(--bark)", paddingLeft: "2rem" }}>
							<p
								className={serif.className}
								style={{
									fontSize: "2.25rem",
									lineHeight: 1,
									color: "var(--cream)",
									fontWeight: 400,
									letterSpacing: "-0.02em",
								}}
							>
								8
							</p>
							<p
								className="mt-1 uppercase"
								style={{
									fontSize: "10px",
									letterSpacing: "0.15em",
									color: "var(--sand)",
								}}
							>
								of 400 eval tasks
							</p>
						</div>
					</div>

					<div className="mt-6 flex gap-8">
						{(
							[
								["~14s", "400 tasks"],
								["664", "tests"],
								["8", "patterns"],
								["100%", "coverage"],
							] as const
						).map(([val, label]) => (
							<div key={label}>
								<p
									className="font-medium"
									style={{ fontSize: "14px", color: "var(--cream)" }}
								>
									{val}
								</p>
								<p
									className="uppercase"
									style={{
										fontSize: "10px",
										letterSpacing: "0.15em",
										color: "var(--sand)",
									}}
								>
									{label}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Divider */}
				<div
					className="mt-8"
					style={{
						height: "1px",
						background:
							"linear-gradient(to right, var(--ochre), transparent 80%)",
						opacity: 0.4,
					}}
				/>

				{/* Pipeline */}
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "350ms" }}
				>
					<h2
						className={serif.className}
						style={{
							fontSize: "1.25rem",
							color: "var(--cream)",
							fontStyle: "italic",
							fontWeight: 400,
						}}
					>
						How it works
					</h2>
					<div className="mt-4 relative" style={{ paddingLeft: "20px" }}>
						<div
							className="absolute top-0 bottom-0"
							style={{
								left: 0,
								width: "1px",
								backgroundColor: "var(--bark)",
							}}
						/>
						<div className="space-y-3">
							{pipeline.map((p) => (
								<div key={p.step} className="relative flex items-baseline gap-3">
									<div
										className="absolute rounded-full"
										style={{
											left: "-23px",
											top: "5px",
											width: "7px",
											height: "7px",
											backgroundColor: "var(--ochre)",
										}}
									/>
									<p
										className="shrink-0 font-medium"
										style={{
											width: "5rem",
											fontSize: "12px",
											color: "var(--cream)",
										}}
									>
										{p.step}
									</p>
									<p style={{ fontSize: "12px", color: "var(--sand)" }}>
										{p.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Divider */}
				<div
					className="mt-8"
					style={{
						height: "1px",
						background:
							"linear-gradient(to right, var(--ochre), transparent 80%)",
						opacity: 0.4,
					}}
				/>

				{/* Changelog */}
				<div
					className="mt-8 eg2-fade"
					style={{ animationDelay: "450ms" }}
				>
					<h2
						className={serif.className}
						style={{
							fontSize: "1.25rem",
							color: "var(--cream)",
							fontStyle: "italic",
							fontWeight: 400,
						}}
					>
						Changelog
					</h2>
					<div className="mt-4 relative" style={{ paddingLeft: "20px" }}>
						<div
							className="absolute top-0"
							style={{
								left: 0,
								width: "1px",
								bottom: "0.75rem",
								backgroundColor: "var(--bark)",
							}}
						/>
						<div className="space-y-5">
							{changelog.map((entry, i) => (
								<div key={i} className="relative">
									<div
										className="absolute rounded-full"
										style={{
											left: "-23px",
											top: "4px",
											width: "7px",
											height: "7px",
											backgroundColor:
												i === 0 ? "var(--ochre)" : "transparent",
											border:
												i === 0
													? "none"
													: "1.5px solid var(--sand)",
											opacity: i === 0 ? 1 : 0.5,
										}}
									/>
									<p
										className="tabular-nums"
										style={{ fontSize: "10px", color: "var(--sand)", opacity: 0.7 }}
									>
										{entry.date}
									</p>
									<p
										className="mt-0.5 font-medium"
										style={{ fontSize: "13px", color: "var(--cream)" }}
									>
										{entry.title}
									</p>
									<p
										className="mt-0.5 leading-relaxed"
										style={{
											fontSize: "11px",
											color: "var(--sand)",
											opacity: 0.7,
										}}
									>
										{entry.body}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* ARC palette strip */}
				<div className="mt-12 mb-2 flex gap-[3px]">
					{ARC.slice(1).map((color, i) => (
						<div
							key={i}
							style={{
								width: "100%",
								height: "2px",
								backgroundColor: color,
								opacity: 0.4,
							}}
						/>
					))}
				</div>
			</section>
		</>
	);
}
