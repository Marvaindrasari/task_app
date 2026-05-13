"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  const params = useParams();

  // 🔥 aman dari undefined
  const workspaceId =
    typeof params?.workspaceId === "string"
      ? params.workspaceId
      : undefined;

  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={120}
          height={30}
        />
      </Link>

      <DottedSeparator className="my-4" />

      {/* 🔥 kirim workspaceId kalau ada */}
      <Navigation workspaceId={workspaceId} />
    </aside>
  );
};