"use client";

import Link from "next/link";
import { useFetchWorkspaces } from "../api/use-fetch-workspace";

export const WorkspaceList = () => {
    const { data: workspaces, isLoading, error } = useFetchWorkspaces();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading workspaces: {error.message}</div>;
    if (!workspaces || workspaces.length === 0) {
        return <div>No workspaces found</div>;
    }

    return (
        <div className="flex flex-col gap-y-4">
            {workspaces.map((ws) => (
                <Link key={ws.$id} href={`/workspace/${ws.$id}`}>
                    <div className="p-4 border rounded-xl shadow hover:bg-gray-100 transition cursor-pointer">
                        <h2>{ws.name}</h2>
                    </div>
                </Link>
            ))}
        </div>
    );
};