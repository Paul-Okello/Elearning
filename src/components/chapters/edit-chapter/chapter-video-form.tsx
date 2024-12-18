"use client";

import { api } from "@/_generated/api";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MuxPlayer from "@mux/mux-player-react";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	initialData: FunctionReturnType<typeof api.chapter.chapter.getChapter>;
};

const ChapterVideoForm = (props: Props) => {
	const updateChapter = useMutation(api.chapter.chapter.updateChapter);
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);

	async function onSubmit(url: string) {
		try {
			await updateChapter({
				chapterId: props.initialData._id,
				videoUrl: url,
			});
			// Add success message or any other logic here
			toggleEdit();
			toast.success("Chapter Video updated successfully");
			router.refresh();
		} catch (error) {
			// Handle error here
			console.error("Error submitting form:", error);
			toast.error("Error updating chapter video");
			// Add error message or any other error handling logic here
		}
	}
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<CardTitle>Chapter Video</CardTitle>
					<Button size="sm" onClick={toggleEdit} variant="ghost">
						{isEditing && "Cancel"}
						{!isEditing && !props.initialData.videoUrl && (
							<>
								<PlusCircle className="h-4 w-4 mr-2" />
								Add a video
							</>
						)}

						{!isEditing && props.initialData.videoUrl && (
							<>
								<Pencil className="size-4 mr-2" />
								Edit Video
							</>
						)}
					</Button>
				</div>
				{!isEditing &&
					(!props.initialData.videoUrl ? (
						<div className="flex items-center justify-center h-60 bg-stone-200 rounded-md">
							<Video className="h-10 w-10 text-stone-500" />
						</div>
					) : (
						<div className="relative aspect-video mt-2">
							<MuxPlayer playbackId={props.initialData.playbackId} />
						</div>
					))}

				{isEditing && (
					<div className="">
						<FileUpload
							endpoint="chaptervideo"
							onChange={async (data) => {
								try {
									await updateChapter({
										chapterId: props.initialData._id,
										videoUrl: data[0].url,
									});
									// Add success message or any other logic here
									toggleEdit();
									toast.success("Chapter Video updated successfully");
									router.refresh();
								} catch (error) {
									// Handle error here
									console.error("Error submitting form:", error);
									toast.error("Error updating chapter video");
									// Add error message or any other error handling logic here
								}
							}}
						/>
						<div className="text-xs text-muted-foreground mt-4">
							upload this chapter&apos;s video
						</div>
					</div>
				)}
				{props.initialData.videoUrl && !isEditing && (
					<div className="text-xs text-muted-foreground mt-2">
						Videos can take a few minutes to process. Refresh the page if video
						does not appear.
					</div>
				)}
			</CardHeader>
		</Card>
	);
};

export default ChapterVideoForm;