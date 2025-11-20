import { Badge } from "app/components/badge";
import { Card } from "app/components/card";
import Image from "next/image";

import chariot from "public/images/work/chariot.webp";
import myenergy from "public/images/work/myenergy.webp";
import scoot from "public/images/work/scoot.png";
import sphere from "public/images/work/sphere.png";

export default function Page() {
	return (
		<section className="space-y-12">
			<div className="space-y-4">
				<h1 className="font-black text-4xl lg:text-5xl tracking-tighter text-white">
					My <span className="text-neon">Work</span>
				</h1>
				<p className="text-lg text-neutral-400 max-w-xl leading-relaxed">
					I'm on a mission to build products people love with high-performance
					engineering and product teams. Here's a timeline of my journey.
				</p>
			</div>

			<div className="relative border-l border-neutral-800 ml-4 pl-8 space-y-12">
				{/* Flow Auctions */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neon"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
							<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
								<Badge
									size="lg"
									href="https://flowauctions.com"
									className="!border-transparent !bg-transparent !p-0"
								>
									<svg
										width="32"
										height="32"
										role="img"
										aria-label="Flow Auctions logo"
										className="fill-current"
									>
										<use href="/sprite.svg#flow" />
									</svg>
								</Badge>
								Flow Auctions
							</h2>
							<span className="font-mono text-xs text-neon border border-neon/20 bg-neon/10 px-2 py-1 rounded-full">
								Co-Founder, Current
							</span>
						</div>
						<p className="text-neutral-400 leading-relaxed">
							I started Flow Auctions in 2024 with a desire to build the world's
							first AI-Native Auction House Management Platform and the best
							place in the world to buy rare coins, bullion, and collectibles.
						</p>
					</Card>
				</div>

				{/* Protocol */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neutral-700"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
							<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
								<Badge
									size="lg"
									href="https://pxyz.dev"
									className="!border-transparent !bg-transparent !p-0"
								>
									<svg
										width="32"
										height="32"
										role="img"
										aria-label="Protocol logo"
										className="fill-current"
									>
										<use href="/sprite.svg#protocol" />
									</svg>
								</Badge>
								Protocol
							</h2>
							<span className="font-mono text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
								Founder, Current
							</span>
						</div>
						<p className="text-neutral-400 leading-relaxed">
							I started Protocol in 2022 with a desire to build a better
							developer experience for the web. I believe the Next.js and Node
							ecosystems provide the best unified platform for building web
							applications, but lack a lot of tools that older frameworks
							provided out of the box. Protocol is changing that.
						</p>
					</Card>
				</div>

				{/* Zapier */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neutral-700"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
							<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
								<Badge
									size="lg"
									href="https://www.zapier.com"
									className="!border-transparent !bg-transparent !p-0"
								>
									<svg
										width="32"
										height="32"
										role="img"
										aria-label="Zapier logo"
										className="fill-current"
									>
										<use href="/sprite.svg#zapier" />
									</svg>
								</Badge>
								Zapier
							</h2>
							<span className="font-mono text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
								Principal Engineer, 2019-2022
							</span>
						</div>
						<p className="text-neutral-400 leading-relaxed">
							I joined the Labs team at{" "}
							<a
								href="https://www.zapier.com"
								className="text-neon hover:underline"
							>
								Zapier
							</a>{" "}
							to help ideate, build, and launch new products for the company. I
							worked on the Maker, Forms,{" "}
							<a
								href="https://zapier.com/tables"
								className="text-neon hover:underline"
							>
								Tables
							</a>
							, and{" "}
							<a
								href="https://zapier.com/interfaces"
								className="text-neon hover:underline"
							>
								Interfaces
							</a>{" "}
							products.
						</p>
					</Card>
				</div>

				{/* New Wave Capital */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neutral-700"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
							<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
								<Badge
									size="lg"
									href="https://www.zapier.com"
									className="!border-transparent !bg-transparent !p-0"
								>
									<svg
										width="32"
										height="32"
										role="img"
										aria-label="New Wave Capital logo"
										className="fill-current"
									>
										<use href="/sprite.svg#nwc" />
									</svg>
								</Badge>
								New Wave Capital
							</h2>
							<span className="font-mono text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
								Founder & CEO/CTO, 2016-2018
							</span>
						</div>
						<div className="space-y-4 text-neutral-400 leading-relaxed">
							<p>
								I co-founded New Wave Capital along with{" "}
								<a
									href="https://www.linkedin.com/in/stewarthauser"
									className="text-neon hover:underline"
								>
									Stewart Hauser
								</a>{" "}
								and{" "}
								<a
									href="https://www.linkedin.com/in/albertcheng1"
									className="text-neon hover:underline"
								>
									Albert Cheng
								</a>{" "}
								with a goal of democratizing access to digital assets and
								imporove the security for everyone.
							</p>
							<p>
								After being the first company of its type approved by the SEC
								after a year long regulatory approval process, we finally
								launched and grew the company to around $750k in AUM.
								Unfortunately, the revenues were not enough to cover the
								expenses and we were forced to shut down the company in 2018.
							</p>
						</div>
					</Card>
				</div>

				{/* Chariot */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neutral-700"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
							<div className="space-y-1">
								<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
									<Badge
										size="lg"
										href="https://techcrunch.com/2016/09/09/ford-mobility-solutions-acquires-chariot/"
										className="!border-transparent !bg-transparent !p-0"
									>
										<Image
											width={32}
											height={32}
											role="img"
											aria-label="Chariot logo"
											className="rounded-lg"
											src={chariot}
											alt="Chariot Logo"
										/>
									</Badge>
									Chariot
								</h2>
								<div className="flex items-center gap-2 text-sm text-neutral-500">
									<svg
										role="img"
										aria-label="Y Combinator logo"
										className="h-4 w-auto"
									>
										<use href="/sprite.svg#ycombinator" />
									</svg>
									<span>W15</span>
								</div>
							</div>
							<span className="font-mono text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
								CTO, 2014-2016
							</span>
						</div>

						<div className="space-y-4 text-neutral-400 leading-relaxed">
							<p>
								Chariot ("Uber for buses") was a ridesharing startup in San
								Francisco that offered dynamic bus routes around the city to
								underserved transit neighborhoods.
							</p>
							<p>
								I built our backend platform (Python), frontend web app (React),
								admin dashboard (React), and proprietary ETA system and
								reverse-commute route finding algorithms (Python)
							</p>
							<p className="text-neon font-semibold">
								Acquired by Ford Motor Company.
							</p>
						</div>
					</Card>
				</div>

				{/* Sphere */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neutral-700"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
							<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
								<Badge
									size="lg"
									href="https://www.youtube.com/watch?app=desktop&v=nVLCxQ55P6M"
									className="!border-transparent !bg-transparent !p-0"
								>
									<Image
										width={32}
										height={32}
										role="img"
										aria-label="Sphere logo"
										className="rounded-full border-2 border-white/10"
										src={sphere}
										alt="Sphere Logo"
									/>
								</Badge>
								Sphere
							</h2>
							<span className="font-mono text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
								CTO, 2012-2013
							</span>
						</div>
						<div className="space-y-4 text-neutral-400 leading-relaxed">
							<p>
								Sphere was a computer vision and image processing startup which
								developed the first fully spherical panoramic imaging technology
								for mobile devices. We were featured over 600 times by Apple and
								became the #1 travel app in the world.
							</p>
							<p>
								I built our C/C++ SDKs, backend platform (Ruby/Rails), frontend
								web app(Ruby/Rails), and worked on the mobile apps (Native iOS &
								Android).
							</p>
							<p className="text-neon font-semibold">Acquired by Google.</p>
						</div>
					</Card>
				</div>

				{/* Scoot */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neutral-700"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
							<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
								<Badge
									size="lg"
									href="https://techcrunch.com/2019/06/12/bird-confirms-acquisition-of-scoot/"
									className="!border-transparent !bg-transparent !p-0"
								>
									<Image
										width={32}
										height={32}
										role="img"
										aria-label="Scoot logo"
										className="rounded-full border-2 border-white/10"
										src={scoot}
										alt="Scoot Logo"
									/>
								</Badge>
								Scoot
							</h2>
							<span className="font-mono text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
								Founding Engineer, 2012-2013
							</span>
						</div>
						<div className="space-y-4 text-neutral-400 leading-relaxed">
							<p>
								Scoot was the first electric scooter rental company. We created
								Vespa style sitdown scooters with a custom dock for mobile
								phones.
							</p>

							<p>
								I built our backend platform (Ruby/Rails), frontend web app
								(Ruby/Rails), admin dashboard (Ruby/Rails), and the
								cross-platform mobile app (C#/Xamarin).
							</p>

							<p className="text-neon font-semibold">Acquired by Bird.</p>
						</div>
					</Card>
				</div>

				{/* My Energy */}
				<div className="relative">
					<div className="absolute -left-[39px] top-2 h-5 w-5 rounded-full border-4 border-obsidian bg-neutral-700"></div>
					<Card>
						<div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
							<h2 className="font-medium text-2xl tracking-tighter flex items-center gap-3">
								<Badge
									size="lg"
									href="https://techcrunch.com/2013/05/07/nest-acquires-myenergy-to-boost-its-home-energy-management-tools/"
									className="!border-transparent !bg-transparent !p-0"
								>
									<Image
										width={32}
										height={32}
										role="img"
										aria-label="My Energy logo"
										className="rounded-full border-2 border-white/10"
										src={myenergy}
										alt="My Energy Logo"
									/>
								</Badge>
								My Energy
							</h2>
							<span className="font-mono text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
								CTO, 2009-2012
							</span>
						</div>
						<div className="space-y-4 text-neutral-400 leading-relaxed">
							<p>
								My Energy provided consumers with information on how much
								electricity, water, and natural gas they use and how much they
								spend on these utilities. Simply connect your online utility
								accounts with the platform, and the system imports all the
								necessary bits and displays them on the beautiful web dashboard.
							</p>

							<p className="text-neon font-semibold">
								Acquired by Nest & Google.
							</p>
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}
