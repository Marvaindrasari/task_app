import { useQuery } from "@tanstack/react-query";

export const useFetchWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await fetch("/api/workspaces");

      if (!res.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      return res.json();
    },
  });
};