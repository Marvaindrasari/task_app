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

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/auth/current", {
          credentials: "include",
        });

        if (!res.ok) return;

        const json = await res.json();

        if (mounted && json?.data?.$id) {
          setUserId(json.data.$id);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchProjects() {
      setLoadingProjects(true);

      try {
        const res = await fetch(
          `/api/projects?workspaceId=${workspaceId}`
        );

        const text = await res.text();

        let data: any;

        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        if (!mounted) return;

        const docs = Array.isArray(data)
          ? data
          : data?.documents || data?.data || [];

        setProjects(
          docs.map((d: any) => ({
            $id: d.$id || d.id,
            projectName: d.projectName || d.name || "Untitled",
          }))
        );
      } catch (err) {
        console.error("fetchProjects error:", err);
        setProjects([]);
      } finally {
        if (mounted) setLoadingProjects(false);
      }
    }

    if (workspaceId) {
      fetchProjects();
    } else {
      setLoadingProjects(false);
    }

    return () => {
      mounted = false;
    };
  }, [workspaceId]);

  useEffect(() => {
    let mounted = true;

    async function fetchMembers() {
      setLoadingMembers(true);

      try {
        const tryEndpoints = [
          `/api/members/${workspaceId}`,
          `/api/members?workspaceId=${workspaceId}`,
        ];

        let raw: any = null;

        for (const url of tryEndpoints) {
          try {
            const res = await fetch(url);

            const text = await res.text();

            const data = (() => {
              try {
                return JSON.parse(text);
              } catch {
                return text;
              }
            })();

            if (res.ok) {
              raw = data;
              break;
            }

            if (
              data &&
              (
                Array.isArray(data) ||
                data.documents ||
                data.data ||
                data.members ||
                data.workspaces
              )
            ) {
              raw = data;
              break;
            }
          } catch (e) {
            console.error(e);
          }
        }

        if (!mounted) return;

        if (!raw) {
          setMembers([]);
          return;
        }

        let docs: any[] = [];

        if (Array.isArray(raw)) docs = raw;
        else if (raw.documents) docs = raw.documents;
        else if (raw.data) docs = raw.data;
        else if (raw.members && Array.isArray(raw.members))
          docs = raw.members;
        else if (raw.workspaces && Array.isArray(raw.workspaces)) {
          docs = raw.workspaces.flatMap(
            (w: any) => w.members || []
          );
        } else {
          docs = [raw];
        }

        if (
          docs.length &&
          docs[0] &&
          Array.isArray(docs[0].members)
        ) {
          docs = docs.flatMap((d: any) => d.members || []);
        }

        const mapped: Member[] = docs
          .map((m: any) => ({
            $id:
              m.$id ||
              m.id ||
              `${m.userId ?? ""}-${Math.random()}`,

            userId:
              m.userId ||
              m.user_id ||
              m.user?.$id ||
              m.$id ||
              m.id ||
              "",

            userName:
              m.userName ||
              m.name ||
              m.user?.name ||
              m.displayName ||
              m.username ||
              "Tanpa Nama",
          }))
          .filter((x) => x.userId);

        setMembers(mapped);
      } catch (err) {
        console.error("fetchMembers error:", err);
        setMembers([]);
      } finally {
        if (mounted) setLoadingMembers(false);
      }
    }

    if (workspaceId) {
      fetchMembers();
    } else {
      setLoadingMembers(false);
    }

    return () => {
      mounted = false;
    };
  }, [workspaceId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!workspaceId) {
      alert("Workspace ID missing");
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

      console.log("POST /api/tasks payload:", payload);

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let body: any;

      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }

      if (!res.ok) {
        console.error(
          "Create task failed:",
          res.status,
          body
        );

        alert(
          typeof body === "string"
            ? body
            : JSON.stringify(body, null, 2)
        );

        return;
      }

      alert("✅ Task created");

      router.back();
    } catch (err) {
      console.error("submit error:", err);
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

      <Input
        type="text"
        name="name"
        placeholder="Task Title"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Textarea
        name="description"
        placeholder="Task Description"
        value={formData.description}
        onChange={handleChange}
      />

      <div>
        <label className="text-sm font-medium mb-1 block">
          Project
        </label>

        <Select
          onValueChange={(val) =>
            setFormData((p) => ({
              ...p,
              projectId: val,
            }))
          }
          value={formData.projectId}
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
            {loadingProjects ? (
              <p className="text-center py-2 text-sm text-gray-500">
                Loading projects...
              </p>
            ) : projects.length === 0 ? (
              <p className="text-center py-2 text-sm text-gray-500">
                No projects
              </p>
            ) : (
              projects.map((p) => (
                <SelectItem key={p.$id} value={p.$id}>
                  {p.projectName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Assignee
        </label>

        <Select
          onValueChange={(val) =>
            setFormData((p) => ({
              ...p,
              assigneeId: val,
            }))
          }
          value={formData.assigneeId}
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
            {loadingMembers ? (
              <p className="text-center py-2 text-sm text-gray-500">
                Loading members...
              </p>
            ) : members.length === 0 ? (
              <p className="text-center py-2 text-sm text-gray-500">
                No members found
              </p>
            ) : (
              members.map((m) => (
                <SelectItem
                  key={m.userId || m.$id}
                  value={m.userId || m.$id}
                >
                  {m.userName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Due Date
        </label>

        <Input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Status
        </label>

        <Select
          onValueChange={(val) =>
            setFormData((p) => ({
              ...p,
              status: val as TaskStatus,
            }))
          }
          value={formData.status}
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
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Task"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>
    </form>
  );
}