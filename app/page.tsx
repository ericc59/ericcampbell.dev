import Image from "next/image";
import Link from "next/link";
import chariotMobile from "public/images/home/chariot-mobile.gif";
import chariotTeam from "public/images/home/chariot-team.webp";
import chariotVan from "public/images/home/chariot-van.jpg";
// import nwcCelebrate from 'public/images/home/nwc-celebrate.jpeg';
// import nwc from 'public/images/home/nwc.jpeg';
import chariot from "public/images/home/chariot-wsj.jpeg";
import eric from "public/images/home/eric2.jpeg";
import io from "public/images/home/io.jpeg";
import scoot from "public/images/home/scoot.jpeg";
import scootQuad from "public/images/home/scoot-quad.jpg";
// import scootDemo from 'public/images/home/scoot-launch.jpeg';
import tourwrist from "public/images/home/tourwrist.jpeg";

import { Badge } from "./components/badge";
import { Card } from "./components/card";
import { PreloadResources } from "./preload";

export default function Page() {
	return (
		<section>
			<PreloadResources />

			<div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-end lg:justify-between ">
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
			<p className="prose prose-neutral dark:prose-invert mb-8">
				Looking for some high-quality contract work?{" "}
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://cal.com/eric-campbell"
					className="text-green-500 font-black"
				>
					Hire me
				</a>{" "}
				for a project.
			</p>
			<Card>
				<div className="prose prose-neutral dark:prose-invert">
					I'm a{" "}
					<b className="dark:text-white text-black">
						product-focused engineering leader
					</b>{" "}
					who loves building tools to make engineering and product teams more
					efficient. I currently work at{" "}
					<span className="not-prose">
						<Badge href="https://flowauctions.com">
							<svg
								width="80"
								height="20"
								role="img"
								aria-label="Flow Auctions logo"
								className="mr-1 inline-flex "
							>
								<use href="/sprite.svg#flow" />
							</svg>
						</Badge>
					</span>
					{", "}
					where I work on the world's first AI-Native Auction House Management
					Platform and the best place in the world to buy rare coins, bullion,
					and collectibles.
					<br />
					<br />
					In the past, I've been a co-founder, CTO{" "}
					<span className="not-prose font-semibold">
						<Badge href="https:/www.ycombinator.com">
							<svg
								role="img"
								aria-label="Y Combinator logo"
								xmlns="http://www.w3.org/2000/svg"
								width="80"
								height="40"
								viewBox="0 0 80 60"
								className="mr-1 inline-flex h-8"
							>
								<path d="M7.503 17.42h25.16v25.16H7.503z" fill="#f26625" />
								<path
									d="M19.245 31.677l-4.36-8.135h2.013l2.516 5.116c0 .084.084.168.168.252s.084.168.168.335l.084.084v.084c.084.168.084.252.168.42.084.084.084.252.168.335.084-.252.252-.42.335-.755.084-.252.252-.503.42-.755l2.516-5.116h1.845l-4.36 8.22v5.2h-1.677z"
									fill="#fff"
								/>
								<path
									d="M42.735 26.265c1.06 0 1.98.283 2.688.85l-.707.85c-.637-.424-1.273-.707-2.05-.707-1.203 0-2.122.637-2.617 1.84-.283.707-.424 1.627-.424 2.83 0 .92.14 1.698.354 2.264.566 1.344 1.486 1.98 2.9 1.98.778 0 1.486-.212 2.122-.707l.707.92c-.92.566-1.9.85-2.97.85-1.273 0-2.334-.495-3.183-1.556-.85-1-1.203-2.334-1.203-3.96s.424-2.9 1.273-3.96c.778-.92 1.84-1.486 3.113-1.486zm4.032 7.003c0-1.273.283-2.264.92-2.97s1.415-1.132 2.405-1.132c1.132 0 2.05.424 2.688 1.344.495.707.707 1.698.707 2.9 0 1.415-.424 2.547-1.203 3.254a3.13 3.13 0 0 1-2.122.778c-1.06 0-1.84-.354-2.476-1.132-.637-.707-.92-1.768-.92-3.042zm4.952-2.05c-.354-.637-.85-1-1.627-1s-1.273.283-1.627.85c-.283.424-.354 1.132-.354 2.05 0 1.203.14 2.05.495 2.547s.85.778 1.556.778c.85 0 1.415-.424 1.698-1.203.14-.424.212-1 .212-1.698.07-1.06-.07-1.84-.354-2.334zm4.03.14c0-.778-.07-1.415-.283-1.9l1.203-.283c.212.354.283.778.283 1.132v.07c.283-.283.566-.566 1-.778.495-.283.92-.424 1.344-.424.637 0 1.203.283 1.556.778.07.14.212.354.283.495.85-.85 1.627-1.273 2.476-1.273.566 0 1.06.212 1.415.566.354.424.566.92.566 1.486v5.87H64.3v-5.8c0-.778-.354-1.132-1-1.132-.354 0-.778.14-1.132.424-.14.14-.424.354-.778.637l-.14.14v5.73h-1.344V31.57c0-.495-.07-.85-.212-1-.212-.212-.424-.283-.778-.283-.566 0-1.203.354-1.98 1.06v5.8H55.75zm12.027-5.376l1.273-.283c.14.566.212 1.203.212 1.98v2.617c.707-.707 1.486-1.06 2.264-1.06.92 0 1.698.354 2.193 1.06.566.707.85 1.698.85 2.9 0 1.273-.283 2.264-.85 3.042s-1.344 1.132-2.264 1.132a2.5 2.5 0 0 1-1.203-.283c-.424-.212-.707-.424-.92-.707l-.212.85h-1.203c.14-.354.212-1 .212-1.98v-7.43c-.07-.85-.14-1.486-.354-1.84zm2.05 4.8c-.212.14-.424.354-.566.566V35.4c.495.637 1.132.92 1.9.92.637 0 1.132-.212 1.415-.707.354-.566.566-1.344.566-2.476 0-1-.14-1.698-.495-2.122-.283-.424-.778-.637-1.486-.637-.424-.07-.92.07-1.344.424zm6.58-3.8c0-.283.07-.495.283-.707s.424-.283.707-.283.495.07.707.283.283.424.283.707-.07.495-.283.707-.424.283-.707.283-.495-.07-.707-.283-.283-.424-.283-.707zM76.7 37.16v-7.78l1.273-.212v7.994zm4.022-5.802c0-.566 0-.92-.07-1.06 0-.212-.14-.424-.283-.778l1.203-.354a2.5 2.5 0 0 1 .283 1.203c.778-.778 1.627-1.203 2.476-1.203.424 0 .778.07 1.132.283s.637.495.778.85c.14.283.212.566.212.92v5.942H85.25v-5.305c0-.637-.07-1.06-.283-1.273a1.17 1.17 0 0 0-.849-.354c-.283 0-.707.14-1.132.354a4.12 4.12 0 0 0-1.061.778v5.8h-1.203zm8.56-.283l-.637-.85c1.06-.707 2.122-1.06 3.254-1.06s1.84.424 2.193 1.203c.14.283.14.707.14 1.344v.424l-.07 2.547v.354c0 .424 0 .707.07.92.07.283.283.495.566.637l-.637.85c-.566-.212-.92-.566-1.06-1.132-.707.707-1.486 1.06-2.264 1.06s-1.415-.212-1.9-.637c-.424-.354-.637-.92-.637-1.627a2.31 2.31 0 0 1 1.061-2.051c.707-.495 1.768-.707 3.042-.707h.566v-.566c0-.637-.07-1.06-.283-1.203a1.33 1.33 0 0 0-1.06-.424c-.424 0-.92.14-1.486.354l-.85.566zm3.75 4.174l.07-2.05h-.637c-1.132 0-1.84.212-2.264.637-.283.283-.424.707-.424 1.273 0 .92.424 1.415 1.344 1.415a2.25 2.25 0 0 0 1.9-1.273zm5.234-5.872h1.98l-.354 1h-1.627V35.4c0 .424.07.707.212.92.14.14.424.283.778.283.283 0 .566-.07.778-.14l.14.778c-.424.212-.85.283-1.344.283-1.203 0-1.768-.566-1.768-1.768V30.38H96v-1h1v-.14c0-.14.07-.707.14-1.627V27.4l1.273-.283c-.14.85-.14 1.627-.14 2.264zm3.254 3.89c0-1.273.283-2.264.92-2.97.566-.707 1.415-1.132 2.405-1.132 1.132 0 2.05.424 2.688 1.344.495.707.707 1.698.707 2.9 0 1.415-.424 2.547-1.203 3.254a3.13 3.13 0 0 1-2.122.778c-1.06 0-1.84-.354-2.476-1.132-.566-.707-.92-1.768-.92-3.042zm5.023-2.05c-.354-.637-.85-1-1.627-1s-1.273.283-1.627.85c-.283.424-.354 1.132-.354 2.05 0 1.203.14 2.05.495 2.547s.85.778 1.556.778c.85 0 1.415-.424 1.698-1.203.14-.424.212-1 .212-1.698 0-1.06-.14-1.84-.354-2.334zm4.03-.002c0-.707-.07-1.273-.283-1.698l1.203-.354a2.5 2.5 0 0 1 .283 1.203v.14c.637-.85 1.344-1.273 2.193-1.273.14 0 .283 0 .424.07l-.495 1.344c-.14-.07-.283-.07-.354-.07-.283 0-.637.07-.92.283s-.566.424-.707.707a2.64 2.64 0 0 0-.141.849v4.88h-1.203z"
									fill="#f26625"
								/>
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
