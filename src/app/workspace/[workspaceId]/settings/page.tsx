import WorkspaceSetting from "@/features/workspace-setting/components/workspace-setting";

export default function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  return <WorkspaceSetting workspaceId={params.workspaceId} />;
}