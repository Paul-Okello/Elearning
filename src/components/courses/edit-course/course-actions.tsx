"use client";

import { api } from "@/_generated/api";
import type { Id } from "@/_generated/dataModel";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	disabled: boolean;
	courseId: Id<"course">;
	isPublished: boolean;
	userId: string;
};

const CourseActions = ({ disabled, courseId, isPublished, userId }: Props) => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const confetti = useConfettiStore();
	const deleteCourse = useMutation(api.course.course.deleteCourse);
	const publishCourse = useMutation(api.course.course.publishCourse);
	const unpublishCourse = useMutation(api.course.course.unpublishCourse);

	async function unpublish() {
		try {
			setLoading(true);
			// unpublish chapter
			await unpublishCourse({
				courseId,
			});
			setLoading(false);
			toast.warning("Course unpublished successfully");
			router.refresh();
		} catch (error) {
			setLoading(false);
			toast.error("Failed to unpublish course");
		} finally {
			setLoading(false);
		}
	}

	async function publish() {
		try {
			setLoading(true);
			// publish chapter
			await publishCourse({
				courseId,
			});
			setLoading(false);
			toast.success("Course published successfully");
			confetti.onOpen();
			router.push("/teacher/courses");
			router.refresh();
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
			await deleteCourse({
				courseId,
				clerkId: userId,
			});
			setLoading(false);
			toast.success("Chapter deleted successfully");
			router.push("/teacher/courses");
			router.refresh();
		} catch (error) {
			setLoading(false);
			toast.error("Failed to delete course");
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="flex items-center gap-x-2 ml-auto">
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
				<Button disabled={loading} size="icon">
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default CourseActions;