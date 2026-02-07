import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{ts,tsx}", "./content/**/*.mdx", "./public/**/*.svg"],
	theme: {
		extend: {
			colors: {
				// Copper-gold accent palette
				copper: {
					DEFAULT: "#C8956C",
					light: "#DEB48E",
					dark: "#A67449",
					glow: "rgba(200, 149, 108, 0.35)",
					muted: "rgba(200, 149, 108, 0.12)",
				},
				// Deep charcoal backgrounds
				void: "#0C0C0E",
				abyss: "#111114",
				depth: "#17171B",
				surface: "#1E1E23",
				elevated: "#2A2A31",
				// Text hierarchy
				cream: "#EDE8E0",
				sand: "#B5AFA5",
				ash: "#706B63",
				faint: "#3D3A36",
				// Signal colors
				signal: {
					green: "#6BCB77",
					red: "#E85D5D",
					blue: "#6BA3CB",
				},
			},
			fontFamily: {
				display: ["Instrument Serif", "Georgia", "serif"],
				mono: ["DM Mono", "monospace"],
				sans: ["var(--font-geist-sans)"],
			},
			typography: {
				DEFAULT: {
					css: {
						"--tw-prose-body": "#B5AFA5",
						"--tw-prose-headings": "#EDE8E0",
						"--tw-prose-links": "#C8956C",
						"--tw-prose-bold": "#DEB48E",
						"--tw-prose-counters": "#706B63",
						"--tw-prose-bullets": "#706B63",
						"--tw-prose-hr": "#2A2A31",
						"--tw-prose-quotes": "#B5AFA5",
						"--tw-prose-quote-borders": "#C8956C",
						"--tw-prose-captions": "#706B63",
						"--tw-prose-code": "#DEB48E",
						"--tw-prose-pre-code": "#EDE8E0",
						"--tw-prose-pre-bg": "#111114",
						"--tw-prose-th-borders": "#2A2A31",
						"--tw-prose-td-borders": "#1E1E23",
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-glow":
					"radial-gradient(ellipse at center, rgba(200, 149, 108, 0.08) 0%, transparent 70%)",
				"gradient-vignette":
					"radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(12, 12, 14, 0.5) 100%)",
			},
			boxShadow: {
				glow: "0 0 30px rgba(200, 149, 108, 0.15)",
				"glow-lg": "0 0 60px rgba(200, 149, 108, 0.2)",
				"glow-sm": "0 0 15px rgba(200, 149, 108, 0.1)",
			},
			animation: {
				"fade-in": "fade-in 0.8s ease-out forwards",
				"fade-in-up": "fade-in-up 0.8s ease-out forwards",
				"slide-in-left": "slide-in-left 0.6s ease-out forwards",
				"slide-in-right": "slide-in-right 0.6s ease-out forwards",
				"contour-drift": "contour-drift 30s linear infinite",
				"pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(16px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-in-left": {
					"0%": { opacity: "0", transform: "translateX(-16px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
				"slide-in-right": {
					"0%": { opacity: "0", transform: "translateX(16px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
				"contour-drift": {
					"0%": { transform: "translateY(0)" },
					"100%": { transform: "translateY(-50%)" },
				},
				"pulse-subtle": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.6" },
				},
			},
			transitionTimingFunction: {
				smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
			},
		},
	},
	future: {
		hoverOnlyWhenSupported: true,
	},
	plugins: [typography],
} satisfies Config;
