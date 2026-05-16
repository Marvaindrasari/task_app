// lib/appwrite-server.ts
import "server-only";
import { Client, Databases, Account, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.NEXT_APPWRITE_KEY!); // server key

export const databases = new Databases(client);
export const account = new Account(client);
export const users = new Users(client);
