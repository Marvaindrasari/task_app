import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, TASKS_ID } from "@/config";
import { Query } from "node-appwrite";

const app = new Hono();

app.get("/", sessionMiddleware, async (c) => {
  try {
    const databases = c.get("databases");
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId required" }, 400);
    }

    const res = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]
    );

    console.log("🔥 STATUS TASK:", res.documents.length);

    return c.json({ data: res.documents });

  } catch (err: any) {
    console.error("STATUS ROUTE ERROR:", err);
    return c.json({ error: "Failed fetch status tasks" }, 500);
  }
});

export default app;
