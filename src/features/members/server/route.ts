import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createMemberSchema } from "../schema";
import { ID, Query } from "node-appwrite";

const app = new Hono();

//Ambil email user dari appwrite
const extractEmail = (user: any): string | null => {
  if (user.email) return user.email;

  if (user.identities && user.identities.length > 0) {
    return user.identities[0].providerEmail ?? null;
  }

  return null;
};

// ambil semua member dari workspace
app.get(
  "/:workspaceId",
  sessionMiddleware,
  async (c) => {
    try {
      const workspaceId = c.req.param("workspaceId"); // <-- use param('workspaceId')
      const databases = c.get("databases");

      const result = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      // inspect jika masih aneh:
      // console.log("members result:", result);
      return c.json(result.documents);
    } catch (err: any) {
      console.error("GET /api/members/:workspaceId error:", err);
      return c.json({ error: err?.message ?? String(err) }, 500);
    }
  }
);

app.post(
  "/", 
  sessionMiddleware,                 // ensure session first
  zValidator("json", createMemberSchema),
  async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");

      console.log("EMAIL YANG DISIMPAN:", user.email);

      const { workspaceId, userId, userName } = c.req.valid("json");

      const created = await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        { workspaceId, userId, userName, email: user.email ?? null, }
      );

      console.log("EMAIL YANG DISIMPAN:", user.email);
      return c.json(created);
    } catch (err: any) {
      console.error("POST /api/members error:", err);
      const status = err?.code ?? 500;
      const body = err?.response ? JSON.parse(err.response) : { message: err?.message ?? String(err) };
      return c.json({ error: body.message || "Internal Server Error" }, status);
      
    }
  }
);

export default app;