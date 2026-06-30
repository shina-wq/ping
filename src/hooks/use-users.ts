import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
  type ListUsersParams,
} from "@/api/user";
import { queryKeys } from "@/lib/query-keys";

export function useUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.all(params),
    queryFn: () => getUsers(params),
    select: (res) => res.data,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: Parameters<typeof updateUser>[0] extends string
      ? never
      : { userId: string; input: Parameters<typeof updateUser>[1] }) =>
      updateUser(userId, input),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}