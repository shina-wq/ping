import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { LuTrendingUpDown } from "react-icons/lu";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api-error";
import { loginSchema } from "@/utils/loginSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";

import authGraphPath from "@/assets/auth-graph.png";

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Wait for session rehydration before deciding whether to redirect.
  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Already authenticated — send to dashboard.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginValues) => {
    try {
      setSubmitting(true);
      await login(data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // ApiError carries the server's message; fall back for unexpected errors.
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh overflow-hidden">
      {/* Left: form */}
      <div className="w-screen min-h-dvh md:w-[60vw] px-12 pt-8 pb-12">
        <div className="mb-10">
          <Logo />
        </div>

        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-foreground">Welcome Back</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-8">
            Please enter your details to log in
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="text"
                placeholder="johndoe@example.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="w-full uppercase tracking-widest"
            >
              Login
            </Button>
          </form>
        </div>
      </div>

      {/* Right: branding */}
      <div className="hidden md:block w-[42vw] min-h-dvh bg-primary/10 overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-brand-accent absolute -top-16 -left-5" />
        <div className="w-48 h-48 rounded-[40px] bg-primary/60 absolute -bottom-16 -right-5" />

        <div className="flex gap-6 bg-card p-4 rounded-xl shadow-md shadow-primary/10 border border-border relative z-10">
          <div className="w-12 h-12 flex items-center justify-center text-[26px] text-primary-foreground bg-primary rounded-full">
            <LuTrendingUpDown />
          </div>
          <div className="flex flex-col justify-center">
            <h6 className="text-sm text-muted-foreground">Track Your Grades & Assignments</h6>
            <p className="text-lg text-foreground">A+</p>
          </div>
        </div>

        <img
          src={authGraphPath}
          alt="Grade analytics"
          className="w-64 lg:w-[90%] absolute bottom-10 rounded-2xl"
        />
      </div>
    </div>
  );
}