import Link from "next/link";

const navItems = [
	{ href: "/#work", name: "work" },
	{ href: "/#projects", name: "projects" },
	{ href: "/blog", name: "writing" },
	{ href: "/arc-agi", name: "arc agi solver" },
];

export function Navbar() {
	return (
		<header className="pt-12 pb-16 lg:pt-16 lg:pb-20">
			<nav className="flex items-center justify-between text-xs">
				<Link
					href="/"
					className="text-zinc-400 hover:text-zinc-200 transition-colors"
				>
					eric campbell
				</Link>

				<div className="flex items-center gap-5">
					{navItems.map(({ href, name }) => (
						<Link
							key={href}
							href={href}
							className="text-zinc-400 hover:text-zinc-300 transition-colors"
						>
							{name}
						</Link>
					))}
				</div>
			</nav>
		</header>
	);
}
