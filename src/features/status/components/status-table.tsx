"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetStatus } from "../api/use-fetch-status-task";

export default function StatusTable() {
  const { workspaceId } = useParams();
  const { tasks, loading } = useGetStatus(workspaceId as string);

  // 🔥 state tambahan
  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // 🔥 fetch project + members
  useEffect(() => {
    if (!workspaceId) return;

    const fetchAll = async () => {
      try {
        const [projectRes, memberRes] = await Promise.all([
          fetch(`/api/projects?workspaceId=${workspaceId}`),
          fetch(`/api/members/${workspaceId}`)
        ]);

        const projectJson = await projectRes.json();
        const memberJson = await memberRes.json();

        setProjects(projectJson.data || []);
        setMembers(Array.isArray(memberJson) ? memberJson : []);
      } catch (err) {
        console.error("❌ fetch project/member error:", err);
      }
    };

    fetchAll();
  }, [workspaceId]);

  // 🔥 ambil nama project
  const getProjectName = (projectId?: string) => {
    const p = projects.find((proj) => proj.$id === projectId);
    return p ? p.projectName || p.name : "-";
  };

  // 🔥 ambil nama assignee
  const getAssigneeName = (assigneeId?: string) => {
    const m = members.find((mem) => mem.userId === assigneeId);
    return m ? m.userName || m.email || "User" : "-";
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const todo = tasks.filter((t) => t.status === "TODO");
  const progress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const review = tasks.filter((t) => t.status === "IN_REVIEW");
  const done = tasks.filter((t) => t.status === "DONE");

  const Column = ({ title, data }: any) => (
    <div className="bg-white rounded-xl border p-4 w-full shadow-sm">
      <h2 className="font-bold mb-3 text-gray-700">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No task now</p>
      ) : (
        data.map((task: any) => (
          <div
            key={task.$id}
            className="border rounded-lg p-3 mb-3 bg-gray-50 hover:shadow transition"
          >
            {/*TASK NAME */}
            <p className="font-semibold text-sm mb-1">
              {task.taskName || task.name || "Untitled"}
            </p>

            {/*PROJECT */}
            <p className="text-xs text-blue-500 font-medium">
              Project : {getProjectName(task.projectId)}
            </p>

            {/*ASSIGNEE */}
            <p className="text-xs text-gray-600">
              👤 {getAssigneeName(task.assigneeId)}
            </p>

            {/*DATE */}
            <p className="text-xs text-gray-400 mt-1">
              📅 {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      <Column title="TODO" data={todo} />
      <Column title="IN PROGRESS" data={progress} />
      <Column title="IN REVIEW" data={review} />
      <Column title="DONE" data={done} />
    </div>
  );
}
