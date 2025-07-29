import fs from "fs";
import path from "path";

export type Project = {
	metadata: Metadata;
	slug: string;
	tweetIds: string[];
	content: string;
};

type Metadata = {
	title: string;
	publishedAt: string;
	summary: string;
	logo?: string;
	image?: string;
	link?: string;
	category: string;
	type: string;
	infrastructure: string[];
	technologies: string[];
};

export function parseFrontmatter(fileContent: string) {
	const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);
	const frontMatterBlock = match![1].replace(/(\w+):[\s|\n]+/g, "$1: ");
	const content = fileContent.replace(frontmatterRegex, "").trim();
	const frontMatterLines = frontMatterBlock.trim().split("\n");
	const metadata: Partial<Metadata> = {};

	frontMatterLines.forEach((line) => {
		const [key, ...valueArr] = line.split(": ");
		let value = valueArr.join(": ").trim();
		value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes

		if (["technologies", "infrastructure"].includes(key)) {
			metadata[key.trim()] = JSON.parse(value.replace(/'/g, '"')) as string[];
		} else {
			metadata[key.trim()] = value as string;
		}
	});

	console.log(metadata);

	return { metadata: metadata as Metadata, content };
}

export function getMDXFiles(dir) {
	return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
	console.log(filePath);
	const rawContent = fs.readFileSync(filePath, "utf-8");
	return parseFrontmatter(rawContent);
}

function extractTweetIds(content) {
	const tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g);
	return tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0]) || [];
}

export function getMDXData(dir) {
	const mdxFiles = getMDXFiles(dir);
	return mdxFiles
		.map((file) => {
			if (file.startsWith("_")) return;
			const { metadata, content } = readMDXFile(path.join(dir, file));
			const slug = path.basename(file, path.extname(file));
			const tweetIds = extractTweetIds(content);
			return {
				metadata,
				slug,
				tweetIds,
				content,
			};
		})
		.filter(Boolean);
}

export function getProjects(): Project[] {
	return getMDXData(path.join(process.cwd(), "content/projects")).filter(
		(project) => project?.metadata?.publishedAt,
	) as Project[];
}
