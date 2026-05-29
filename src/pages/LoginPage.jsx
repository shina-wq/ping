import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { LuTrendingUpDown } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { validateEmail, validatePasswordLength } from "@/utils/helper";
import authGraph from "@/assets/auth-graph.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
    }

    if (!validatePasswordLength(password)) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);

    // TODO: wire up API call here
    navigate("/dashboard");
  };

  return (
    <div className="flex">
      {/* Left: form */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <h2 className="text-lg font-medium text-black">Ping</h2>
        </div>

        {/* Form */}
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
          <p className="text-[13px] text-slate-700 mt-3.75 mb-6">
            Please enter your details to log in
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="text"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="min 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full uppercase tracking-widest bg-indigo-600 hover:bg-indigo-400 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right: branding */}
      <div className="hidden md:block w-[42vw] h-screen bg-indigo-50 overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-sky-800 absolute -top-16 -left-5" />
        <div className="w-48 h-48 rounded-[40px] bg-indigo-400 absolute -bottom-16 -right-5" />

        <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-indigo-400/10 border border-gray-200/50 relative z-10">
          <div className="w-12 h-12 flex items-center justify-center text-[26px] text-white bg-indigo-600 rounded-full">
            <LuTrendingUpDown />
          </div>
          <div className="flex flex-col justify-center">
            <h6 className="text-[13px] text-gray-500">Track Your Grades & Assignments</h6>
            <p className="text-lg text-gray-700">A+</p>
          </div>
        </div>

        <img
          src={authGraph}
          alt="Grade analytics"
          className="w-64 lg:w-[90%] absolute bottom-10 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default Login;