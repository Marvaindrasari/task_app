"use client";

import { useQuery } from "@tanstack/react-query";

type Workspace = {
    $id: string;
    name: string;
    userId: string;
    code?: string;
    members?: string[];
    createdName?: string; 
    membersName?: string[]; 
};

export const useFetchWorkspaceById = (id: string) => {
    return useQuery<Workspace, Error>({
        queryKey: ["workspace", id],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/${id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch workspace");
            }

            const data = await response.json();
            console.log("Fetched workspace data:", data); // Debugging log
            return data as Workspace;

        },
        enabled: !!id, // Hanya jalankan query jika id tersedia
    });
};