import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getSession,
  login as apiLogin,
  logout as apiLogout,
  clearToken,
} from "@/api/auth";
import type { AuthUser, LoginPayload } from "@/api/auth";
import { queryKeys } from "@/lib/query-keys";

// Types

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

// Context

const AuthContext = createContext<AuthContextValue | null>(null);

// Provider

// eslint-disable-next-line react-refresh/only-export-components
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Keep ref in sync after every render — avoids stale closure in event handlers
  const navigateRef = useRef(navigate);
  useLayoutEffect(() => {
    navigateRef.current = navigate;
  });

  const { data: user = null, isLoading } = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: getSession,
    retry: false,
  });

  // Global 401 handler — dispatched from apiClient interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData(queryKeys.auth.session(), null);
      navigateRef.current("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [queryClient]);

  // apiLogin already handles setToken internally
  const login = useCallback(async (payload: LoginPayload) => {
    const { user: loggedInUser } = await apiLogin(payload);
    queryClient.setQueryData(queryKeys.auth.session(), loggedInUser);
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      clearToken();
      queryClient.setQueryData(queryKeys.auth.session(), null);
      navigateRef.current("/login", { replace: true });
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}