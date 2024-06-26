import { ProjectCard } from 'app/components/project-card';
import { getProjects } from 'app/db/project';

export const metadata = {
  title: 'Projects',
  description: 'View my projects',
};

export default function ProjectPage() {
  let allProjects = getProjects().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-2xl tracking-tighter">
          things i've made trying to put a dent in the universe
        </h1>
        <p className="prose prose-neutral dark:prose-invert">
          I'm on a mission to build a portfolio of products that people love.
          Here's what I've been up to.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {allProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              href={`/projects/${project.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// async function Views({ slug }: { slug: string }) {
//   let views = await getProjectViewsCount();

//   return <ViewCounter allViews={views} slug={slug} />;
// }
