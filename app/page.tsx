import Image from 'next/image';
import { PreloadResources } from './preload';
// import nwcCelebrate from 'public/images/home/nwc-celebrate.jpeg';
// import nwc from 'public/images/home/nwc.jpeg';
import chariot from 'public/images/home/chariot-wsj.jpeg';
import chariotVan from 'public/images/home/chariot-van.jpg';
import io from 'public/images/home/io.jpeg';
import scoot from 'public/images/home/scoot.jpeg';
// import scootDemo from 'public/images/home/scoot-launch.jpeg';
import tourwrist from 'public/images/home/tourwrist.jpeg';
import scootQuad from 'public/images/home/scoot-quad.jpg';
import chariotMobile from 'public/images/home/chariot-mobile.gif';
import chariotTeam from 'public/images/home/chariot-team.webp';
import eric from 'public/images/home/eric2.jpeg';

import { Badge } from './components/badge';
import { Card } from './components/card';
import Link from 'next/link';

export default function Page() {
  return (
    <section>
      <PreloadResources />

      <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <h1 className="font-black text-3xl  tracking-tighter">
          hey, I'm eric campbell 👋
        </h1>
        <Link
          href="/"
          className="transition-all  hover:text-neutral-800 dark:hover:text-neutral-200 relative "
        >
          <div>
            <Image
              alt="icon"
              src={eric}
              width={512}
              height={512}
              className=" h-24  w-24 aspect-square inline-block rounded-full object-center"
            />
          </div>
        </Link>
      </div>
      <Card>
        <div className="prose prose-neutral dark:prose-invert">
          I'm a{' '}
          <b className="dark:text-white text-black">
            product-focused engineering leader
          </b>{' '}
          who loves building tools to make engineering and product teams more
          efficient. I currently work as the founder of{' '}
          <span className="not-prose">
            <Badge href="https://pxyz.dev">
              <svg
                width="20"
                height="10"
                role="img"
                aria-label="Protocol logo"
                className="mr-1 inline-flex "
              >
                <use href="/sprite.svg#protocol" />
              </svg>
              Protocol
            </Badge>
          </span>
          {', '}
          where I work on developer tools to help startups build better products
          faster.
          <br />
          <br />
          In the past, I've been a co-founder, CTO{' '}
          <span className="not-prose font-semibold">
            <Badge href="https:/www.ycombinator.com">
              <svg
                role="img"
                aria-label="Y Combinator logo"
                className="mr-1  h-4 w-20"
              >
                <use href="/sprite.svg#ycombinator" />
              </svg>
              W15
            </Badge>
          </span>
          , and engineering leader at four VC-backed startups with exits. I've
          also started companies that have failed. Ultimately, I'm a builder
          with a never ending passion for creating new things.
          <br />
          <br />
          Originally from Kearney, Nebraska, I'm currently based in Dallas,
          Texas after a decade in San Francisco.
        </div>
      </Card>

      <div className="my-8 columns-2 gap-4 sm:columns-3">
        <div className="relative mb-4 h-40">
          <Image
            alt="Celebrating the New Wave Capital launch with co-founders Albert Cheng and Stewart Hauser, after a grueling 1 year long regulatory approval process"
            src={chariotVan}
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative mb-4 h-40">
          <Image
            alt="Chariot team "
            src={chariotTeam}
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover "
          />
        </div>
        <div className="relative mb-4 h-80 sm:mb-0">
          <Image
            alt="Sphere/TourWrist team attending Google IO where we were in the Keynote "
            src={io}
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover object-[-16px] sm:object-center"
          />
        </div>
        <div className="relative h-40 sm:mb-4 sm:h-80">
          <Image
            alt="Celebrating the Chariot acquisition by Ford"
            src={chariot}
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            className="rounded-lg object-cover object-top sm:object-center"
            priority
          />
        </div>

        <div className="relative mb-4 h-40">
          <Image
            alt="Scoot Network founders attending and winning 1st place at Jason Calacanis LAUNCH conference"
            src={scoot}
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative mb-4 h-40 sm:mb-0">
          <Image
            alt="Me celebrating New Wave Capital's launch"
            src={scootQuad}
            fill
            sizes="(max-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative h-80">
          <Image
            alt="TourWrist/Sphere team accepting our 1st place award at the DEMO conference"
            src={tourwrist}
            fill
            sizes="(min-width: 768px) 213px, 33vw"
            priority
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      {/* <p className="prose prose-neutral dark:prose-invert bg-white border p-5 rounded-2xl border-black">
        <b>Work</b>
        <br />
        Over the past 15 years, I've worked on some incredible products at{' '}
        <span className="not-prose">
          <Badge>Chariot</Badge>
        </span>
        {', '}
        where I work on developer tools to help startups build better products
        faster.
        <br />
        <br />
        In the past, I've been a co-founder, CTO, and engineering leader at four
        VC-backed startups with exits. I've also started companies that have
        failed. Ultimately, I'm a builder with a never ending passion for
        creating new things.
      </p> */}
    </section>
  );
}
