import Link from 'next/link';
import { Badge } from './badge';

const navItems = {
  '/': {
    name: 'home',
  },
  '/work': {
    name: 'work',
  },
  '/projects': {
    name: 'projects',
  },
  '/contract-work': {
    name: 'contract work',
  },
  '/blog': {
    name: 'blog',
  },
  // '/guestbook': {
  //   name: 'guestbook',
  // },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-col gap-y-4 lg:flex-row lg:items-center relative px-0 pb-0 w-full fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0     ">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
                >
                  {name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 lg:ml-auto">
            <Badge href="https://twitter.com/ericcampbell59">
              <svg
                width="16"
                height="16"
                role="img"
                aria-label="Twitter logo"
                className="mr-1 inline-flex "
              >
                <use href="/sprite.svg#twitter" />
              </svg>
              Follow me
            </Badge>

            <Badge href="https://github.com/ericc59">
              <svg
                width="16"
                height="16"
                role="img"
                aria-label="Github logo"
                className="mr-1 inline-flex "
              >
                <use href="/sprite.svg#github" />
              </svg>
              Github
            </Badge>

            <Badge
              className="bg-[#2DFFC0] hover:bg-[#96FFE0] border-neutral-900 dark:border-neutral-100"
              href="https://cal.com/eric-campbell"
            >
              Hire Me
            </Badge>
          </div>
        </nav>
      </div>
    </aside>
  );
}
