"use client";

import { api } from "@/_generated/api";
import type { Id } from "@/_generated/dataModel";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ChaptersList from "./chapters-list";

type Props = {
	initialData: FunctionReturnType<typeof api.course.course.getCourse>;
};

const schema = z.object({
	title: z.string().min(1, "Title is required"),
});

const CourseChaptersForm = (props: Props) => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
		},
	});
	const createChapter = useMutation(api.chapter.chapter.createChapter);
	const updateChapters = useMutation(
		api.chapter.chapter.updateChapterPositions,
	);

	const [isCreating, setIsCreating] = useState(false);

	const toggleCreating = () => setIsCreating((current) => !current);
	const { isSubmitting, isValid } = form.formState;

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			await createChapter({
				courseId: props.initialData._id,
				title: data.title,
			});

			// Add success message or any other logic here
			toggleCreating();
			toast.success("Chapter successfully created");
			form.reset();
		} catch (error) {
			// Handle error here
			console.error("Error submitting form:", error);
			toast.error("Error updating course Description");
			// Add error message or any other error handling logic here
		}
	});

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Course Chapter</CardTitle>
					<Button size="sm" onClick={toggleCreating} variant="ghost">
						{isCreating ? (
							<>Cancel</>
						) : (
							<>
								<PlusCircle className="size-4 mr-2" />
								Add a chapter
							</>
						)}
					</Button>
				</div>
				{isCreating && (
					<Form {...form}>
						<form onSubmit={onSubmit} className="space-y-3">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder="e.g Introduction to the course"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center  justify-end">
								<SubmitButton isSubmitting={isSubmitting} label="Add Chapter" />
							</div>
						</form>
					</Form>
				)}
				{!isCreating && (
					<div
						className={cn(
							"text-sm mt-2 text-stone-500",
							!props.initialData.chapters.length && "italic",
						)}
					>
						{!props.initialData.chapters.length && "No Chapters"}
						{/* TODO: Add a list of chapters */}
						<ChaptersList initialData={props.initialData} />
					</div>
				)}
				{!isCreating && (
					<CardDescription className="text-xs mt-4">
						Drag & Drop to reorder the chapters
					</CardDescription>
				)}
			</CardHeader>
		</Card>
	);
};

export default CourseChaptersForm;