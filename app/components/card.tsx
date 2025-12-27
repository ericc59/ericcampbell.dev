export function Card({ children }: { children: React.ReactNode }) {
	return (
		<div className="group relative bg-surface/30 border border-elevated hover:border-lime-400/30 transition-all duration-300 p-6">
			{/* Corner accents */}
			<div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-lime-400/30 transition-colors duration-300" />
			<div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-transparent group-hover:border-lime-400/30 transition-colors duration-300" />

			{children}

			{/* Bottom accent line */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</div>
	);
}
