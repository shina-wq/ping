import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { PageHeaderProvider } from "@/components/page-header-context";
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/router";

import { AppErrorBoundary } from "@/components/app-error-boundary";

// Created outside the component so it's never recreated on re-renders.
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
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PageHeaderProvider>
          <RouterProvider router={router} />
        </PageHeaderProvider>
        {/* Toaster must be outside RouterProvider so toasts survive route transitions. */}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}