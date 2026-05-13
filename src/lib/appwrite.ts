import "server-only";
import { Client, Account, Storage, Users, Databases } from "node-appwrite";

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
    };
    
};

export const createSessionClient = async (cookies: string | undefined) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  // ⬇️ Pass cookie dari user (biar Appwrite bisa tahu session siapa)
  if (cookies) {
    client.headers["X-Appwrite-Cookie"] = cookies;
  }

  const account = new Account(client);
  return { client, account };
};

