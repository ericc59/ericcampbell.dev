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
        <p className="prose prose-neutral dark:prose-invert">
          I'm on a mission to build products people love with high-performance
          engineering and product teams. Here's what I've been up to.
        </p>
      </div>

      <div>
        <h2 className="font-medium text-xl mt-4 tracking-tighter text-neutral-500 dark:text-neutral-300">
          contract work
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            .filter((project) => project.metadata.type === 'contract')
            .map((project) => (
              <Card key={project.slug}>
                <div>
                  {/* {project.metadata.logo && (
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
                    )} */}

                  <Link href={`/projects/${project.slug}`}>
                    <h3 className="text-neutral-900 font-bold text-2xl dark:text-neutral-100 tracking-tight">
                      {project.metadata.title}
                    </h3>
                  </Link>

                  <Link href={`/projects/${project.slug}`}>
                    <div className="text-sm text-neutral-600 mb-8 decoration-transparent dark:text-neutral-400">
                      {project.metadata.summary}
                    </div>
                  </Link>
                </div>

                {project.metadata.image && (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative w-full h-auto block  my-8 aspect-video border rounded p-2  "
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

                <div className="font-medium px-2 py-1 bg-black text-white rounded-lg inline-block text-xs">
                  {new Date(project.metadata.publishedAt).toLocaleDateString()}
                </div>

                {/* <Suspense fallback={<p className="h-6" />}>
                  <Views slug={project.slug} />
                </Suspense> */}
              </Card>
            ))}
        </div>
      </div>

      <div>
        <h2 className="font-medium text-xl mt-4 tracking-tighter text-neutral-500 dark:text-neutral-300">
          fun projects
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2"></div>
      </div>
    </section>
  );
}

// async function Views({ slug }: { slug: string }) {
//   let views = await getProjectViewsCount();

//   return <ViewCounter allViews={views} slug={slug} />;
// }
