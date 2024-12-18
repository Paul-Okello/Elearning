"use client";

import { api } from "@/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SubmitButton from "@/components/submit-button";
import { TypographyInlineCode } from "@/components/ui/typography";
import { FunctionReturnType } from "convex/server";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
	initialData: FunctionReturnType<typeof api.course.course.getCourse>;
};

const schema = z.object({
	title: z.string().min(1, "Title is required"),
});

const CourseTitleForm = (props: Props) => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: props.initialData.title || "",
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
				title: data.title,
			});
			// Add success message or any other logic here
			toggleEdit();
			toast.success("Course title updated successfully");
			router.refresh();
		} catch (error) {
			// Handle error here
			console.error("Error submitting form:", error);
			toast.error("Error updating course title");
			// Add error message or any other error handling logic here
		}
	});
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Course Title</CardTitle>
					<Button size="sm" onClick={toggleEdit} variant="ghost">
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Pencil className="size-4 mr-2" />
								Edit Title
							</>
						)}
					</Button>
				</div>
				{!isEditing && (
					<TypographyInlineCode className="text-sm">
						{props.initialData.title}
					</TypographyInlineCode>
				)}
				{isEditing && (
					<Form {...form}>
						<form onSubmit={onSubmit} className="flex flex-row">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder="Electoral Process Education"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center gap-x-2 mx-4">
								<SubmitButton isSubmitting={isSubmitting} label="Save Title" />
							</div>
						</form>
					</Form>
				)}
			</CardHeader>
		</Card>
	);
};

export default CourseTitleForm;