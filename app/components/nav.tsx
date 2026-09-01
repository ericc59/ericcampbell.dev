import Link from "next/link";

const navItems = [
	{ href: "/#work", name: "work" },
	{ href: "/#projects", name: "projects" },
	{ href: "https://pylonsync.com", name: "pylon" },
	{ href: "/synth-path", name: "synthpath" },
	{ href: "/mast", name: "mast" },
];

export function Navbar() {
	return (
		<header className="pt-12 pb-16 lg:pt-16 lg:pb-20">
			<nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs">
				<Link
					href="/"
					className="whitespace-nowrap text-zinc-400 hover:text-zinc-200 transition-colors"
				>
					eric campbell
				</Link>

				<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
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
