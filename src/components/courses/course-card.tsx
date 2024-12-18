"use client";

import { api } from "@/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { TypographySmall } from "@/components/ui/typography";
import { formatPrice } from "@/lib/format";
import { FunctionReturnType } from "convex/server";
import Image from "next/image";
import React from "react";

type Props = {
	course: FunctionReturnType<typeof api.course.course.getAllCourses>[0];
};

export default function CourseCard({ course }: Props) {
	return (
		<Card className="relative">
			<CardHeader className="p-0 m-4">
				<Carousel opts={{ loop: true }} className="relative">
					<CarouselContent>
						{course.images?.map((image, index) => (
							<CarouselItem key={`${index * 2 ** index}`}>
								<div className="relative aspect-square w-full h-full rounded-2xl overflow-hidden">
									<Image
										src={image.imageUrl}
										alt="Course Image"
										className="object-cover w-full h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer hover:scale-105 duration-300"
										fill
										loading="lazy"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="flex space-x-2 items-center absolute -bottom-2 left-1/2">
						<CarouselPrevious />
						<CarouselNext />
					</div>
				</Carousel>
			</CardHeader>
			<CardContent className="gap-1.5 p-4 space-y-2">
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<CardTitle>{course.title}</CardTitle>
						<Badge>{formatPrice(course.price as number)}</Badge>
					</div>
					<div className="flex items-center gap-x-2">
						<Badge className="cursor-alias" variant="outline">
							{course.chapters.length}{" "}
							{course.chapters.length === 1 ? "Chapter" : "Chapters"}
						</Badge>
						<Badge className="cursor-alias" variant="secondary">
							{course.attachments.length}{" "}
							{course.attachments.length === 1 ? "Attachment" : "Attachments"}
						</Badge>
					</div>

					<TypographySmall>{course.category}</TypographySmall>
				</div>
				<CardDescription className="text-balance line-clamp-4">
					{course.description}
				</CardDescription>
			</CardContent>
			<CardFooter>
				<div className="flex items-center justify-end w-full">
					<Button className="self-end " size="sm">
						Buy Course
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}