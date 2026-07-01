import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import { FileQuestion, TriangleAlert } from "lucide-react";

import { ErrorPage } from "@/components/error-page";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (import.meta.env.DEV) {
    console.error(error);
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ErrorPage
        code="404"
        icon={<FileQuestion className="size-6" />}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have been moved."
        primaryAction={{ label: "Go to Dashboard", href: "/dashboard" }}
        secondaryAction={{ label: "Go back", onClick: () => navigate(-1) }}
      />
    );
  }

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : undefined;

  return (
    <ErrorPage
      code={isRouteErrorResponse(error) ? String(error.status) : undefined}
      icon={<TriangleAlert className="size-6" />}
      title="Something went wrong"
      description={message || "We hit an unexpected error loading this page. Please try again."}
      primaryAction={{ label: "Go to Dashboard", href: "/dashboard" }}
      secondaryAction={{ label: "Reload page", onClick: () => window.location.reload() }}
    />
  );
}