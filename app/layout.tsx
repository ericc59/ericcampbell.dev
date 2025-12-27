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
		<html lang="en" className=" text-cream antialiased">
			<head>
				<SandpackCSS />
			</head>
			<body className="antialiased min-h-screen relative">
				{/* Main content container */}
				<div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
					<Navbar />
					<main className="pb-32">{children}</main>
				</div>

				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
