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
				border border-elevated bg-surface/50
				leading-4 text-stone no-underline
				hover:border-lime-400/50 hover:text-lime-400
				transition-all duration-300
				font-mono
				${size === "lg" ? "p-2 text-xl font-semibold gap-1" : "px-2 py-1 text-xs"}
				${className}
			`}
		/>
	);
}
