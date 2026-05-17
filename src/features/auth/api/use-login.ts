"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType =
  InferResponseType<typeof client.api.auth.login["$post"]>;

type RequestType =
  InferRequestType<typeof client.api.auth.login["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {

      const response = await client.api.auth.login["$post"](
        { json },
        {
          init: {
            credentials: "include",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      return await response.json();
    },

    onSuccess: async () => {
      toast.success("Login success");

      await queryClient.invalidateQueries({
        queryKey: ["current"],
      });

      router.push("/dashboard");
    },

    onError: () => {
      toast.error("Login failed");
    },
  });

  return mutation;
};