"use client";

import { SettingsIcon, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  workspaceId?: string;
};

export const Navigation = ({ workspaceId }: Props) => {
  const pathname = usePathname();

  const routes = [
    {
      label: "Home",
      href: "/",
      icon: GoHome,
      activeIcon: GoHomeFill,
    },
    {
      label: "My Workspace",
      href: "/my-workspace",
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
    },
    {
      label: "Workspace Settings",
      href : "/workspace-settings",
      //href: `/workspace/${workspaceId}/settings`,
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
    },
    {
      label: "Members",
      href: workspaceId
        ? `/workspace/${workspaceId}/members`
        : "/workspace-list",
      icon: UsersIcon,
      activeIcon: UsersIcon,
    },
  ];

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = pathname === item.href;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("")}
          >
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium transition",
                isActive
                  ? "bg-white shadow-sm text-primary"
                  : "text-neutral-500 hover:text-primary"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};