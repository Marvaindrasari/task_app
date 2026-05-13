"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useJoinWorkspace = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (data: {code: string}) => {
            const res = await fetch ("/api/workspaces/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok){
                const errorData = await res.json();
                throw new Error("Failed to join workspace");
            }

            return res.json();
        },

        onSuccess: () => {
            toast.success("Successfully joined workspace");
            router.push("/");
        },

        onError: () => {
            toast.error("Failed to join workspace");
        },
    });

    return mutation;
};