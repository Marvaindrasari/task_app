"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  workspaceId: string;
};

export default function WorkspaceSetting({ workspaceId }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH DETAIL WORKSPACE
  useEffect(() => {
    if (!workspaceId) return;

    const fetchWorkspace = async () => {
      try {
        const res = await fetch(
          `/api/workspace-setting/${workspaceId}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        console.log("DETAIL:", data);

        setName(data.name);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId]);

  // UPDATE WORKSPACE
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `/api/workspace-setting/${workspaceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name }),
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      alert("✅ Workspace updated!");

      router.back();
      router.refresh();

    } catch (err) {
      console.error(err);
      alert("Failed to update workspace");
    }
  };

  // DELETE WORKSPACE
  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this workspace?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/workspace-setting/${workspaceId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      alert("🗑️ Workspace deleted!");

      router.push("/dashboard");
      router.refresh();

    } catch (err) {
      console.error(err);
      alert("Failed to delete workspace");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">

      

      <h1 className="text-2xl font-bold">
        Workspace Settings
      </h1>

      {/* EDIT NAME */}
      <div className="space-y-2">
        <label className="font-medium">
          Workspace Name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 rounded"
        />

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Save Changes
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="border-t pt-6">
        <h2 className="text-red-500 font-semibold mb-2">
          Danger Zone
        </h2>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Delete Workspace
        </button>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="border px-4 py-2 rounded cursor-pointer bg-blue-500"
      >
        ← Back
      </button>
    </div>
  );
}