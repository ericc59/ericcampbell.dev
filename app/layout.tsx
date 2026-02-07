import "./global.css";
import { GeistMono } from "geist/font/mono";
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
	description:
		"Software engineering leader building AI infrastructure. Former Zapier Principal Engineer. Founder of 4 acquired startups.",
	openGraph: {
		title: "Eric Campbell",
		description:
			"Software engineering leader building AI infrastructure. Former Zapier Principal Engineer. Founder of 4 acquired startups.",
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
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${GeistMono.variable} antialiased`}>
			<head>
				<SandpackCSS />
			</head>
			<body className="antialiased min-h-screen font-mono">
				<div className="max-w-xl mx-auto px-6">
					<Navbar />
					<main className="pb-24">{children}</main>
				</div>

				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
