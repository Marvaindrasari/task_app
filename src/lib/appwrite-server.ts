// lib/appwrite-server.ts
import "server-only";
import { Client, Databases, Account, Users } from "node-appwrite";

console.log(
  "PROJECT ID:",
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
);

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.NEXT_APPWRITE_KEY!);

export const databases = new Databases(client);
export const account = new Account(client);
export const users = new Users(client);