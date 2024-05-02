'use server';

import { auth, youtube } from '@googleapis/youtube';
// import { sql } from './postgres';
import prisma from './prisma';
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache';

let googleAuth = new auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
});

let yt = youtube({
  version: 'v3',
  auth: googleAuth,
});

export async function getBlogViews() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  noStore();
  // let views = await sql`
  //   SELECT count
  //   FROM views
  // `;
  let views = await prisma.views.findMany({
    select: {
      count: true,
    },
    where: {
      type: 'blog',
    },
  });

  return views.reduce((acc, curr) => acc + Number(curr.count), 0);
}

export async function getProjectViews() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  noStore();
  // let views = await sql`
  //   SELECT count
  //   FROM views
  // `;
  let views = await prisma.views.findMany({
    select: {
      count: true,
    },
    where: {
      type: 'project',
    },
  });

  return views.reduce((acc, curr) => acc + Number(curr.count), 0);
}

export async function getBlogViewsCount(): Promise<
  { slug: string; count: number }[]
> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  noStore();
  // return sql`
  //   SELECT slug, count
  //   FROM views
  // `;
  return prisma.views.findMany({
    select: {
      slug: true,
      count: true,
    },
    where: {
      type: 'blog',
    },
  });
}

export async function getProjectViewsCount(): Promise<
  { slug: string; count: number }[]
> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  noStore();
  // return sql`
  //   SELECT slug, count
  //   FROM views
  // `;
  return prisma.views.findMany({
    select: {
      slug: true,
      count: true,
    },
    where: {
      type: 'project',
    },
  });
}

export const getEricYouTubeSubs = cache(
  async () => {
    let response = await yt.channels.list({
      id: [''],
      part: ['statistics'],
    });

    let channel = response.data.items![0];
    return Number(channel?.statistics?.subscriberCount).toLocaleString();
  },
  ['ericcampbell-youtube-subs'],
  {
    revalidate: 3600,
  }
);

export const getVercelYouTubeSubs = cache(
  async () => {
    let response = await yt.channels.list({
      id: ['UCLq8gNoee7oXM7MvTdjyQvA'],
      part: ['statistics'],
    });

    let channel = response.data.items![0];
    return Number(channel?.statistics?.subscriberCount).toLocaleString();
  },
  ['vercel-youtube-subs'],
  {
    revalidate: 3600,
  }
);

export async function getGuestbookEntries() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  noStore();
  // return sql`
  //   SELECT id, body, created_by, updated_at
  //   FROM guestbook
  //   ORDER BY created_at DESC
  //   LIMIT 100
  // `;

  return prisma.guestbook.findMany({
    select: {
      id: true,
      body: true,
      createdBy: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100,
  });
}
