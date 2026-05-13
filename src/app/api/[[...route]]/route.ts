import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";
import tasks from "@/features/task/server/route";
import members from "@/features/members/server/route";
import projects from "@/features/projects/server/route";
import status from "@/features/status/server/route";
import task from "@/features/task/server/route";
import workspaceSetting from "@/features/workspace-setting/server/route";
import membersSettings from "@/features/members-settings/server/route";

const app = new Hono().basePath("/api");

const route = app
    .route("/auth", auth)
    .route("/workspace-setting", workspaceSetting)
    .route("/task", task)
    .route("/workspaces", workspaces)
    .route("/tasks", tasks)
    .route("/members", members)
    .route("/my-workspace", workspaces) //karna nnt ini redirectnya ke workspace (features)
    .route("/projects", projects)
    .route("/status", status)
    .route("/members-settings", membersSettings);


export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type AppType = typeof route;