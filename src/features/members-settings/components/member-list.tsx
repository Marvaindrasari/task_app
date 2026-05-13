"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  workspaceId: string;
};

export const MemberList = ({ workspaceId }: Props) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ FETCH MEMBERS
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/members/${workspaceId}`);
        const data = await res.json();

        setMembers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [workspaceId]);

  // ✅ REMOVE MEMBER
  const handleRemove = async (memberId: string) => {
    const confirmDelete = confirm("Yakin mau hapus member?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/members-settings/${memberId}`, {
      method: "DELETE",
      credentials: "include",
      });

      if (!res.ok) throw new Error("Failed");

      // update UI tanpa reload
      setMembers((prev) => prev.filter((m) => m.$id !== memberId));
    } catch (err) {
      console.error(err);
      alert("Gagal hapus member");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      

      {!members.length && <p>No members</p>}

      {members.map((m) => (
        <div
          key={m.$id}
          className="border p-4 rounded flex justify-between items-center"
        >
          <div>
            {/* tampilkan email kalau ada */}
            <p className="font-medium">
              {m.email || m.userName}
            </p>

            <p className="text-sm text-gray-500">
              {m.role || "member"}
            </p>
          </div>

          {/* ❌ REMOVE BUTTON */}
          <button
            onClick={() => handleRemove(m.$id)}
            className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={() => router.back()}
        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
      >
        Back
      </button>

    </div>
  );
};