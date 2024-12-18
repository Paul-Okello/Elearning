"use client";

import { api } from "@/_generated/api";
import type { Id } from "@/_generated/dataModel";
import Editor from "@/components/editor";
import Preview from "@/components/preview";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { TypographySmall } from "@/components/ui/typography";
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
		description: string;
	};
	chapterId: Id<"chapter">;
};

const schema = z.object({
	description: z.string().min(1, "Title is required"),
});

const ChapterDescriptionForm = (props: Props) => {
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
				description: data.description,
			});
			toggleEdit();
			toast.success("Chapter Description updated successfully");
			router.refresh();
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("Error updating chapter description");
		}
	});
	return (
		<Card className="">
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Module Description</CardTitle>
					<Button onClick={toggleEdit} variant="ghost">
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
			</CardHeader>
			<CardContent>
				{props.initialData.description === "" && (
					<TypographySmall className="text-sm">
						No description added
					</TypographySmall>
				)}
				{props.initialData.description && !isEditing && (
					<Preview value={props.initialData.description} />
				)}
				{isEditing && (
					<Form {...form}>
						<form onSubmit={onSubmit} className="grid gap-3">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Editor {...field} />
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
			</CardContent>
		</Card>
	);
};

export default ChapterDescriptionForm;