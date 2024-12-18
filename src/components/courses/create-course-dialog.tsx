"use client";

import { api } from "@/_generated/api";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type Props = {
	userId: string;
};

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title is required",
	}),
});

export default function CourseCreateDialog({ userId }: Props) {
	const [open, setOpen] = React.useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});
	const router = useRouter();

	const createCourse = useMutation(api.course.course.createCourse);

	const { isSubmitting, isValid } = form.formState;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const newCourse = await createCourse({
				title: values.title,
				clerkId: userId,
			});
			toast.success(
				"Course created successfully! redirecting you to course...",
			);
			setOpen(false);
			router.push(`/teacher/courses/${newCourse}`);
		} catch (error) {
			console.error("Error creating course:", error);
			toast.error("Something went wrong!");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="secondary" size="icon">
								<Plus className="size-5" />
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent className="my-1">Create Course</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a new course</DialogTitle>
					<DialogDescription>
						Name your course. Don&apos;t worry, you can change this later.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Course Title</FormLabel>
										<FormControl>
											<Input placeholder="Enter course title" {...field} />
										</FormControl>
										<FormDescription>
											What will you teach in this course?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-end space-x-4">
								<Button
									variant="outline"
									onClick={() => setOpen(false)}
									type="button"
								>
									Cancel
								</Button>
								<SubmitButton
									isSubmitting={isSubmitting}
									label="Create Course"
								/>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}