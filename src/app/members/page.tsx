import { WorkspaceLists } from "@/features/members-settings/components/workspace-lists";
import { MemberList } from "@/features/members-settings/components/member-list";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Members</h1>

      <WorkspaceLists />
    </div>
  );
}