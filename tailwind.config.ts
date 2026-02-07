import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{ts,tsx}", "./content/**/*.mdx", "./public/**/*.svg"],
	theme: {
		extend: {
			fontFamily: {
				mono: ["var(--font-geist-mono)", "monospace"],
			},
			typography: {
				DEFAULT: {
					css: {
						"--tw-prose-body": "#a1a1aa",
						"--tw-prose-headings": "#e4e4e7",
						"--tw-prose-links": "#d4d4d8",
						"--tw-prose-bold": "#d4d4d8",
						"--tw-prose-counters": "#52525b",
						"--tw-prose-bullets": "#52525b",
						"--tw-prose-hr": "#27272a",
						"--tw-prose-quotes": "#a1a1aa",
						"--tw-prose-quote-borders": "#3f3f46",
						"--tw-prose-captions": "#52525b",
						"--tw-prose-code": "#d4d4d8",
						"--tw-prose-pre-code": "#e4e4e7",
						"--tw-prose-pre-bg": "#0c0c0e",
						"--tw-prose-th-borders": "#27272a",
						"--tw-prose-td-borders": "#18181b",
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			animation: {
				"fade-in": "fade-in 0.6s ease-out forwards",
				blink: "blink 1s step-end infinite",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				blink: {
					"0%, 50%": { opacity: "1" },
					"51%, 100%": { opacity: "0" },
				},
			},
		},
	},
	future: {
		hoverOnlyWhenSupported: true,
	},
	plugins: [typography],
} satisfies Config;
