import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

// Factory for the common "mutate, then invalidate some queries" shape.

export function useResourceMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  getInvalidateKeys: (variables: TVariables, data: TData) => readonly QueryKey[]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      for (const queryKey of getInvalidateKeys(variables, data)) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}