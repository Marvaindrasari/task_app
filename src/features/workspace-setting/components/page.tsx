import { WorkspaceList } from "@/features/workspace-setting/components/workspace-list";
import { Sidebar } from "lucide-react";


export default function Page() {
  return (
    <div className="p-6">
    
      <h1 className="text-2xl font-bold">
        Workspace Settings
      </h1>

      <WorkspaceList />
    </div>
  );
}