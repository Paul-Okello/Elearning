import { MutationCtx, QueryCtx } from "@/_generated/server";

export async function getUserById(ctx: QueryCtx | MutationCtx, userId: string) {
	const user = await ctx.db
		.query("user")
		.withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
		.first();

	return user;
}