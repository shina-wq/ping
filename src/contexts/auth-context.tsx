import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  getSession,
  login as apiLogin,
  logout as apiLogout,
  clearToken,
} from "@/api/auth";
import type { AuthUser, LoginPayload } from "@/api/auth";

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Keep ref in sync after every render — avoids stale closure in event handlers
  const navigateRef = useRef(navigate);
  useLayoutEffect(() => {
    navigateRef.current = navigate;
  });

  // Session rehydration on app load
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const sessionUser = await getSession();
        if (!cancelled) setUser(sessionUser);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // Global 401 handler — dispatched from apiClient interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      navigateRef.current("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  // apiLogin already handles setToken internally
  const login = useCallback(async (payload: LoginPayload) => {
    const { user: loggedInUser } = await apiLogin(payload);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      clearToken();
      setUser(null);
      navigateRef.current("/login", { replace: true });
    }
  }, []);

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