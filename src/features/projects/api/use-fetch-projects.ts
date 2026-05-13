"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type Projects = { 
  id: string;
  projectName: string;
  description?: string;
  workspaceId: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

export const useFetchProject = (workspaceId?: string) => {
  return useQuery<Projects, Error>({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await fetch("api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Fetched projects data:", data); // Debugging log
      return data as Projects;

    },
  });
};
