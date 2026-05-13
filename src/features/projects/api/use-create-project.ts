"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 🧱 Struktur data project baru
type ProjectPayload = {
  projectName: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  workspaceId: string;
};

// 🔥 Hook untuk membuat project baru
export const useCreateProject = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // Fungsi utama untuk kirim data ke backend
    mutationFn: async (data: ProjectPayload) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error("❌ Error creating project:", err);
        throw new Error(err?.error || "Failed to create project");
      }

      return await response.json();
    },

    // Kalau sukses, kasih notifikasi dan refresh data
    onSuccess: () => {
      toast.success("✅ Project created successfully!");
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    },

    // Kalau error, kasih notifikasi gagal
    onError: (error: any) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  return mutation;
};
