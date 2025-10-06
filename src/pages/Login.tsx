import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { loginUser, clearError } from "../store/slices/authSlice";
import type { RootState, AppDispatch } from "../store";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<"email" | "username">("email");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);

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
          {/* <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        {/* Info Icon */}
          {/* <button
          type="button"
          onClick={() => setShowModal(true)}
          className="relative top-0 right-0 text-indigo-500 hover:text-indigo-700"
        >
          <AiOutlineInfoCircle size={24} />
        </button> */}
          <div className="flex items-center justify-start gap-2 mt-2 mb-4">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            {/* Info Icon */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-indigo-500 hover:text-indigo-700"
            >
              <InfoIcon size={24} color="black" />
            </button>
          </div>

          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to Nybble Bradford School
          </p>
        </div>
        {showModal && (
          <div className="fixed mt-5 inset-0 bg-white/70 backdrop-blur-sm p-4 rounded-lg bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-5 w-[650px]">
              <h3 className="text-lg font-bold mb-4 text-center">
                Test Credentials
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded p-2 w-[300px]">
                  <p className="font-semibold text-blue-600">Admin</p>
                  <p>
                    Email: <span className="font-mono">admin@school.com</span>
                  </p>
                  <p>
                    Password: <span className="font-mono">test12345</span>
                  </p>
                </div>
                <div className="border rounded p-2 w-[300px]">
                  <p className="font-semibold text-blue-600">Staff Admin</p>
                  <p>
                    Email:{" "}
                    <span className="font-mono">staffadmin@test.com</span>
                  </p>
                  <p>
                    Password: <span className="font-mono">test12345</span>
                  </p>
                </div>
                <div className="border rounded p-2 w-[300px]">
                  <p className="font-semibold text-blue-600">Teacher</p>
                  <p>
                    Email:{" "}
                    <span className="font-mono">
                      demouserdontchange@teacher.com
                    </span>
                  </p>
                  <p>
                    Password: <span className="font-mono">test1234</span>
                  </p>
                </div>
                <div className="border rounded p-2 w-[300px]">
                  <p className="font-semibold text-blue-600">Parent</p>
                  <p>
                    Email:{" "}
                    <span className="font-mono">
                      demouserdontchange@parent.com
                    </span>
                  </p>
                  <p>
                    Password: <span className="font-mono">test1234</span>
                  </p>
                </div>
                {/* Last one takes full width */}
                <div className="border rounded p-2 col-span-2 ">
                  <p className="font-semibold text-blue-600">Student</p>
                  <p>
                    Username:{" "}
                    <span className="font-mono">
                      demouserdontchange.student
                    </span>
                  </p>
                  <p>
                    Password: <span className="font-mono">test1234</span>
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setShowModal(false)}
                className="cursor-pointer w-full mt-6 bg-red-500 hover:bg-red-600 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md  space-y-4">
            {/* Login Type Toggle */}
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                type="button"
                variant={loginType === "email" ? "default" : "outline"}
                onClick={() => setLoginType("email")}
                className="px-4 py-2 cursor-pointer"
              >
                Email Login
              </Button>
              <Button
                type="button"
                variant={loginType === "username" ? "default" : "outline"}
                onClick={() => setLoginType("username")}
                className="px-4 py-2 cursor-pointer"
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
              loading={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 hover:from-indigo-600 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
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
