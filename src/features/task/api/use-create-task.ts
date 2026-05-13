"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Struktur data project baru
type TaskPayload = {
  name: string;
  description?: string;
  dueDate?: string;
  assigneeId?: string;
  status?: string;
  workspaceId: string;
  projectId: string;
};

// Hook untuk membuat project baru
export const useCreateTasks = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // Fungsi utama untuk kirim data ke backend
    mutationFn: async (data: TaskPayload) => {
      const response = await fetch("/api/task", {
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
      toast.success("✅ Task created successfully!");
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: ["task", workspaceId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["task"] });
      }
    },

    // Kalau error, kasih notifikasi gagal
    onError: (error: any) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  return mutation;
};
