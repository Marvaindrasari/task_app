"use client";

import { useEffect, useState } from "react";

export const useGetCalendarTasks = (workspaceId: string) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?workspaceId=${workspaceId}`);
        const json = await res.json();
        setTasks(json.data || []);
      } catch (err) {
        console.error("fetch calendar error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [workspaceId]);

  return { tasks, loading };
};