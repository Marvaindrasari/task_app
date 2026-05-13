// features/members/api/use-get-member.ts

import { useQuery } from "@tanstack/react-query";

type Member = {
  workspaceId: string;
  userId: string;
  userName: string;
  joinedAt: string;
  email: string;
};

// 👉 ini fetcher function (bisa dipakai di route handler)
export const getMembers = async (workspaceId: string): Promise<Member[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/${workspaceId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch members");
  }

  return res.json();
};

// 👉 ini hook-nya (khusus dipakai di React client component)
export const useGetMember = (workspaceId: string) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    enabled: !!workspaceId,
    queryFn: () => getMembers(workspaceId),
  });
};
