"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TaskTable() {
  const { workspaceId } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchData = async () => {
      try {
        const [taskRes, projectRes, memberRes] = await Promise.all([
          fetch(`/api/tasks?workspaceId=${workspaceId}`),
          fetch(`/api/projects?workspaceId=${workspaceId}`),
          fetch(`/api/members/${workspaceId}`), // 🔥 ambil data member
        ]);

        const taskJson = await taskRes.json();
        const projectJson = await projectRes.json();
        const memberJson = await memberRes.json();

        const { data: taskData } = taskJson;
        const { data: projectData } = projectJson;

        setTasks(Array.isArray(taskData) ? taskData : []);
        setProjects(Array.isArray(projectData) ? projectData : []);
        setMembers(Array.isArray(memberJson) ? memberJson : []);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  const getProjectName = (id?: string) => {
    const p = projects.find((proj) => proj.$id === id);
    return p ? (p.name || p.projectName || p.title || "-") : "-";
  };

  const getMemberName = (id?: string) => {
    const member = members.find((m) => m.userId === id);
    return member ? member.userName || "Unknown" : "-";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async (taskId: string) => {
    const confirmDelete = confirm("Are you sure want to delete this task?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((t) => t.$id !== taskId));
    } catch (err) {
      console.error("❌ Gagal delete task:", err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t.$id === taskId ? { ...t, status: newStatus } : t))
      );

      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("❌ Gagal update status:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-200 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">Task Name</th>
            <th className="px-4 py-2">Project</th>
            <th className="px-4 py-2">Due Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Assignee</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr
                key={task.$id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{task.name || task.taskName || "-"}</td>
                <td className="px-4 py-2">{getProjectName(task.projectId)}</td>
                <td className="px-4 py-2">{formatDate(task.dueDate)}</td>
                <td className="px-4 py-2">
                  <select
                    value={task.status || "To Do"}
                    onChange={(e) =>
                      handleStatusChange(task.$id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  {getMemberName(task.assigneeId)}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(task.$id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No task available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
