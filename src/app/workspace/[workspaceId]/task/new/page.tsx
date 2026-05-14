// ...existing code...
"use client";

import { useParams } from "next/navigation";
import CreateNewTask from "@/features/task/components/create-new-task";

export default function NewProjectPage() {
    const params = useParams();              // ubah sini
    const workspaceId = params.workspaceId as string; // ambil workspaceId dari params
    //const projectId = params.projectId as string; // ambil workspaceId dari params

    if (!workspaceId) {
        return <div className="p-6">Loading...</div>; // atau return null / notFound()
    }

    return (
        <div className="p-6">
            <CreateNewTask workspaceId={workspaceId}/>
        </div>
    );
}