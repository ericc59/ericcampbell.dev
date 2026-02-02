import { getBlogPosts } from 'app/db/blog';
import { getProjects } from './db/project';
import { getContracts } from './db/contract';

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `https://www.ericcampbell.dev/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let projects = getProjects().map((post) => ({
    url: `https://www.ericcampbell.dev/projects/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let contractWork = getContracts().map((post) => ({
    url: `https://www.ericcampbell.dev/contract-work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let routes = [
    '',
    '/blog',
    '/work',
    '/projects',
    '/contract-work',
    '/tools',
    '/tools/product-screenshot',
    '/tools/app-store-assets',
    '/uses',
    '/guestbook',
  ].map((route) => ({
    url: `https://www.ericcampbell.dev${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs, ...projects, ...contractWork];
}
