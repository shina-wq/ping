import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";

/**
 * Route guard for authenticated pages.
 *
 * - While session is being rehydrated: renders a full-page spinner so we
 *   never flash protected content or redirect prematurely.
 * - Unauthenticated after load: redirects to /login, preserving the
 *   intended destination so we can send the user back after login.
 * - Authenticated: renders child routes normally.
 */
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}