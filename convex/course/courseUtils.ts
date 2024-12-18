import { Id } from "@/_generated/dataModel";
import { MutationCtx, QueryCtx } from "@/_generated/server";
import { getCourseAttachments } from "@/attachments";
import { ConvexError } from "convex/values";

import { Infer, v } from "convex/values";

export const courseCategories = v.union(
	v.literal("Science & Technology"), // Combines Science, Technology, Mathematics, Physics, Chemistry, Biology, Engineering
	v.literal("Programming"), // Kept as a standalone category for relevance
	v.literal("Health & Medicine"), // Combines Health, Medicine
	v.literal("Business & Economics"), // Combines Business, Economics, Marketing, Industry
	v.literal("Arts & Design"), // Combines Art, Music, Film, Literature, Design, Architecture, Fashion
	v.literal("History & Politics"), // Combines History, Politics
	v.literal("Lifestyle & Home"), // Combines Lifestyle, Home, Parenting, Relationships, Personal
	v.literal("Sports & Recreation"), // Combines Sports, Travel
	v.literal("Food & Beauty"), // Combines Food, Beauty
	v.literal("Spirituality & Self-help"), // Combines Spirituality, Self-help, Sexuality
	v.literal("Education"), // Broad category for general learning topics
	v.literal("Agriculture"), // Kept as a standalone due to its niche importance
);

export type CourseCategories = Infer<typeof courseCategories>;

export async function getCourseById(
	ctx: QueryCtx | MutationCtx,
	courseId: Id<"course">,
) {
	const course = await ctx.db.get(courseId);
	if (!course) throw new ConvexError("Course not found");
	const attachments = await getCourseAttachments(ctx, {
		courseId,
	});
	return {
		...course,
		attachments,
	};
}