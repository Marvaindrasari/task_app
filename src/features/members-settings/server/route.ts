import { Hono } from "hono";
import { Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID } from "@/config";

const app = new Hono();

// ✅ GET MEMBERS BY WORKSPACE
app.get("/workspace/:workspaceId", sessionMiddleware, async (c) => {
  const databases = c.get("databases");
  const { workspaceId } = c.req.param();

  try {
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );

    return c.json(members.documents);
  } catch (err) {
    console.error("GET MEMBERS ERROR:", err);

    return c.json(
      {
        error: "Failed to fetch members",
      },
      500
    );
  }
});

// ✅ DELETE MEMBER
app.delete("/:memberId", sessionMiddleware, async (c) => {
  const databases = c.get("databases");
  const { memberId } = c.req.param();
  console.log("MEMBER SETTINGS ROUTE LOADED");
  console.log("DELETE MEMBER ID:", memberId);

  try {
    const result = await databases.deleteDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    console.log("DELETE SUCCESS:", result);

    return c.json({
      success: true,
    });
  } catch (err: any) {
    console.error("DELETE ERROR FULL:", err);

    return c.json(
      {
        error: err?.message || "Failed delete",
      },
      500
    );
  }
});

export default app;