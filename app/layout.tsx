import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { SandpackCSS } from "./blog/[slug]/sandpack";
import { Navbar } from "./components/nav";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.ericcampbell.dev"),
	title: {
		default: "Eric Campbell",
		template: "%s | Eric Campbell",
	},
	description: "Software engineering leader and startup founder.",
	openGraph: {
		title: "Eric Campbell",
		description: "Software engineering leader and startup founder.",
		url: "https://www.ericcampbell.dev",
		siteName: "Eric Campbell",
		locale: "en_US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Eric Campbell",
		card: "summary_large_image",
	},
	verification: {
		google: "",
		yandex: "",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="bg-void text-cream antialiased">
			<head>
				<SandpackCSS />
			</head>
			<body className="antialiased min-h-screen relative">
				{/* Ambient glow effect - top */}
				<div
					className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-30"
					style={{
						background:
							"radial-gradient(ellipse at center, rgba(255, 155, 66, 0.15) 0%, transparent 70%)",
					}}
				/>

				{/* Main content container */}
				<div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
					<Navbar />
					<main className="pb-32">{children}</main>

					{/* Footer */}
					<footer className="border-t border-elevated py-12 mt-20">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
							<div className="space-y-2">
								<p className="font-mono text-xs text-ash uppercase tracking-widest">
									Signal Transmission
								</p>
								<p className="text-stone text-sm">
									Building the future, one commit at a time.
								</p>
							</div>
							<div className="flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
								<span className="font-mono text-xs text-ash">
									SYSTEM ONLINE
								</span>
							</div>
						</div>
					</footer>
				</div>

				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
