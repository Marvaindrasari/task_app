import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Databases, Query } from "node-appwrite";
import { createProjectSchemas } from "@/features/projects/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PROJECT, PROJECT_COLLECTION_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono();

// ✅ sessionMiddleware harus di atas
app.post(
  "/",
  sessionMiddleware,
  zValidator("json", createProjectSchemas),
  async (c) => {
    try { 

      const databases = c.get("databases");
      const user = c.get("user");
  
      const { workspaceId, projectName, description, startDate, endDate, status } = c.req.valid("json");
  
      const incomingProjectId = c.req.valid("json").projectId;

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        ID.unique(),
        {
          projectId: incomingProjectId ?? ID.unique(),
          workspaceId, // ✅ perbaikan utama
          projectName,
          description,
          startDate,
          endDate,
          status,
          userId: user.$id,
        }
      );
  
      return c.json({ data: project });
    } catch (err: any) {
      console.error("POST /api/projects error:", err);
      const status = err?.code ?? 500;
      const body = err?.response ? JSON.parse(err.response) : { message: err.message };
      return c.json({ error: body.message || "Internal Server Error" }, status);
    }
    }
);

app.get(
  "/",
  sessionMiddleware,
  async (c) => {
    try {
      const databases = c.get("databases");
      const workspaceId = c.req.query("workspaceId");

      if (!workspaceId) 
        return c.json({ error: "workspaceId query parameter is required" }, 400);
      

      const res = await databases.listDocuments(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      return c.json({ data: res.documents });
    } catch (err: any) {
      console.error("GET /api/projects error:", err);
      return c.json({ error: "Failed to fetch projects" }, 500);
    }
  }
);

//Get Projects (dropdown)
app.get("/", sessionMiddleware, async (c) => {
  try {
    const databases = c.get("databases");
    const workspaceId = c.req.query("workspaceId");

    let queries = [];

    // kalau workspaceId dikirim → filter
    if (workspaceId) {
      queries.push(Query.equal("workspaceId", workspaceId));
    }

    const res = await databases.listDocuments(DATABASE_ID, PROJECT_COLLECTION_ID, queries);
    const documents = res.documents.map((doc) => ({
      $id: doc.$id,
      name: doc.projectName,
      status: doc.status,
      workspaceId: doc.workspaceId,
    }));

    return c.json({ data: documents });
  } catch (err: any) {
    console.error("GET /api/projects error:", err);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

//Update status project
app.patch(
  "/:projectId", 
  sessionMiddleware,
  async(c) => {
  try {
    const { projectId } = c.req.param();
    const { status } = await c.req.json();
    const databases = c.get("databases");

    const updated = await databases.updateDocument(
      DATABASE_ID,
      PROJECT_COLLECTION_ID,
      projectId,
      { status }
    );

    return c.json({ data: updated });
  } catch (err: any) {
    console.error("PATCH /api/projects/:projectId error:", err);
    return c.json({ error: "Failed to update project status" }, 500);
  }
});

// Delete project
app.delete(
  "/:projectId",
  sessionMiddleware,
  async (c) => {
    try {
      const { projectId } = c.req.param();
      const databases = c.get("databases");

      await databases.deleteDocument(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        projectId
      );

      return c.json({ message: "Project deleted successfully" });
    } catch (err: any) {
      console.error("DELETE /api/projects/:projectId error:", err);
      return c.json({ error: "Failed to delete project" }, 500);
    }
  }
);

export default app;
