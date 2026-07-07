import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { ErrorPage } from "@/components/error-page";
import type { UserRole } from "@/api/auth";

type RequireRoleProps = {
  allow: UserRole[];
};

export default function RequireRole({ allow }: RequireRoleProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !allow.includes(user.role)) {
    return (
       <ErrorPage
        code="403"
        icon={<Lock className="size-6" />}
        title="Access restricted"
        description="You don't have permission to view this page."
        primaryAction={{ label: "Go to Dashboard", href: "/dashboard" }}
        secondaryAction={{ label: "Go back", onClick: () => navigate(-1) }}
      />
    )
  }

  return <Outlet />;
}