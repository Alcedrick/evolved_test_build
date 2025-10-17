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
import type * as attendance from "../attendance.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as payments from "../payments.js";
import type * as plans from "../plans.js";
import type * as users from "../users.js";
import type * as usersActions from "../usersActions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  attendance: typeof attendance;
  files: typeof files;
  http: typeof http;
  payments: typeof payments;
  plans: typeof plans;
  users: typeof users;
  usersActions: typeof usersActions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
