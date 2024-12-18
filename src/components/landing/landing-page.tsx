import TestimonialSlider from "@/components/landing/testimonial-slider";
import Navbar from "@/components/layouts/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Code, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<Navbar>
				<div className="container mx-auto flex h-14 items-center justify-between">
					<Link href="/" className="flex items-center gap-x-2">
						<Image src="/logo.webp" alt="logo" width={50} height={50} />
						<span className="font-bold">EduLearn</span>
					</Link>

					<div className="">
						<Link href="/index">Courses</Link>
					</div>
				</div>
			</Navbar>

			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 max-w-7xl mx-auto">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Learn Anytime, Anywhere
								</h1>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
									Unlock your potential with our cutting-edge e-learning
									platform. Gain skills for the future, at your own pace.
								</p>
							</div>
							<div className="space-x-4">
								<Button asChild>
									<Link href="/new-user">Get Started</Link>
								</Button>
								{/* <Button variant="outline">Learn More</Button> */}
							</div>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
					<div className="container px-4 md:px-6 mx-auto">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							Our Features
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<Card>
								<CardContent className="flex flex-col items-center p-6 space-y-4">
									<Code className="h-12 w-12 text-primary" />
									<h3 className="text-xl font-bold">Interactive Courses</h3>
									<p className="text-center text-gray-500 dark:text-gray-400">
										Engage with our interactive lessons and hands-on projects.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center p-6 space-y-4">
									<Users className="h-12 w-12 text-primary" />
									<h3 className="text-xl font-bold">Expert Instructors</h3>
									<p className="text-center text-gray-500 dark:text-gray-400">
										Learn from industry professionals and experienced educators.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center p-6 space-y-4">
									<CheckCircle className="h-12 w-12 text-primary" />
									<h3 className="text-xl font-bold">Flexible Learning</h3>
									<p className="text-center text-gray-500 dark:text-gray-400">
										Study at your own pace with lifetime access to course
										materials.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 max-w-7xl mx-auto">
					<div className="container px-4 md:px-6">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
							What Our Students Say
						</h2>
						<TestimonialSlider />
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/30 via-primary/55 to-primary/90 text-primary-foreground">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
									Start Your Learning Journey Today
								</h2>
								<p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
									Join thousands of learners and transform your career with our
									courses.
								</p>
							</div>
							<Button asChild variant="secondary" size="lg">
								<Link href="/index">Enroll Now</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					© {new Date().getFullYear()} EduLearn. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Terms of Service
					</Link>
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
