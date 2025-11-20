import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
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

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cx(
				"text-neutral-200 bg-obsidian antialiased",
				GeistSans.variable,
				GeistMono.variable,
			)}
		>
			<head>
				<SandpackCSS />
			</head>
			<body className="antialiased max-w-6xl mb-40 flex flex-col mx-4 mt-8 lg:mx-auto bg-transparent">
				<main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
					<Navbar />
					{children}
					<Analytics />
					<SpeedInsights />
				</main>
			</body>
		</html>
	);
}
