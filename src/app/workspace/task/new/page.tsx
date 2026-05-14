"use client";

import { useParams } from "next/navigation";
import CreateNewTask from "@/features/task/components/create-new-task";

export default function NewTaskPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  if (!workspaceId) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <CreateNewTask workspaceId={workspaceId} />
    </div>
  );
}