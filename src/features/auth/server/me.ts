import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono();

app.get("/", sessionMiddleware, async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  return c.json({ userId: user.$id, email: user.email });
});

export default app;
