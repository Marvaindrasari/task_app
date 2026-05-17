"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ID } from "node-appwrite";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

interface Project {
  $id: string;
  projectName: string;
}

interface Member {
  $id: string;
  userId: string;
  userName: string;
}

export default function CreateNewTask({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    assigneeId: "",
    status: TaskStatus.TODO,
    projectId: "",
  });

  // GET CURRENT USER
  useEffect(() => {
    let mounted = true;

    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/auth/current", {
          credentials: "include",
        });

        if (!res.ok) return;

        const json = await res.json();

        console.log("CURRENT USER:", json);

        if (mounted && json?.data?.$id) {
          setUserId(json.data.$id);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  // FETCH PROJECTS
  useEffect(() => {
    let mounted = true;

    async function fetchProjects() {
      setLoadingProjects(true);

      try {
        const res = await fetch(
          `/api/projects?workspaceId=${workspaceId}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json().catch(() => null);

        console.log("PROJECTS API:", data);

        if (!mounted) return;

        const docs = data?.data || data?.documents || [];

        const mapped: Project[] = docs.map((p: any) => ({
          $id: p.$id,
          projectName: p.projectName || "Untitled",
        }));

        console.log("MAPPED PROJECTS:", mapped);

        setProjects(mapped);
      } catch (err) {
        console.error(err);
        setProjects([]);
      } finally {
        if (mounted) setLoadingProjects(false);
      }
    }

    if (workspaceId) {
      fetchProjects();
    }

    return () => {
      mounted = false;
    };
  }, [workspaceId]);

  // FETCH MEMBERS
  useEffect(() => {
    let mounted = true;

    async function fetchMembers() {
      setLoadingMembers(true);

      try {
        const res = await fetch(
          `/api/members/${workspaceId}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json().catch(() => null);

        console.log("MEMBERS API:", data);

        if (!mounted) return;

        const mapped: Member[] = (data || []).map((m: any) => ({
          $id: m.$id || m.id,
          userId: m.userId,
          userName: m.userName || "Unknown",
        }));

        console.log("MAPPED MEMBERS:", mapped);

        setMembers(mapped);
      } catch (err) {
        console.error(err);
        setMembers([]);
      } finally {
        if (mounted) setLoadingMembers(false);
      }
    }

    if (workspaceId) {
      fetchMembers();
    }

    return () => {
      mounted = false;
    };
  }, [workspaceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectId) {
      alert("Select project first");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        workspaceId,
        userId: userId ?? "guest",
        taskId: ID.unique(),
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        alert(body?.message || "Failed create task");
        return;
      }

      alert("✅ Task created");

      router.back();
      router.refresh();

    } catch (err) {
      console.error(err);
      alert("Error creating task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full mx-auto p-4 border rounded-xl shadow bg-white"
    >
      <h2 className="text-xl font-semibold mb-4">
        Create New Task
      </h2>

      {/* TASK NAME */}
      <Input
        name="name"
        placeholder="Task Title"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* DESCRIPTION */}
      <Textarea
        name="description"
        placeholder="Task Description"
        value={formData.description}
        onChange={handleChange}
      />

      {/* PROJECT */}
      <Select
        value={formData.projectId}
        onValueChange={(val) =>
          setFormData((prev) => ({
            ...prev,
            projectId: val,
          }))
        }
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              loadingProjects
                ? "Loading projects..."
                : "Select Project"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {projects.map((project) => (
            <SelectItem
              key={project.$id}
              value={project.$id}
            >
              {project.projectName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ASSIGNEE */}
      <Select
        value={formData.assigneeId}
        onValueChange={(val) =>
          setFormData((prev) => ({
            ...prev,
            assigneeId: val,
          }))
        }
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              loadingMembers
                ? "Loading members..."
                : "Select Assignee"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {members.map((member) => (
            <SelectItem
              key={member.userId}
              value={member.userId}
            >
              {member.userName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* DUE DATE */}
      <Input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
      />

      {/* STATUS */}
      <Select
        value={formData.status}
        onValueChange={(val) =>
          setFormData((prev) => ({
            ...prev,
            status: val as TaskStatus,
          }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={TaskStatus.TODO}>
            Todo
          </SelectItem>

          <SelectItem value={TaskStatus.IN_PROGRESS}>
            In Progress
          </SelectItem>

          <SelectItem value={TaskStatus.IN_REVIEW}>
            In Review
          </SelectItem>

          <SelectItem value={TaskStatus.DONE}>
            Done
          </SelectItem>
        </SelectContent>
      </Select>

      {/* SUBMIT */}
      <Button
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}