import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { loginUser, clearError } from "../store/slices/authSlice";
import type { RootState, AppDispatch } from "../store";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<"email" | "username">("email");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Clear any previous errors when component mounts or login type changes
  React.useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [loginType, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (loginType === "email") {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const loginData =
      loginType === "email"
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, password: formData.password };

    try {
      const result = await dispatch(loginUser(loginData));

      if (loginUser.fulfilled.match(result)) {
        toast.success("Login successful!");
        navigate("/");
      } else if (loginUser.rejected.match(result)) {
        toast.error(
          (result.payload as string) || "Login failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to Nybble Bradford School
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md  space-y-4">
            {/* Login Type Toggle */}
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                type="button"
                variant={loginType === "email" ? "default" : "outline"}
                onClick={() => setLoginType("email")}
                className="px-4 py-2"
              >
                Email Login
              </Button>
              <Button
                type="button"
                variant={loginType === "username" ? "default" : "outline"}
                onClick={() => setLoginType("username")}
                className="px-4 py-2"
              >
                Student Login
              </Button>
            </div>

            {/* Email or Username Input */}
            <div>
              <label
                htmlFor={loginType}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {loginType === "email" ? "Email Address" : "Username"}
              </label>
              <Input
                id={loginType}
                name={loginType}
                type={loginType === "email" ? "email" : "text"}
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors[loginType] ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder={
                  loginType === "email"
                    ? "Enter your email"
                    : "Enter your username (e.g., john.doe)"
                }
                value={formData[loginType]}
                onChange={handleInputChange}
              />
              {errors[loginType] && (
                <p className="mt-1 text-sm text-red-600">{errors[loginType]}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Forgot Password Link */}
          {loginType === "email" && (
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          {/* Student Login Help */}
          {loginType === "username" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Students:</strong> Use your username in the format
                "firstname.lastname" (e.g., john.doe). If you don't know your
                username, please contact your teacher.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
