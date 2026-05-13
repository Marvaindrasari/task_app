import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Databases, Query, ID } from "node-appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, TASKS_ID } from "@/config";
import { createTaskSchema } from "../schemas";

const app = new Hono();

// CREATE TASK
app.post("/", sessionMiddleware, zValidator("json", createTaskSchema), async (c) => {
  try {
    const databases = c.get("databases") as Databases;
    const user = c.get("user");
    const body = c.req.valid("json");

    const task = await databases.createDocument(
      DATABASE_ID,
      TASKS_ID,
      ID.unique(),
      {
        ...body,
        createdBy: user.$id,
      }
    );

    return c.json({ data: task });
  } catch (err: any) {
    console.error("POST /api/tasks error:", err);
    return c.json({ error: err?.message || "Internal Server Error" }, 500);
  }
});

// GET TASKS BY WORKSPACE
app.get("/", sessionMiddleware, async (c) => {
  try {
    const workspaceId = c.req.query("workspaceId");
    if (!workspaceId) return c.json({ error: "workspaceId required" }, 400);

    const databases = c.get("databases");

    const res = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );

    return c.json({ data: res.documents });
  } catch (err: any) {
    console.error("GET /api/tasks error:", err);
    return c.json({ error: err?.message }, 500);
  }
});

// UPDATE TASK STATUS
app.patch("/:taskId", sessionMiddleware, async (c) => {
  try {
    const databases = c.get("databases");
    const { taskId } = c.req.param();
    const { status } = await c.req.json();

    if (!status) return c.json({ error: "status required" }, 400);

    console.log("🔹 PATCH task:", taskId, "status:", status);

    const updated = await databases.updateDocument(
      DATABASE_ID,
      TASKS_ID,
      taskId,
      { status }
    );

    return c.json({ data: updated });
  } catch (err: any) {
    console.error("❌ PATCH /api/tasks/:taskId error:", err);
    return c.json({ error: err?.message }, 500);
  }
});

// DELETE TASK
app.delete("/:taskId", sessionMiddleware, async (c) => {
  try {
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    await databases.deleteDocument(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    return c.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    console.error("❌ DELETE /api/tasks/:taskId error:", err);
    return c.json({ error: err?.message || "Failed to delete task" }, 500);
  }
});

export default app;
