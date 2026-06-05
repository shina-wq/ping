import { Outlet } from "react-router-dom";

import { AuthProvider } from "@/contexts/auth-context";

/**
 * Top-level layout route. Wraps every route in AuthProvider so that
 * useNavigate (used internally by AuthProvider) is always available.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}