import Link from 'next/link';

import { Card } from 'app/components/card';

import { formatDate } from 'app/lib/util';
import ProjectBrowserImage from 'app/components/project-browser-image';
import ProjectLogo from './project-logo';

export function ProjectCard({ project, href }) {
  return (
    <Card key={project.slug}>
      <div className="space-y-4">
        <div className="space-y-2">
          {project.metadata.logo && (
            <Link href={href} className="mb-4 block">
              {project.metadata.logo && (
                <ProjectLogo
                  src={project.metadata.logo}
                  alt={project.metadata.title}
                />
              )}
            </Link>
          )}

          <Link href={href}>
            <h3 className="text-neutral-900 font-bold text-2xl dark:text-neutral-100 tracking-tight">
              {project.metadata.title}
            </h3>
          </Link>

          <div className=" space-y-1 space-x-2">
            <div className="font-medium px-2  py-1 bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-200 rounded-lg inline-block text-xs">
              {formatDate(project.metadata.publishedAt)}
            </div>

            <div className="bg-neutral-900 whitespace-nowrap text-neutral-200 px-4 py-1 inline-block  font-medium  dark:bg-neutral-600 dark:text-neutral-200 rounded-lg  text-xs">
              {project.metadata.category}
            </div>
          </div>

          <Link href={href} className="block mt-4">
            <div className="text-sm mb-8 decoration-transparent text-neutral-500 dark:text-neutral-400">
              {project.metadata.summary}
            </div>
          </Link>
        </div>

        {project.metadata.image && (
          <Link href={href}>
            {project.metadata.image && (
              <ProjectBrowserImage
                src={project.metadata.image}
                alt={project.metadata.title}
                href={project.metadata.link ?? 'https://www.ericcampbell.dev'}
              />
            )}
          </Link>
        )}

        {/* <Suspense fallback={<p className="h-6" />}>
      <Views slug={project.slug} />
    </Suspense> */}
      </div>
    </Card>
  );
}
