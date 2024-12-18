"use client";

import { api } from "@/_generated/api";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	initialData: FunctionReturnType<typeof api.course.course.getCourse>;
};

const CourseImageForm = (props: Props) => {
	const updateCourse = useMutation(api.course.course.updateCourse);
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Course Image</CardTitle>
					<Button size="sm" onClick={toggleEdit} variant="ghost">
						{isEditing && "Cancel"}
						{!isEditing && props.initialData.images.length === 0 && (
							<>
								<PlusCircle className="h-4 w-4 mr-2" />
								Add an image
							</>
						)}

						{!isEditing && props.initialData.images.length > 0 && (
							<>
								<Pencil className="size-4 mr-2" />
								Edit Image
							</>
						)}
					</Button>
				</div>
				{!isEditing &&
					(props.initialData.images.length === 0 ? (
						<div className="flex items-center justify-center h-60 bg-stone-200 rounded-md">
							<ImageIcon className="h-10 w-10 text-stone-500" />
						</div>
					) : (
						<Carousel
							className="relative p-2"
							opts={{
								align: "start",
								loop: true,
							}}
						>
							<CarouselContent className="-ml-2 md:-ml-4">
								{props.initialData.images.map((item) => (
									<CarouselItem
										className="relative aspect-video pl-2 md:pl-4 mx-1"
										key={item.imageKey}
									>
										<Image
											className="object-cover rounded-md"
											fill
											src={item.imageUrl}
											alt="course image"
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<div className="absolute left-1/2 mt-4">
								<CarouselPrevious />
								<CarouselNext />
							</div>
						</Carousel>
					))}
				{isEditing && (
					<div className="">
						<FileUpload
							endpoint="courseImage"
							onChange={async (data) => {
								if (data) {
									try {
										await updateCourse({
											courseId: props.initialData._id,
											images: data.map((image) => ({
												imageUrl: image.url,
												imageKey: image.key,
											})),
										});
										// Add success message or any other logic here
										toggleEdit();
										toast.success("Course Images updated successfully");
										router.refresh();
									} catch (error) {
										// Handle error here
										console.error("Error submitting form:", error);
										toast.error("Error updating course image");
										// Add error message or any other error handling logic here
									}
								}
							}}
						/>
						<div className="text-xs text-muted-foreground mt-4">
							16:9 aspect ratio recommended
						</div>
					</div>
				)}
			</CardHeader>
		</Card>
	);
};

export default CourseImageForm;