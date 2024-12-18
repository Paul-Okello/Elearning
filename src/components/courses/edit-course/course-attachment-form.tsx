"use client";

import { api } from "@/_generated/api";
import type { Doc, Id } from "@/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { TypographySmall } from "@/components/ui/typography";
import { useUploadThing } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { FileIcon, Loader, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	initialData: FunctionReturnType<typeof api.course.course.getCourse>;
};

const FormSchema = z.object({
	name: z
		.string({
			required_error: "Name of attachment is required",
		})
		.min(2, {
			message: "Username must be at least 2 characters.",
		}),
	file: z.instanceof(File),
});

const CourseAttachmentForm = (props: Props) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
		},
	});
	const updateCourse = useMutation(api.course.course.updateCourse);
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const { startUpload, isUploading } = useUploadThing("courseAttachment");
	const deleteAttachment = useMutation(api.attachments.deleteAttachment);
	const [deletingId, setDeletingId] = useState<Id<"attachments"> | null>(null);

	async function onSubmit(values: z.infer<typeof FormSchema>) {
		try {
			if (!values.file) {
				toast.error("Select a file to upload");
				throw new Error("No file selected");
			}

			toast.promise(
				startUpload([values.file]).then(async (response) => {
					const urls = response?.map((res) => res) || [];

					await updateCourse({
						courseId: props.initialData._id,
						fileUrl: urls[0].url,
						fileKey: urls[0].key,
						fileName: values.name,
						fileType: urls[0].type,
					});
				}),
				{
					loading: "Uploading file then updating course",
					success: "File Uploaded & Course Updated",
					error: "Something went wrong",
				},
			);

			// Add success message or any other logic here
			toggleEdit();
			router.refresh();
		} catch (error) {
			// Handle error here
			console.error("Error submitting form:", error);
			toast.error("Error updating course image");
			// Add error message or any other error handling logic here
		}
	}

	async function onDelete(id: Id<"attachments">) {
		try {
			setDeletingId(id);
			await deleteAttachment({
				attachmentId: id,
				courseId: props.initialData._id,
			});

			toast.success("Successfully removed attachment from course");
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		} finally {
			setDeletingId(null);
		}
	}
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Course Attachments</CardTitle>
					<Button size="sm" onClick={toggleEdit} variant="ghost">
						{isEditing && "Cancel"}
						{!isEditing && (
							<>
								<PlusCircle className="h-4 w-4 mr-2" />
								Add a file
							</>
						)}
					</Button>
				</div>
				{!isEditing && (
					<>
						{(!props.initialData.attachments ||
							props.initialData.attachments.length === 0) && (
							<TypographySmall className="text-stone-500 italic">
								No attachments yet
							</TypographySmall>
						)}
						{props.initialData.attachments &&
							props.initialData.attachments.length > 0 && (
								<div className="space-y-2">
									{props.initialData.attachments.map((at) => (
										<div
											key={at._id}
											className="flex items-center p-3 w-full bg-lime-100 border-lime-200 border text-lime-700 rounded-md"
										>
											<FileIcon className="size-4 mr-2 flex-shrink-0" />
											<TypographySmall className="">{at.name}</TypographySmall>
											{deletingId === at._id && (
												<div className="mx-2">
													<Loader2 className="size-4 animate-spin" />
												</div>
											)}
											{deletingId !== at._id && (
												<Button
													onClick={() => onDelete(at._id)}
													size="icon"
													className="ml-auto"
												>
													<X className="h-4 w-4" />
												</Button>
											)}
										</div>
									))}
								</div>
							)}
					</>
				)}
				{isEditing && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1  gap-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>File Name</FormLabel>
											<FormControl>
												<Input placeholder="File name" {...field} />
											</FormControl>
											<FormDescription>This the file name</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="file"
									render={({ field: { value, onChange, ...fieldProps } }) => (
										<FormItem>
											<FormLabel>File</FormLabel>
											<FormControl>
												<Input
													{...fieldProps}
													type="file"
													accept=".txt,.xml,.doc,.docx,.pdf,image/*, video/*, audio/*"
													onChange={(event) => {
														const file = event.target.files?.[0];
														onChange(file);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex justify-end items-end mt-2">
								<Button
									disabled={form.formState.isSubmitting || isUploading}
									size="sm"
									type="submit"
								>
									{form.formState.isSubmitting || isUploading ? (
										<Loader className="h-4 w-4 animate-spin" />
									) : (
										"Upload"
									)}
								</Button>
							</div>
						</form>
					</Form>
				)}
			</CardHeader>
		</Card>
	);
};

export default CourseAttachmentForm;