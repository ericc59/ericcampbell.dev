import fs from 'fs';
import path from 'path';

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
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1].replace(/(\w+):[\s|\n]+/g, '$1: ');
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes

    if (['technologies', 'infrastructure'].includes(key)) {
      metadata[key.trim()] = JSON.parse(value.replace(/\'/g, '"')) as string[];
    } else {
      metadata[key.trim()] = value as string;
    }
  });

  console.log(metadata);

  return { metadata: metadata as Metadata, content };
}

export function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath) {
  console.log(filePath);
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function extractTweetIds(content) {
  let tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g);
  return tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0]) || [];
}

export function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles
    .map((file) => {
      if (file.startsWith('_')) return;
      let { metadata, content } = readMDXFile(path.join(dir, file));
      let slug = path.basename(file, path.extname(file));
      let tweetIds = extractTweetIds(content);
      return {
        metadata,
        slug,
        tweetIds,
        content,
      };
    })
    .filter(Boolean);
}

export function getProjects() {
  return getMDXData(path.join(process.cwd(), 'content/projects'));
}
