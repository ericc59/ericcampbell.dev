import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "ericagi2",
	description:
		"Pattern-learning ARC solver. Learns reusable patterns from solved tasks instead of hand-crafting inference engines.",
};

const stats = {
	trainSolve: "46/400 (11.5%)",
	evalSolve: "8/400 (2.0%)",
	sourceLines: "3,629",
	tests: "664 (100% coverage)",
	libraryPatterns: "8 (4 seed + 4 learned)",
	solveTime: "~14s for 400 tasks",
};

const changelog = [
	{
		date: "March 15, 2026 8:00 PM CDT",
		title: "Perception infrastructure: frames, roles, legend detection, object extraction",
		body: "Added RoleType enum (FRAME, SEPARATOR, MARKER, TEMPLATE, LEGEND, CONTENT) and 5 new directional RelTypes (ABOVE, BELOW, LEFT_OF, RIGHT_OF, INSIDE). Frame detection via perimeter analysis + containment tree for objects inside frames. Role assignment wired into build_scene. New legend.py with separator-based and edge-strip legend detection (color-pair extraction). Two new candidate generators: extract-by-role (largest/smallest object) and frame-interior extraction. 42 to 46 solves (10.5% to 11.5%). 664 tests, 100% coverage.",
	},
	{
		date: "March 15, 2026 4:30 PM CDT",
		title: "Tile pattern learning + PROPERTY binding fix",
		body: "Tile tasks (8 total) now extract into a reusable pattern. Added tile_mirror computed property to detect mirror vs simple tiling from grid dimensions. Fixed PROPERTY bindings in eval_bind.py to eagerly resolve task properties instead of returning deferred dicts that body executors couldn't consume. Added h_ratio, w_ratio, tile_mirror to the property-to-bind search. Library grows from 7 to 8 patterns. 605 tests, 100% coverage.",
	},
	{
		date: "March 15, 2026 12:00 AM CDT",
		title: "Compound extraction loop",
		body: "Split generic PIXEL_RULE into 7 distinct ActionKinds (EXTRACT_COLOR_BBOX, EXTRACT_OBJECT, CROSS_FILL, LINE_EXTEND, BORDER_OUTLINE, COLOR_FLOOD, NEIGHBORHOOD_RULE). Added 5 new task properties for richer parameter explanation. Added LOO verification in pipeline. 562 tests, 100% coverage, 42/400 benchmark maintained.",
	},
	{
		date: "March 14, 2026 11:00 PM CDT",
		title: "Smart crop selectors, object transforms, additive extensions",
		body: "Added crop-to-content and object-extraction candidates. Added symmetry completion (4 axes). Self-tile with mirror variant. Grid decomposition (separator-based: OR/AND/majority/XOR/select). 39 to 42 solves (9.8% to 10.5%).",
	},
	{
		date: "March 14, 2026 9:00 PM CDT",
		title: "Stamp template, grid decompose, pixel rules",
		body: "Added stamp template at seed markers, grid decomposition via separators, and pixel neighborhood rules. 32 to 39 solves (8% to 9.8%).",
	},
	{
		date: "March 14, 2026 6:00 PM CDT",
		title: "Iterative extraction + dedup",
		body: "Extraction pipeline runs multiple rounds, stopping when no new patterns are found. Deduplication by pattern name. Clean up pipeline module.",
	},
	{
		date: "March 14, 2026 3:00 PM CDT",
		title: "6 new candidate generators",
		body: "Added pixel color remap, object recolor, object removal, symmetry completion, fill enclosed, connect same-color. 11 to 32 solves (2.8% to 8.0%).",
	},
];

export default function Ericagi2Page() {
	return (
		<section className="space-y-8">
			<header>
				<h1 className="text-lg font-medium text-zinc-100">ericagi2</h1>
				<p className="mt-2 text-sm text-zinc-400 leading-relaxed">
					Pattern-learning ARC solver. Successor to{" "}
					<a
						href="/arc-agi"
						className="text-zinc-300 hover:text-zinc-100 transition-colors"
					>
						EricAGI
					</a>
					. Instead of 94K lines of hand-crafted inference engines, this system
					learns reusable patterns from solved tasks and compounds them across
					rounds. 3,318 lines of Python, no LLMs.
				</p>
			</header>

			<div className="grid grid-cols-3 gap-2 text-center">
				{[
					["ARC-1 Train", stats.trainSolve],
					["ARC-1 Eval", stats.evalSolve],
					["Solve Time", stats.solveTime],
					["Source Lines", stats.sourceLines],
					["Tests", stats.tests],
					["Library", stats.libraryPatterns],
				].map(([label, value]) => (
					<div
						key={label}
						className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5"
					>
						<p className="text-[10px] uppercase tracking-wider text-zinc-500">
							{label}
						</p>
						<p className="mt-1 text-xs font-medium text-zinc-200">{value}</p>
					</div>
				))}
			</div>

			<div>
				<h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
					How it works
				</h2>
				<pre className="mt-2 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-400 leading-relaxed">
					{`perceive task
  -> compute 64-dim feature vector
  -> recall matching patterns (cosine similarity)
  -> if pattern matches: guard -> bind -> body -> verify
  -> if no pattern: beam search with 13 candidate types
  -> after batch: group by signature, anti-unify, validate
  -> add learned patterns to library for next round`}
				</pre>
			</div>

			<div>
				<h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
					Changelog
				</h2>
				<div className="mt-2 space-y-px overflow-hidden rounded-lg border border-zinc-800">
					{changelog.map((entry, i) => (
						<div
							key={i}
							className={`bg-zinc-900/40 px-4 py-3 ${i > 0 ? "border-t border-zinc-800/50" : ""}`}
						>
							<div className="flex items-baseline gap-3">
								<p className="shrink-0 text-[10px] tabular-nums text-zinc-600">
									{entry.date}
								</p>
								<p className="text-xs font-medium text-zinc-300">
									{entry.title}
								</p>
							</div>
							<p className="mt-1 text-xs text-zinc-500 leading-relaxed">
								{entry.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
