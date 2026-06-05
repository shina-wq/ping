import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  setToken,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Session rehydration on app load
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const sessionUser = await getSession();

        if (!cancelled) {
          setUser(sessionUser);
        }
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

  // Global unauthorized handler (401)
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    const handleUnauthorized = () => {
      clearToken();
      setUser(null);
      navigateRef.current("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // Login
  const login = useCallback(async (payload: LoginPayload) => {
    const { user: loggedInUser, token } = await apiLogin(payload);

    setToken(token);
    setUser(loggedInUser);
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      clearToken();
      setUser(null);
      navigateRef.current("/login", { replace: true });
    }
  }, []);

  // Context value
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}