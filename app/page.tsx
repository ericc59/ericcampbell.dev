import Image from "next/image";
import Link from "next/link";
import chariotTeam from "public/images/home/chariot-team.webp";
import chariotVan from "public/images/home/chariot-van.jpg";
import chariot from "public/images/home/chariot-wsj.jpeg";
import eric from "public/images/home/eric2.jpeg";
import io from "public/images/home/io.jpeg";
import scoot from "public/images/home/scoot.jpeg";
import scootQuad from "public/images/home/scoot-quad.jpg";
import tourwrist from "public/images/home/tourwrist.jpeg";

import { Badge } from "./components/badge";
import { Card } from "./components/card";
import { PreloadResources } from "./preload";

export default function Page() {
	return (
		<section className="space-y-12">
			<PreloadResources />

			{/* Hero Section */}
			<div className="relative">
				<div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-center lg:justify-between">
					<div className="space-y-4">
						<h1 className="font-black text-5xl lg:text-6xl tracking-tighter text-white">
							Hey, I'm <span className="text-neon">Eric Campbell</span>
						</h1>
						<p className="text-xl text-neutral-400 max-w-md leading-relaxed">
							Engineering leader, startup founder, and builder of high-scale
							systems.
						</p>
					</div>
					<Link href="/" className="relative group">
						<div className="absolute -inset-1 bg-gradient-to-r from-neon to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
						<div className="relative">
							<Image
								alt="Eric Campbell"
								src={eric}
								width={512}
								height={512}
								className="h-32 w-32 lg:h-40 lg:w-40 aspect-square rounded-full object-cover border-2 border-neutral-800"
							/>
						</div>
					</Link>
				</div>
			</div>

			{/* About Card */}
			<Card>
				<div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-200">
					<p className="text-lg leading-relaxed">
						I'm a{" "}
						<span className="text-neon font-bold">
							product-focused engineering leader
						</span>{" "}
						who loves building tools to make engineering and product teams more
						efficient. I currently work at{" "}
						<span className="not-prose inline-block align-middle">
							<Badge href="https://flowauctions.com" className="mx-1">
								<svg
									width="60"
									height="16"
									role="img"
									aria-label="Flow Auctions logo"
									className="inline-flex fill-current"
								>
									<use href="/sprite.svg#flow" />
								</svg>
							</Badge>
						</span>
						{", "}
						where I work on the world's first AI-Native Auction House Management
						Platform.
					</p>
					<p className="text-lg leading-relaxed">
						In the past, I've been a co-founder, CTO{" "}
						<span className="not-prose inline-block align-middle">
							<Badge href="https://www.ycombinator.com" className="mx-1">
								<svg
									role="img"
									aria-label="Y Combinator logo"
									width="16"
									height="16"
									viewBox="0 0 80 60"
									className="inline-flex h-4 w-auto"
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
						, and engineering leader at four VC-backed startups with exits.
					</p>
				</div>
			</Card>

			{/* Image Grid - Masonry-ish */}
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
				<div className="relative row-span-2 col-span-2 md:col-span-2 rounded-2xl overflow-hidden group">
					<Image
						alt="TourWrist/Sphere team accepting our 1st place award at the DEMO conference"
						src={tourwrist}
						fill
						sizes="(min-width: 768px) 66vw, 100vw"
						priority
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
					<div className="absolute bottom-4 left-4 text-white font-bold">
						DEMO Conference 1st Place
					</div>
				</div>

				<div className="relative rounded-2xl overflow-hidden group">
					<Image
						alt="Chariot team"
						src={chariotTeam}
						fill
						sizes="(max-width: 768px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>

				<div className="relative rounded-2xl overflow-hidden group">
					<Image
						alt="Scoot Network founders"
						src={scoot}
						fill
						sizes="(max-width: 768px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>

				<div className="relative col-span-1 md:col-span-1 row-span-2 rounded-2xl overflow-hidden group">
					<Image
						alt="Google IO"
						src={io}
						fill
						sizes="(max-width: 768px) 50vw, 33vw"
						className="object-cover object-[-16px] sm:object-center transition-transform duration-500 group-hover:scale-105"
					/>
				</div>

				<div className="relative rounded-2xl overflow-hidden group">
					<Image
						alt="Chariot acquisition"
						src={chariot}
						fill
						sizes="(max-width: 768px) 50vw, 33vw"
						className="object-cover object-top sm:object-center transition-transform duration-500 group-hover:scale-105"
					/>
				</div>

				<div className="relative rounded-2xl overflow-hidden group">
					<Image
						alt="Scoot Quad"
						src={scootQuad}
						fill
						sizes="(max-width: 768px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>
			</div>
		</section>
	);
}
