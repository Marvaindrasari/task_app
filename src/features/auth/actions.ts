//MENGAMBIL DATA/INFORMASI AKUN PENGGUNA

"use server";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constans";

export const getCurrent = async () => { //getCurrent adalah function untuk mendapatkan informasi akun pengguna
  try{
      const client = new Client() //membuat instance Appwrite client
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  
      const session = (await cookies()).get(AUTH_COOKIE); //mengambil cookie autentikasi
  
      if( !session ) return null; //jika tidak ada session return null

      client.setSession(session.value); //mengatur sesi Appwrite dengan token dari cookie
      const account = new Account(client); //membuat instance account untuk mengambil data pengguna
  
      return await account.get(); //mendapatkan data pengguna
  } catch {
    return null; //klu ada error makan akan dikembalikan(return) null
  }

  };  