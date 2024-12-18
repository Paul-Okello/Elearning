"use client";

import { api } from "@/_generated/api";
import type { Id } from "@/_generated/dataModel";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	disabled: boolean;
	courseId: Id<"course">;
	chapterId: Id<"chapter">;
	isPublished: boolean;
};

const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: Props) => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const deleteChapter = useMutation(api.chapter.chapter.deleteChapter);
	const publishChapter = useMutation(api.chapter.chapter.publishChapter);
	const unpublishChapter = useMutation(api.chapter.chapter.unpublishChapter);

	async function unpublish() {
		try {
			setLoading(true);
			// unpublish chapter
			await unpublishChapter({
				chapterId,
				courseId,
			});
			setLoading(false);
			toast.warning("Chapter unpublished successfully");
			router.refresh();
		} catch (error) {
			setLoading(false);
			toast.error("Failed to unpublish chapter");
		} finally {
			setLoading(false);
		}
	}

	async function publish() {
		try {
			setLoading(true);
			// publish chapter
			await publishChapter({
				chapterId,
			});
			setLoading(false);
			toast.success("Chapter published successfully");
			router.push(`/teacher/courses/${courseId}`);
		} catch (error) {
			setLoading(false);
			toast.error("Failed to publish chapter");
		} finally {
			setLoading(false);
		}
	}

	async function onDelete() {
		try {
			setLoading(true);
			// delete chapter
			await deleteChapter({
				chapterId: chapterId,
				courseId: courseId,
			});
			setLoading(false);
			toast.success("Chapter deleted successfully");
			router.push(`/teacher/courses/${courseId}`);
		} catch (error) {
			setLoading(false);
			toast.error("Failed to delete chapter");
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="flex items-center gap-x-2">
			{isPublished ? (
				<Button onClick={unpublish} disabled={loading || disabled} size="sm">
					Unpublish
				</Button>
			) : (
				<Button onClick={publish} disabled={loading || disabled} size="sm">
					Publish
				</Button>
			)}
			<ConfirmModal onConfirm={onDelete}>
				<Button
					className="rounded-full"
					variant="destructive"
					disabled={loading}
					size="icon"
				>
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default ChapterActions;