export function Badge(props) {
	return (
		<a
			{...props}
			target="_blank"
			rel="noopener noreferrer"
			className={`inline-flex whitespace-nowrap items-center rounded-md border border-neutral-800 bg-neutral-900/80 leading-4 text-neutral-400 no-underline hover:border-neon/50 hover:text-neon transition-all duration-200 font-mono ${
				props.size === "lg" ? "p-2 text-xl font-semibold gap-1" : "p-1 text-sm"
			} ${props.className}`}
		/>
	);
}
