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
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
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
	price: z.coerce.number(),
});

const CoursePriceForm = (props: Props) => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			price: props.initialData.price || undefined,
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
				price: data.price,
			});
			// Add success message or any other logic here
			toggleEdit();
			toast.success("Course Price updated successfully");
			router.refresh();
		} catch (error) {
			// Handle error here
			console.error("Error submitting form:", error);
			toast.error("Error updating course Price");
			// Add error message or any other error handling logic here
		}
	});
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Course Price</CardTitle>
					<Button size="sm" onClick={toggleEdit} variant="ghost">
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Pencil className="size-4 mr-2" />
								Edit Price
							</>
						)}
					</Button>
				</div>
				{!isEditing && (
					<p
						className={cn(
							"text-base mt-2",
							!props.initialData.price && "text-stone-500 italic",
						)}
					>
						{props.initialData.price
							? formatPrice(props.initialData.price)
							: "No Price"}
					</p>
				)}
				{isEditing && (
					<Form {...form}>
						<form onSubmit={onSubmit} className="flex flex-row">
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Input
												type="number"
												step="0.01"
												disabled={isSubmitting}
												placeholder="Set a price for your course"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center gap-x-2 mx-4">
								<SubmitButton isSubmitting={isSubmitting} label="Save Price" />
							</div>
						</form>
					</Form>
				)}
			</CardHeader>
		</Card>
	);
};

export default CoursePriceForm;