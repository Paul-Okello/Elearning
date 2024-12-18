"use client";

import { api } from "@/../convex/_generated/api";
import type { Id } from "@/_generated/dataModel";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	initialData: {
		title: string;
	};
	chapterId: Id<"chapter">;
};

const schema = z.object({
	title: z.string().min(1, "Title is required"),
});

const ChapterTitleForm = (props: Props) => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: props.initialData,
	});
	const updateChapter = useMutation(api.chapter.chapter.updateChapter);
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);
	const { isSubmitting } = form.formState;

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			await updateChapter({
				chapterId: props.chapterId,
				title: data.title,
			});
			// Add success message or any other logic here
			toggleEdit();
			toast.success("Chapter title updated successfully");
			router.refresh();
		} catch (error) {
			// Handle error here
			console.error("Error submitting form:", error);
			toast.error("Error updating chapter title");
			// Add error message or any other error handling logic here
		}
	});
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Chapter Title</CardTitle>
					<Button onClick={toggleEdit} variant="ghost">
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
				{!isEditing && <p className="text-sm">{props.initialData.title}</p>}
				{isEditing && (
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
												placeholder="Electoral Process Education"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center justify-end">
								<SubmitButton isSubmitting={isSubmitting} label="Update" />
							</div>
						</form>
					</Form>
				)}
			</CardHeader>
		</Card>
	);
};

export default ChapterTitleForm;