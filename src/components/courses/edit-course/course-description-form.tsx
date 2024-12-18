"use client";

import { api } from "@/_generated/api";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	initialData: FunctionReturnType<typeof api.course.course.getCourse>;
};

const schema = z.object({
	description: z.string().min(1, "Description is required"),
});

const CourseDescriptionForm = (props: Props) => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			description: props.initialData.description || "",
		},
	});
	const updateCourse = useMutation(api.course.course.updateCourse);
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);
	const { isSubmitting } = form.formState;

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			await updateCourse({
				courseId: props.initialData._id,
				description: data.description,
			});
			// Add success message or any other logic here
			toggleEdit();
			toast.success("Chapter Description updated successfully");
			router.refresh();
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
					<CardTitle>Course Description</CardTitle>
					<Button size="sm" onClick={toggleEdit} variant="ghost">
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Pencil className="size-4 mr-2" />
								Edit Description
							</>
						)}
					</Button>
				</div>
				{!isEditing && (
					<p className="text-sm">{props.initialData.description}</p>
				)}
				{isEditing && (
					<Form {...form}>
						<form onSubmit={onSubmit} className="space-y-3">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Textarea
												disabled={isSubmitting}
												placeholder="e.g this course is about..."
												{...field}
												rows={6}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center justify-end">
								<SubmitButton isSubmitting={isSubmitting} label="Save" />
							</div>
						</form>
					</Form>
				)}
			</CardHeader>
		</Card>
	);
};

export default CourseDescriptionForm;