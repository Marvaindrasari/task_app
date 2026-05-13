// ...existing code...
"use client";

import { useParams } from "next/navigation";
import CreateNewProject from "@/features/projects/components/create-new-project";

export default function NewProjectPage() {
    const params = useParams();              // ubah sini
    const workspaceId = params.workspaceId as string; // ambil workspaceId dari params

    if (!workspaceId) {
        return <div className="p-6">Loading...</div>; // atau return null / notFound()
    }

    return (
        <div className="p-6">
            <CreateNewProject workspaceId={workspaceId} />
        </div>
    );
}