import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{ts,tsx}", "./content/**/*.mdx", "./public/**/*.svg"],
	theme: {
		extend: {
			colors: {
				// Amber phosphor palette
				amber: {
					DEFAULT: "#FF9B42",
					bright: "#FFB86C",
					dim: "#CC7A32",
					glow: "rgba(255, 155, 66, 0.4)",
				},
				// Deep backgrounds
				void: "#0B0D12",
				abyss: "#0F1218",
				depth: "#141820",
				surface: "#1A1F2A",
				elevated: "#242B38",
				// Text
				cream: "#F5F0E8",
				stone: "#A8A095",
				ash: "#6B665C",
				// Accents
				cyan: {
					data: "#5CEBDF",
				},
				alert: "#FF6B6B",
			},
			fontFamily: {
				display: ["Libre Baskerville", "Georgia", "serif"],
				mono: ["JetBrains Mono", "monospace"],
				sans: ["var(--font-geist-sans)"],
			},
			typography: {
				DEFAULT: {
					css: {
						"--tw-prose-body": "#A8A095",
						"--tw-prose-headings": "#F5F0E8",
						"--tw-prose-links": "#FF9B42",
						"--tw-prose-bold": "#FFB86C",
						"--tw-prose-counters": "#6B665C",
						"--tw-prose-bullets": "#6B665C",
						"--tw-prose-hr": "#242B38",
						"--tw-prose-quotes": "#A8A095",
						"--tw-prose-quote-borders": "#FF9B42",
						"--tw-prose-captions": "#6B665C",
						"--tw-prose-code": "#FFB86C",
						"--tw-prose-pre-code": "#F5F0E8",
						"--tw-prose-pre-bg": "#0F1218",
						"--tw-prose-th-borders": "#242B38",
						"--tw-prose-td-borders": "#1A1F2A",
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
				"grid-data":
					"linear-gradient(to right, rgba(255, 155, 66, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 155, 66, 0.05) 1px, transparent 1px)",
				"gradient-glow":
					"radial-gradient(ellipse at center, rgba(255, 155, 66, 0.15) 0%, transparent 70%)",
				"gradient-vignette":
					"radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(11, 13, 18, 0.4) 100%)",
			},
			backgroundSize: {
				grid: "40px 40px",
			},
			boxShadow: {
				glow: "0 0 20px rgba(255, 155, 66, 0.3)",
				"glow-lg": "0 0 40px rgba(255, 155, 66, 0.4)",
				"glow-sm": "0 0 10px rgba(255, 155, 66, 0.2)",
				"inner-glow": "inset 0 0 20px rgba(255, 155, 66, 0.1)",
			},
			animation: {
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				flicker: "subtle-flicker 4s infinite",
				"radar-sweep": "radar-sweep 4s linear infinite",
				"fade-in": "fade-in 0.6s ease-out forwards",
				"fade-in-up": "fade-in-up 0.6s ease-out forwards",
				"slide-in-left": "slide-in-left 0.6s ease-out forwards",
				"slide-in-right": "slide-in-right 0.6s ease-out forwards",
			},
			keyframes: {
				"pulse-glow": {
					"0%, 100%": {
						opacity: "1",
						boxShadow: "0 0 5px #FF9B42, 0 0 10px rgba(255, 155, 66, 0.4)",
					},
					"50%": {
						opacity: "0.6",
						boxShadow: "0 0 2px #FF9B42, 0 0 5px rgba(255, 155, 66, 0.4)",
					},
				},
				"subtle-flicker": {
					"0%, 100%": { opacity: "1" },
					"92%": { opacity: "1" },
					"93%": { opacity: "0.95" },
					"94%": { opacity: "1" },
				},
				"radar-sweep": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-in-left": {
					"0%": { opacity: "0", transform: "translateX(-20px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
				"slide-in-right": {
					"0%": { opacity: "0", transform: "translateX(20px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
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
