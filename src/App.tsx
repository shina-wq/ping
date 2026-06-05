import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { PageHeaderProvider } from "@/components/page-header-context";
import { router } from "@/router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageHeaderProvider>
        <RouterProvider router={router} />
      </PageHeaderProvider>
    </QueryClientProvider>
  );
}