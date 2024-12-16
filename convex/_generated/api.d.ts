/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chapter_chapter from "../chapter/chapter.js";
import type * as chapter_chapterUtils from "../chapter/chapterUtils.js";
import type * as course_course from "../course/course.js";
import type * as course_courseUtils from "../course/courseUtils.js";
import type * as mux_mux from "../mux/mux.js";
import type * as mux_muxActions from "../mux/muxActions.js";
import type * as user_user from "../user/user.js";
import type * as user_userUtils from "../user/userUtils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "chapter/chapter": typeof chapter_chapter;
  "chapter/chapterUtils": typeof chapter_chapterUtils;
  "course/course": typeof course_course;
  "course/courseUtils": typeof course_courseUtils;
  "mux/mux": typeof mux_mux;
  "mux/muxActions": typeof mux_muxActions;
  "user/user": typeof user_user;
  "user/userUtils": typeof user_userUtils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
