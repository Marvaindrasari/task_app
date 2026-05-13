"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type Task = {
  name: string;
  description?: string;
  dueDate?: string;
  assigneeId?: string;
  status?: string;
  workspaceId: string;
  projectId: string;
};

export const useFetchProject = (workspaceId?: string) => {
  return useQuery<Task, Error>({
    queryKey: ["task", workspaceId],
    queryFn: async () => {
      const response = await fetch("api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const data = await response.json();
      console.log("Fetched task data:", data); // Debugging log
      return data as Task;

    },
  });
};
