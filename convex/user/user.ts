import { mutation, query } from "@/_generated/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userFields = defineTable({
	firstName: v.string(),
	middleName: v.optional(v.string()),
	lastName: v.string(),
	email: v.string(),
	clerkId: v.string(),
	image: v.optional(v.string()),
	role: v.union(v.literal("Student"), v.literal("Teacher")),
}).index("by_clerkId", ["clerkId"]);

export const createUser = mutation({
	args: {
		firstName: v.string(),
		middleName: v.optional(v.string()),
		lastName: v.string(),
		email: v.string(),
		clerkId: v.string(),
		image: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { clerkId, ...rest } = args;
		const user = await ctx.db
			.query("user")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
			.first();

		if (!user) {
			return await ctx.db.insert("user", {
				firstName: args.firstName,
				middleName: args.middleName,
				lastName: args.lastName,
				email: args.email,
				clerkId: args.clerkId,
				image: args.image,
				role: "Student",
			});
		}

		await ctx.db.patch(user._id, {
			...rest,
		});
	},
});

export const getDbUser = query({
	args: {
		clerkId: v.string(),
	},
	handler: async (ctx, { clerkId }) => {
		const user = await ctx.db
			.query("user")
			.withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
			.first();

		return user;
	},
});