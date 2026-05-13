import { WorkspaceLists } from "@/features/members-settings/components/workspace-lists"; 

export default function Page() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Workspace</h1>

      <WorkspaceLists />
    </div>
  );
}