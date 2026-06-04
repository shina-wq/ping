import { RouterProvider } from "react-router-dom";

import { PageHeaderProvider } from "@/components/page-header-context";
import { router } from "@/router";

export default function App() {
  return (
    <PageHeaderProvider>
      <RouterProvider router={router} />
    </PageHeaderProvider>
  );
}
