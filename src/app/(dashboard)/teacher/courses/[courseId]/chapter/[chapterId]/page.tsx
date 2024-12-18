import { api } from "@/_generated/api";
import { Id } from "@/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import EditChapter from "../_components/edit-chapter";

type Props = {
	params: Promise<{
		courseId: Id<"course">;
		chapterId: Id<"chapter">;
	}>;
};

export default async function ChapterPage(props: Props) {
	const { courseId, chapterId } = await props.params;
	const preloadedChapter = await preloadQuery(api.chapter.chapter.getChapter, {
		chapterId,
	});
	return (
		<EditChapter
			courseId={courseId}
			chapterId={chapterId}
			preloadedChapter={preloadedChapter}
		/>
	);
}
