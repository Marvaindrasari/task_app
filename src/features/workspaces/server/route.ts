import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { ID } from "node-appwrite";
import { Query } from "node-appwrite";
import { join } from "path";


const app = new Hono()
    .post(
        "/",
        zValidator("json", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const id = ID.unique();
            const { name, image, code } = c.req.valid("json");

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACE_ID,
                id,
                {
                    workspaceId : id,
                    name,
                    code,
                    image,
                    userId: user.$id,
                }
            );

            //menambahkan user pembuat workspace ke tabel members
            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId: id,
                    userId: user.$id,
                    userName: user.name,
                    joinedAt: new Date().toISOString(), //gunakan ISO string untuk tanggal
                }
            );

            return c.json({ data: workspace });
        }
    );

    //ambil workspace yang sudah dibuat oleh user atau yang diikuti oleh user
    app.get(
        "/",
        sessionMiddleware, //ambil data user dari session
        async (c) => {
            try{
                const databases = c.get("databases");
                const user = c.get("user");
    
                //ambil workspace buat User join dari tabel members
                const memberResults = await databases.listDocuments(
                    DATABASE_ID,
                    MEMBERS_ID,
                    [
                        Query.equal("userId", user.$id) //filter berdasarkan userID
                    ]
                );

                //ambil id workspace yang sudah diikuti user
                const workspaceIds = memberResults.documents.map((doc) => doc.workspaceId);

                const createdQuery = Query.equal("userId", user.$id); //yang dibuat user
                const joinedQuery = workspaceIds.map(id => Query.equal("workspaceId", id)); //yang diikuti user

                let finalQuery;
                if (joinedQuery.length > 0) {
                    const allQuery = [createdQuery, ...joinedQuery];
                    finalQuery = Query.or(allQuery); //gabungkan query yang dibuat user dan yang diikuti user
                } else {
                    finalQuery = createdQuery; //hanya yang dibuat user
                }

                const result = await databases.listDocuments(
                    DATABASE_ID,
                    WORKSPACE_ID,
                    [finalQuery]
                );
    
                return c.json(result.documents );

            } catch (error) {
                console.error("Error fetching workspaces:", error);
                return c.json({ error: "Failed to fetch workspaces" }, 500);
            }
        }
    );
    
    //join workspace
    app.post(
        "/join",
        sessionMiddleware,
        async(c) => {
            const { code } = await c.req.json(); //ambil code dari body request
            //ambil database client (c)
            const databases = c.get("databases");
            const user = c.get("user"); //ngambil user dari session biar tahu siapa yang lagi join
        
            //cari database workspace yang punya code yang sama dengan inpout user
            const result = await databases.listDocuments(
                DATABASE_ID,
                WORKSPACE_ID,
                [Query.equal("code", code)]
            );

            const workspace = result.documents[0]; //ambil workspace yang pertama karna 1 code 1 workspace

            //kalau workspace tidak ada
            if (!workspace) {
                return c.json({error: "Workspace not found" }, 404);
            }

            //cek apakah user sudah join workspace belum
            const joinedMembers = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [
                    //filter berdasarkan workspaceId dan userId
                    Query.equal("workspaceId", workspace.$id),
                    Query.equal("userId", user.$id),
                ]
            );

            if (joinedMembers.documents.length > 0){
                return c.json({ message: "You have already joined the workspace"});
            }

            //insert anggota baru ke tabel members
            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId: workspace.$id,
                    userId: user.$id,
                    userName: user.name,
                    email: user.email,
                    joinedAt: new Date().toISOString(), //gunakan ISO string untuk tanggal
                }
            );

            return c.json({ message: "Successfully joined workspace" });
            
        }
    );

    app.get(
        "/:id",
        sessionMiddleware,
        async (c) => {
            const { id } = c.req.param(); // Ambil id dari parameter URL
            const databases = c.get("databases");
            const users = c.get("users");

            try {
                const workspace = await databases.getDocument(DATABASE_ID, WORKSPACE_ID, id);
    
                if (!workspace) {
                    return c.json({ error: "Workspace not found" }, 404);
                }

                //ambil nama pembuat workspace dari field yang udah disimpan
                let createdName = "unknown";
                try{
                    const createdBy = await users.get(workspace.userId); //ambil user dari id yang ada di workspace
                    createdName = createdBy.name; //ambil nama user
                } catch (error) {
                    console.error("Error fetching user:", error);
                }

                //ambil semua member dari tabel members
                const members = await databases.listDocuments(
                    DATABASE_ID,
                    MEMBERS_ID,
                    [
                        Query.equal("workspaceId", id)
                    ]
                );

                const membersName = members.documents.map((doc) => doc.userName);

                return c.json({
                    ...workspace,
                    createdName,
                    membersName,
                });
            } catch (error) {
                console.error("Error fetching workspace:", error);
                return c.json({ error: "Workspace not found" }, 404);
            }
        }
    );
export default app;