import { Badge } from 'app/components/badge';
import { Card } from 'app/components/card';
import Image from 'next/image';

import chariot from 'public/images/work/chariot.webp';
import sphere from 'public/images/work/sphere.png';
import scoot from 'public/images/work/scoot.png';
import myenergy from 'public/images/work/myenergy.webp';

export default function Page() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-2xl  tracking-tighter">my work</h1>
        <p className="prose prose-neutral dark:prose-invert">
          I'm on a mission to build products people love with high-performance
          engineering and product teams. Here's what I've been up to.
        </p>
      </div>

      <Card>
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <Badge size="lg" href="https://pxyz.dev">
            <svg
              width="32"
              height="32"
              role="img"
              aria-label="Protocol logo"
              className="mr-1 inline-flex dark:invert"
            >
              <use href="/sprite.svg#protocol" />
            </svg>
            Protocol
          </Badge>
        </h2>
        <p className="font-bold text-sm">Founder & CEO, Current</p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          I started Protocol in 2022 with a desire to build a better developer
          experience for the web. I believe the Next.js and Node ecosystems
          provide the best unified platform for building web applications, but
          lack a lot of tools that older frameworks provided out of the box.
          Protocol is changing that.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <Badge size="lg" href="https://www.zapier.com">
            <svg
              width="32"
              height="32"
              role="img"
              aria-label="Zapier logo"
              className="mr-1 inline-flex "
            >
              <use href="/sprite.svg#zapier" />
            </svg>
            Zapier
          </Badge>
        </h2>
        <p className="font-bold text-sm">
          Principal Software Engineer, Labs (Contract), 2019-2022
        </p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          I joined the Labs team at <a href="https://www.zapier.com">Zapier</a>{' '}
          to help ideate, build, and launch new products for the company. I
          worked on the Maker, Forms,{' '}
          <a href="https://zapier.com/tables">Tables</a>, and{' '}
          <a href="https://zapier.com/interfaces">Interfaces</a> products.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <Badge size="lg" href="https://www.zapier.com">
            <svg
              width="32"
              height="32"
              role="img"
              aria-label="New Wave Capital logo"
              className="mr-1 inline-flex "
            >
              <use href="/sprite.svg#nwc" />
            </svg>
            New Wave Capital
          </Badge>
        </h2>
        <p className="font-bold text-sm">Founder & CEO/CTO, 2016-2018</p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          I co-founded New Wave Capital along with{' '}
          <a href="https://www.linkedin.com/in/stewarthauser">Stewart Hauser</a>{' '}
          and{' '}
          <a href="https://www.linkedin.com/in/albertcheng1">Albert Cheng</a>{' '}
          with a goal of democratizing access to digital assets and imporove the
          security for everyone.
          <br />
          <br />
          After being the first company of its type approved by the SEC after a
          year long regulatory approval process, we finally launched and grew
          the company to around $750k in AUM. Unfortunately, the revenues were
          not enough to cover the expenses and we were forced to shut down the
          company in 2018.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <Badge
            size="lg"
            href="https://techcrunch.com/2016/09/09/ford-mobility-solutions-acquires-chariot/"
          >
            <Image
              width="32"
              height="32"
              role="img"
              aria-label="Chariot logo"
              className="mr-1 inline-flex rounded-lg"
              src={chariot}
              alt="Chariot Logo"
            />
            Chariot
          </Badge>
        </h2>
        <p className="font-bold text-sm">Chief Technology Officer, 2014-2016</p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          Chariot ("Uber for buses") was a ridesharing startup in San Francisco
          that offered dynamic bus routes around the city to underserved transit
          neighborhoods.
        </p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          I built our backend platform (Python), frontend web app (React), admin
          dashboard (React), and proprietary ETA system and reverse-commute
          route finding algorithms (Python)
        </p>
        <p className="prose prose-neutral font-semibold  dark:prose-invert mt-4">
          Acquired by Ford Motor Company.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <Badge
            size="lg"
            href="https://www.youtube.com/watch?app=desktop&v=nVLCxQ55P6M"
          >
            <Image
              width="32"
              height="32"
              role="img"
              aria-label="Sphere logo"
              className="mr-1 inline-flex border-2 border-white rounded-full"
              src={sphere}
              alt="Sphere Logo"
            />
            Sphere
          </Badge>
        </h2>
        <p className="font-bold text-sm">Chief Technology Officer, 2012-2013</p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          Sphere was a computer vision and image processing startup which
          developed the first fully spherical panoramic imaging technology for
          mobile devices. We were featured over 600 times by Apple and became
          the #1 travel app in the world.
        </p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          I built our C/C++ SDKs, backend platform (Ruby/Rails), frontend web
          app(Ruby/Rails), and worked on the mobile apps (Native iOS & Android).
        </p>
        <p className="prose prose-neutral font-semibold  dark:prose-invert mt-4">
          Acquired by Google.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <Badge
            size="lg"
            href="https://techcrunch.com/2019/06/12/bird-confirms-acquisition-of-scoot/"
          >
            <Image
              width="32"
              height="32"
              role="img"
              aria-label="Scoot logo"
              className="mr-1 inline-flex border-2 border-white rounded-full"
              src={scoot}
              alt="Scoot Logo"
            />
            Scoot
          </Badge>
        </h2>
        <p className="font-bold text-sm">Founding Engineer, 2012-2013</p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          Scoot was the first electric scooter rental company. We created Vespa
          style sitdown scooters with a custom dock for mobile phones.
        </p>

        <p className="prose prose-neutral dark:prose-invert mt-4">
          I built our backend platform (Ruby/Rails), frontend web app
          (Ruby/Rails), admin dashboard (Ruby/Rails), and the cross-platform
          mobile app (C#/Xamarin).
        </p>

        <p className="prose prose-neutral font-semibold  dark:prose-invert mt-4">
          Acquired by Bird.
        </p>
      </Card>

      <Card>
        <h2 className="font-medium text-xl mb-1 tracking-tighter">
          <Badge
            size="lg"
            href="https://techcrunch.com/2013/05/07/nest-acquires-myenergy-to-boost-its-home-energy-management-tools/"
          >
            <Image
              width="32"
              height="32"
              role="img"
              aria-label="My Energy logo"
              className="mr-1 inline-flex border-2 border-white rounded-full"
              src={myenergy}
              alt="My Energy Logo"
            />
            My Energy
          </Badge>
        </h2>
        <p className="font-bold text-sm">Chief Technology Officer, 2009-2012</p>
        <p className="prose prose-neutral dark:prose-invert mt-4">
          My Energy provided consumers with information on how much electricity,
          water, and natural gas they use and how much they spend on these
          utilities. Simply connect your online utility accounts with the
          platform, and the system imports all the necessary bits and displays
          them on the beautiful web dashboard.
        </p>

        <p className="prose prose-neutral font-semibold dark:prose-invert mt-4">
          Acquired by Nest & Google.
        </p>
      </Card>
    </section>
  );
}
