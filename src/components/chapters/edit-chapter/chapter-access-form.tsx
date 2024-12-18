"use client";

import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import SubmitButton from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	initialData: {
		isFree: boolean;
	};
	chapterId: Id<"chapter">;
};

const schema = z.object({
	isFree: z.boolean().default(false).optional(),
});

const ChapterAccessForm = (props: Props) => {
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
				isFree: data.isFree,
			});
			toggleEdit();
			toast.success("Chapter access updated");
			router.refresh();
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("Error updating chapter access");
		}
	});
	return (
		<Card className="">
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Chapter Access</CardTitle>
					<Button onClick={toggleEdit} variant="ghost">
						{isEditing ? (
							<>Cancel</>
						) : (
							<>
								<Eye className="size-4 mr-2" />
								Edit Access
							</>
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{!isEditing ? (
					props.initialData.isFree ? (
						<Badge variant="outline">Free</Badge>
					) : (
						<Badge>Premium</Badge>
					)
				) : null}

				{isEditing && (
					<Form {...form}>
						<form onSubmit={onSubmit} className="grid gap-3">
							<FormField
								control={form.control}
								name="isFree"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												Make this chapter free for all users
											</FormLabel>
											<FormDescription>
												This will allow all users to access this chapter without
												any restrictions
											</FormDescription>
										</div>
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

export default ChapterAccessForm;