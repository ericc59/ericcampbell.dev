import type { Metadata } from 'next';
import { Suspense, cache } from 'react';
import { notFound } from 'next/navigation';
import { CustomMDX } from 'app/components/mdx';
import { getProjectViewsCount } from 'app/db/queries';
import { getProjects } from 'app/db/project';
import ViewCounter from '../view-counter';
import { increment } from 'app/db/actions';
import { unstable_noStore as noStore } from 'next/cache';
import { view_types } from '@prisma/client';
import { Badge } from 'app/components/badge';
import { Card } from 'app/components/card';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  let project = getProjects().find((project) => project.slug === params.slug);
  if (!project) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = project.metadata;
  let ogImage = image
    ? `https://www.ericcampbell.dev${image}`
    : `https://www.ericcampbell.dev/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `https://www.ericcampbell.dev/projects/${project.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

function formatDate(date: string) {
  noStore();
  let currentDate = new Date().getTime();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date).getTime();
  let timeDifference = Math.abs(currentDate - targetDate);
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let fullDate = new Date(date).toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (daysAgo < 1) {
    return 'Today';
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}d ago)`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}w ago)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}mo ago)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo}y ago)`;
  }
}

export default function Project({ params }) {
  let project = getProjects().find((project) => project.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProjectPosting',
            headline: project.metadata.title,
            datePublished: project.metadata.publishedAt,
            dateModified: project.metadata.publishedAt,
            description: project.metadata.summary,
            image: project.metadata.image
              ? `https://www.ericcampbell.dev${project.metadata.image}`
              : `https://www.ericcampbell.dev/og?title=${project.metadata.title}`,
            url: `https://www.ericcampbell.dev/projects/${project.slug}`,
            author: {
              '@type': 'Person',
              name: 'Eric Campbell',
            },
          }),
        }}
      />
      <Card>
        <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
          {project.metadata.title}
        </h1>

        <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
          <Suspense fallback={<p className="h-5" />}>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(project.metadata.publishedAt)}
            </p>
          </Suspense>
          <Suspense fallback={<p className="h-5" />}>
            <Views slug={project.slug} />
          </Suspense>
        </div>
        <div className="prose prose-neutral dark:prose-invert mb-6">
          {project.metadata.summary}
        </div>

        <div className="grid lg:grid-cols-4">
          <div className="mb-4">
            <div className="text-sm font-medium">Type</div>
            <Badge>{project.metadata.type}</Badge>
          </div>

          <a
            href={project.metadata.link ?? '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4"
          >
            <div className="text-sm font-medium">URL</div>
            <Badge>{project.metadata.link} &rarr;</Badge>
          </a>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium">Tech Stack</div>
          <div className="grid grid-cols-3 gap-2">
            {project.metadata.technologies?.map((tech) => (
              <Badge key={tech} size="lg">
                <svg
                  role="img"
                  aria-label="technology logo"
                  className="h-6 w-auto"
                >
                  <use href={`/sprite.svg#${tech}`} />
                </svg>
                {tech === 'shadcnui' && (
                  <span className="text-lg text-neutral-900 dark:text-neutral-100">
                    shadcnui
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium">Infrastructure</div>
          <div className="grid grid-cols-3 gap-2">
            {project.metadata.infrastructure?.map((infra) => (
              <Badge key={infra} size="lg">
                <svg className="h-6 w-auto" role="img" aria-label="infra logo">
                  <use href={`/sprite.svg#${infra}`} />
                </svg>
              </Badge>
            ))}
          </div>
        </div>
      </Card>
      {project.metadata.image && (
        <div className="block relative w-full min-h-[300px] lg:min-h-0 h-full mt-4 overflow-hidden bg-white dark:bg-black border border-black p-5 rounded-2xl">
          <Image
            alt="Project image"
            src={project.metadata.image}
            fill
            sizes="(max-width: 768px) 413px, 66vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <CustomMDX source={project.content} />
      </article>
    </section>
  );
}

let incrementViews = cache(increment);

async function Views({ slug }: { slug: string }) {
  let views = await getProjectViewsCount();
  incrementViews(slug, view_types.project);
  return <ViewCounter allViews={views} slug={slug} />;
}
