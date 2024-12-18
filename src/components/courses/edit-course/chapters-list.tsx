"use client";

import { api } from "@/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { GripIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	initialData: FunctionReturnType<typeof api.course.course.getCourse>;
};

const ChaptersList = ({ initialData }: Props) => {
	const [isMounted, setIsMounted] = useState(false);
	const [chapters, setChapters] = useState(initialData.chapters);
	const router = useRouter();
	const updateChapters = useMutation(
		api.chapter.chapter.updateChapterPositions,
	);

	useEffect(() => {
		setIsMounted(true);
		return () => {
			setIsMounted(false);
		};
	}, []);

	useEffect(() => {
		setChapters(initialData.chapters);
	}, [initialData.chapters]);

	async function onDragEnd(result: DropResult) {
		if (!result.destination) return;

		const items = Array.from(chapters);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		const startIndex = Math.min(result.source.index, result.destination.index);
		const endIndex = Math.max(result.source.index, result.destination.index);

		const updatedChapters = items.slice(startIndex, endIndex + 1);

		setChapters(items);

		try {
			await updateChapters({
				chapters: updatedChapters.map((chapter) => ({
					chapterId: chapter._id,
					position: items.findIndex((item) => item._id === chapter._id),
				})),
			});

			toast.success("Chapters reordered successfully");
			router.refresh();
		} catch (error) {
			console.error("Error updating chapters:", error);
			toast.error("Error updating chapters");
		}
	}

	if (!isMounted) return null;

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="chapters">
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{chapters.map((chapter, index) => (
							<Draggable
								key={chapter._id}
								draggableId={chapter._id}
								index={index}
							>
								{(provided) => (
									<div
										ref={provided.innerRef}
										className="bg-muted rounded-md p-2 flex items-center gap-x-2 mb-2"
										{...provided.draggableProps}
									>
										<div
											{...provided.dragHandleProps}
											className={cn("flex items-center gap-x-2")}
										>
											<GripIcon className="size-4" />
											<TypographySmall>{chapter.title}</TypographySmall>
										</div>

										<div className="ml-auto pr-2 flex items-center gap-x-2">
											{chapter.isFree && (
												<Badge className="cursor-pointer" variant="outline">
													Free
												</Badge>
											)}
											<Badge className="cursor-pointer">
												{chapter.isPublished ? "Published" : "Draft"}
											</Badge>
											<Button
												size="icon"
												variant="outline"
												className="rounded-full"
												asChild
											>
												<Link
													href={`/teacher/courses/${initialData._id}/chapter/${chapter._id}`}
												>
													<Pencil className="size-4 cursor-pointer" />
												</Link>
											</Button>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default ChaptersList;