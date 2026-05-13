"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ID } from "node-appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

enum ProjectStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  IN_REVIEW = "IN_REVIEW",
}

export default function CreateNewProject({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  // 🔑 Ambil userId dari session Appwrite
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/current", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const { data } = await res.json();
          setUserId(data.$id);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getUser();
  }, []);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: ProjectStatus.TODO,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectOwner = userId || "guest";

    const payload = {
      ...formData,
      workspaceId,
      userId: projectOwner,
      projectId: ID.unique(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("POST /api/projects payload:", payload);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        console.error("Create project failed:", res.status, body);

        alert(
          typeof body === "string"
            ? body
            : JSON.stringify(body, null, 2)
        );

        return;
      }

      console.log("✅ Project created:", body);

      alert("Project created successfully!");

      // optional redirect setelah berhasil
      router.back();
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full mx-auto p-4 border rounded-xl shadow"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create New Project</h2>
      </div>

      <Input
        type="text"
        name="projectName"
        placeholder="Project Name"
        value={formData.projectName}
        onChange={handleChange}
        required
      />

      <Textarea
        name="description"
        placeholder="Project Description"
        value={formData.description}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="mb-1">
            Start Date
          </label>

          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="endDate" className="mb-1">
            End Date
          </label>

          <Input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <Select
        onValueChange={(val) =>
          setFormData({
            ...formData,
            status: val as ProjectStatus,
          })
        }
        defaultValue={formData.status}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={ProjectStatus.TODO}>Todo</SelectItem>
          <SelectItem value={ProjectStatus.IN_PROGRESS}>
            In Progress
          </SelectItem>
          <SelectItem value={ProjectStatus.DONE}>Done</SelectItem>
          <SelectItem value={ProjectStatus.IN_REVIEW}>
            In Review
          </SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full cursor-pointer">
        Create Project
      </Button>
      <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full cursor-pointer"
        >
          Back
        </Button>
    </form>
  );
}