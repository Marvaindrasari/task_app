"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

type Workspace = {
    $id: string;
    name: string;
    user_id: string;
    code?: string;
    members?: string[];
};

export const useFetchWorkspaces = () => {
    return useQuery<Workspace[], Error>({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces`);

            if (!response.ok) {
                throw new Error("Failed to fetch workspaces");
            }

            const data = await response.json();
            return data as Workspace[];
        },
    });
};