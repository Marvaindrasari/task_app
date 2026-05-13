"use client";

import Link from "next/link";
import { useFetchWorkspaces } from "../api/use-update-workspace";

export const WorkspaceList = () => {
  const { data: workspaces, isLoading, error } = useFetchWorkspaces();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading workspace</div>;

  if (!workspaces || workspaces.length === 0) {
    return <div>No workspace found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {workspaces.map((ws: any) => (
        <div
          key={ws.$id}
          className="border p-4 rounded-lg flex justify-between items-center"
        >
          <h2 className="font-semibold">{ws.name}</h2>

          <Link
            href={`/workspace/${ws.$id}/settings`}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
};