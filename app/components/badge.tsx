export function Badge(props: {
	href?: string;
	size?: "lg" | "sm";
	className?: string;
	children?: React.ReactNode;
	[key: string]: any;
}) {
	const { size = "sm", className = "", ...rest } = props;

	return (
		<a
			{...rest}
			target="_blank"
			rel="noopener noreferrer"
			className={`
				inline-flex whitespace-nowrap items-center
				border border-zinc-800 bg-zinc-900/50
				leading-4 text-zinc-400 no-underline
				hover:border-emerald-400/50 hover:text-emerald-400
				transition-colors duration-300
				font-mono
				${size === "lg" ? "p-2 text-xl font-semibold gap-1" : "px-2 py-1 text-xs"}
				${className}
			`}
		/>
	);
}
