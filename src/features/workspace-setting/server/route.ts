import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACE_ID } from "@/config";

const app = new Hono();

// ✅ GET DETAIL
app.get("/:workspaceId", sessionMiddleware, async (c) => {
  const { workspaceId } = c.req.param();
  const databases = c.get("databases");

  const workspace = await databases.getDocument(
    DATABASE_ID,
    WORKSPACE_ID,
    workspaceId
  );

  return c.json(workspace);
});

// ✅ UPDATE
app.patch("/:workspaceId", sessionMiddleware, async (c) => {
  const { workspaceId } = c.req.param();
  const databases = c.get("databases");

  const { name } = await c.req.json();

  const updated = await databases.updateDocument(
    DATABASE_ID,
    WORKSPACE_ID,
    workspaceId,
    { name }
  );

  return c.json(updated);
});

// ✅ DELETE
app.delete("/:workspaceId", sessionMiddleware, async (c) => {
  const { workspaceId } = c.req.param();
  const databases = c.get("databases");

  await databases.deleteDocument(
    DATABASE_ID,
    WORKSPACE_ID,
    workspaceId
  );

  return c.json({ success: true });
});

export default app;