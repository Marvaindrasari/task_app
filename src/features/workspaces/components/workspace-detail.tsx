"use client";

import { useFetchWorkspaceById } from "../api/use-fetch-workspace-byid";
import { DottedSeparator } from "@/components/dotted-separator";
import { TaskViewSwitcher } from "@/features/task/components/task-view-switcher";
import { TaskTabs } from "@/features/task/components/task-tabs";

interface WorkspaceDetailProps {
    workspaceId: string;
}

export const WorkspaceDetail = ({ workspaceId }: WorkspaceDetailProps) => {
    const { data: workspace, isLoading, error } = useFetchWorkspaceById(workspaceId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading workspace</div>;

    if (!workspace) return <div>Workspace not found</div>;

    return (
        <div className="flex flex-col">
            <div className="pb-5">
                <h1 className="text-2xl font-bold pb-2">{workspace.name}</h1>
            </div>
            <DottedSeparator />
            <div className="py-4">
                <p>Workspace code: {workspace.code}</p>
                <p>Members: {workspace.membersName?.join(", ")}</p>
            </div>
        </div>
    );
};