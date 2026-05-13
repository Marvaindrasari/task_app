import { useEffect, useState } from "react";

export const useGetStatus = (workspaceId?: string) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchStatus = async () => {
      try {
        console.log("🔥 fetch status workspace:", workspaceId);

        const res = await fetch(`/api/status?workspaceId=${workspaceId}`);
        const json = await res.json();

        console.log("🔥 status response:", json);

        setTasks(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Status fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [workspaceId]);

  return { tasks, loading };
};
