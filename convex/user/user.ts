import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userFields = defineTable({
	firstName: v.string(),
	middleName: v.optional(v.string()),
	lastName: v.string(),
	email: v.string(),
	clerkId: v.string(),
	image: v.optional(v.string()),
}).index("by_clerkId", ["clerkId"]);