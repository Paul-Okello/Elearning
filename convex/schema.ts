import { attachmentsFields } from "@/attachments";
import { chapterFields } from "@/chapter/chapter";
import { courseFields } from "@/course/course";
import { muxDataFields } from "@/mux/mux";
import { userFields } from "@/user/user";
import { defineSchema } from "convex/server";

export default defineSchema({
	user: userFields,
	course: courseFields,
	chapter: chapterFields,
	muxData: muxDataFields,
	attachments: attachmentsFields,
});