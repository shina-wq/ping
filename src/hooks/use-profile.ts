import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMe, updateMe, changeMyPassword } from "@/api/user";
import { queryKeys } from "@/lib/query-keys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: getMe,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changeMyPassword,
  });
}