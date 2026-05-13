//import MemberList from "@/features/members-settings/components/member-list";
import { MemberList } from "@/features/members-settings/components/member-list";

export default function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>

      <MemberList workspaceId={params.workspaceId} />
    </div>
  );
}