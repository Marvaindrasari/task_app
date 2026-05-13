import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { WorkspaceList } from "@/features/workspaces/components/workspace-list";
import { DottedSeparator } from "@/components/dotted-separator";
import { redirect } from "next/navigation";

//note: kita gak bisa pke "use client" dan async bersamaan karena bakal bikin error
export default async function Home() {
   const user = await getCurrent();

   if(!user) redirect("/sign-in");

   return (
      <div className="flex flex-col gap-4">
         <div className="flex flex-row gap-4 p-4 ">
               <div className="h-full w-full border-2 rounded-2xl">
                  <CreateWorkspaceForm />
               </div>
               <div className="h-full w-full border-2 rounded-2xl">
                  <JoinWorkspaceForm />
               </div>
         </div>
         <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Your Workspace</h1>
            <DottedSeparator />
            <WorkspaceList />
         </div>

      </div>
   );
}
