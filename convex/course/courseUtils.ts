import { Id } from "@/_generated/dataModel";
import { MutationCtx, QueryCtx } from "@/_generated/server";
import { ConvexError } from "convex/values";

export async function getCourseById(
	ctx: QueryCtx | MutationCtx,
	courseId: Id<"course">,
) {
	const course = await ctx.db.get(courseId);
	if (!course) throw new ConvexError("Course not found");
	return course;
}