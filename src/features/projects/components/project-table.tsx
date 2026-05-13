"use client";

import { useEffect, useState } from "react";
import { ProjectStatus } from "../types";
import { useParams } from "next/navigation";

interface ProjectTableProps {
    $id: string;
    projectName: string;
    startDate?: string;
    endDate?: string;
    status: ProjectStatus;
}

const projectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.TODO]: "To do",
  [ProjectStatus.IN_PROGRESS]: "In Progress",
  [ProjectStatus.IN_REVIEW]: "In Review",
  [ProjectStatus.DONE]: "Done",
};

export default function ProjectTable () {
    const [projects, setProjects] = useState<ProjectTableProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const param = useParams();
    const workspaceId = param?.workspaceId as string;
    //Fetch project list
    const fetchProjects = async () => {
        try{
            const res = await fetch(`/api/projects?workspaceId=${workspaceId}`);
            if(!res.ok) throw new Error("Failed to fetch projects");
            const { data } = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch(error){
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=> {
        fetchProjects();
    }, []);

    const handleDelete = async (projectId: string) => {
        const confirmDelete = confirm("Are you sure want to delete this project?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
            method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete project");

            setProjects((prev) => prev.filter((p) => p.$id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    //Update project status
    const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
        try{
            setUpdatingId(projectId);
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if(!res.ok) throw new Error("Failed to update project status");
    
            setProjects((prev) => 
                prev.map((p) => 
                    p.$id === projectId ? { ...p, status: newStatus } : p)
                );
        } catch (error){
            console.error("Error updating project status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    if(loading) return <p className="text-center p-4">Loading projects...</p>
    if(projects.length === 0) return <p className="text-center p-4">No projects found.</p>

    return (
        <div className="w-full overflow-x-auto border rounded-lg ">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-blue-200 text-gray-700 uppercase">
                    <tr className="bg-blue-200">
                        <th className="text-left p-2 h-3">Project Name</th>
                        <th className="text-left p-2">Start Date </th>
                        <th className="text-left p-2">End Date </th>
                        <th className="text-left p-2">Status </th>
                        <th className="text-left p-2">Action </th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.$id} className="border-t border-gray-300">
                            <td className="p-2">{project.projectName}</td>
                            <td className="p-2">{project.startDate ? new Date(project.startDate).toLocaleDateString("id-ID") : "-"}</td>
                            <td className="p-2">{project.endDate ? new Date(project.endDate).toLocaleDateString("id-ID") : "-"}</td>
                            <td className="p-2">
                                <select
                                    className="border border-gray-300 rounded p-1"
                                    value={project.status}
                                    onChange={(e) => 
                                        handleStatusChange(project.$id, e.target.value as ProjectStatus)
                                    }
                                    disabled={updatingId === project.$id}
                                    >
                                        {Object.values(ProjectStatus).map((status) => (
                                            <option key ={status} value={status}>
                                                {projectStatusLabels[status]}
                                            </option>
                                        ))}
                                    </select>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDelete(project.$id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
}