export function Card({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 hover:border-neon/50 transition-all duration-300 p-5 rounded-2xl hover:shadow-[0_0_30px_-10px_rgba(45,255,192,0.1)]">
			{children}
		</div>
	);
}
