"use client";

import { api } from "@/_generated/api";
import type { Doc, Id } from "@/_generated/dataModel";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Combobox from "@/components/ui/combobox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { TypographyInlineCode } from "@/components/ui/typography";
import { categoryNames, courseCategoriesFrontend } from "@/lib/course-utils";
import { cn } from "@/lib/utils";
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
	category: z.enum(categoryNames, {
		message: "Course must have a category",
	}),
});

const CourseCategoryForm = (props: Props) => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			category: props.initialData.category || undefined,
		},
	});
	const updateCourse = useMutation(api.course.course.updateCourse);
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);
	const { isSubmitting, isValid } = form.formState;

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			await updateCourse({
				courseId: props.initialData._id,
				category: data.category,
			});
			toggleEdit();
			toast.success("Course category updated successfully");
			router.refresh();
		} catch (error) {
			// Handle error here
			console.error("Error submitting form:", error);
			toast.error("Error updating course category");
			// Add error message or any other error handling logic here
		}
	});

	const selectedOption = courseCategoriesFrontend.find(
		(option) => option.name === props.initialData.category,
	);
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Course Category</CardTitle>
					<Button size="sm" onClick={toggleEdit} variant="ghost">
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Pencil className="size-4 mr-2" />
								Edit Category
							</>
						)}
					</Button>
				</div>
				{!isEditing && (
					<TypographyInlineCode
						className={cn(
							"text-sm mt-2",
							!props.initialData.category && "text-stone-500 italic",
						)}
					>
						{selectedOption?.name || "No Category"}
					</TypographyInlineCode>
				)}
				{isEditing && (
					<Form {...form}>
						<form onSubmit={onSubmit} className="flex flex-row">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Combobox
												{...field}
												options={courseCategoriesFrontend.map((category) => ({
													label: category.name,
													value: category.name,
													description: category.description,
												}))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center gap-x-2 mx-4">
								<SubmitButton isSubmitting={isSubmitting} label="Save" />
							</div>
						</form>
					</Form>
				)}
			</CardHeader>
		</Card>
	);
};

export default CourseCategoryForm;