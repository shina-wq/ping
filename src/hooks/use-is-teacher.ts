import { useAuth } from "@/contexts/auth-context";

// To centralizes the teacher role check so gating logic isn't duplicated across pages
export function useIsTeacher(): boolean {
  const { user } = useAuth();
  return user?.role === "teacher";
}