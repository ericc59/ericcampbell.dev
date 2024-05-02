import Link from 'next/link';
import { Suspense } from 'react';
import ViewCounter from './view-counter';
import { getProjectViewsCount } from 'app/db/queries';
import { getProjects } from 'app/db/project';
import { Card } from 'app/components/card';
import Image from 'next/image';
import { Badge } from 'app/components/badge';

export const metadata = {
  title: 'Projects',
  description: 'View my projects',
};

export default function ProjectPage() {
  let allProjects = getProjects();

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-2xl tracking-tighter">
          things i've made trying to put a dent in the universe
        </h1>
        <p>
          I'm on a mission to build products people love with high-performance
          engineering and product teams. Here's what I've been up to.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2  ">
        {allProjects
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((project) => (
            <Card key={project.slug}>
              <div>
                <div>
                  {project.metadata.logo && (
                    <Link
                      href={`/projects/${project.slug}`}
                      className=" w-full"
                    >
                      <Image
                        src={project.metadata.logo}
                        className="object-contain h-24 w-auto"
                        width={512}
                        height={512}
                        priority
                        alt={`${project.metadata.title} logo`}
                      />
                    </Link>
                  )}
                  {!project.metadata.logo && (
                    <Link href={`/projects/${project.slug}`}>
                      <h2 className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {project.metadata.title}
                      </h2>
                    </Link>
                  )}
                  <Link href={`/projects/${project.slug}`}>
                    <div className="text-sm text-neutral-600 mb-8 decoration-transparent dark:text-neutral-400">
                      {project.metadata.summary}
                    </div>
                  </Link>
                </div>

                {project.metadata.image && (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative h-full my-8 aspect-video border rounded p-2 block"
                  >
                    <Image
                      alt="Project image"
                      src={project.metadata.image}
                      fill
                      sizes="(max-width: 768px) 213px, 33vw"
                      priority
                      className="rounded-lg object-contain"
                    />
                  </Link>
                )}

                {/* <Suspense fallback={<p className="h-6" />}>
                  <Views slug={project.slug} />
                </Suspense> */}

                <div className="mb-4">
                  <div className="text-sm font-light">Type</div>
                  <Badge>{project.metadata.type}</Badge>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-light">Tech Stack</div>
                  <div className="grid grid-cols-3 gap-2">
                    {project.metadata.technologies?.map((tech) => (
                      <Badge key={tech} size="lg">
                        <svg
                          // width="60"
                          // height="30"f
                          role="img"
                          aria-label="technology logo"
                          className="h-12 w-auto"
                        >
                          <use href={`/sprite.svg#${tech}`} />
                        </svg>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-light">Infrastructure</div>
                  <div className="grid grid-cols-3 gap-2">
                    {project.metadata.infrastructure?.map((infra) => (
                      <Badge key={infra} size="lg">
                        <svg
                          // width="60"
                          // height="30"
                          className="h-12 w-auto"
                          role="img"
                          aria-label="infra logo"
                        >
                          <use href={`/sprite.svg#${infra}`} />
                        </svg>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </section>
  );
}

// async function Views({ slug }: { slug: string }) {
//   let views = await getProjectViewsCount();

//   return <ViewCounter allViews={views} slug={slug} />;
// }
