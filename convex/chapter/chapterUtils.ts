import { Id } from "@/_generated/dataModel";
import { MutationCtx, QueryCtx } from "@/_generated/server";
import { ConvexError } from "convex/values";

export function getChapterById(
	ctx: QueryCtx | MutationCtx,
	chapterId: Id<"chapter">,
) {
	const chapter = ctx.db.get(chapterId);
	if (!chapter) throw new ConvexError("Chapter not found");
	return chapter;
}

