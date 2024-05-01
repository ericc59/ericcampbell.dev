import Link from 'next/link';
import icon from 'public/images/home/eric2.jpeg';
import Image from 'next/image';

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
  '/blog': {
    name: 'blog',
  },
  '/guestbook': {
    name: 'guestbook',
  },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="flex"></div>
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex  flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0 pr-10">
            <Link
              href="/"
              className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
            >
              <Image
                alt="icon"
                src={icon}
                width={256}
                height={256}
                className="w-16 h-16 rounded-full object-center"
              />
            </Link>
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
        </nav>
      </div>
    </aside>
  );
}
