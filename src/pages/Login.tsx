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
import schoolLogo from "../assets/barrowforrdlogo.png";

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
      const result = await dispatch(loginUser(loginData) as any);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <img
                src={schoolLogo}
                alt="Barrowford Primary School"
                className="w-44 h-24 object-contain"
              />
            </div>

            <p className="text-sm text-gray-600 text-center">
              Welcome to Barrowford School Portal
            </p>
          </div>

          {/* Header with Info Icon */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="Test Credentials"
            >
              <InfoIcon size={20} />
            </button>
          </div>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                  Test Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <p className="font-semibold text-blue-600 mb-2">Admin</p>
                    <p className="text-sm text-gray-700">
                      Email:{" "}
                      <span className="font-mono text-gray-900">
                        admin@school.com
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Password:{" "}
                      <span className="font-mono text-gray-900">test12345</span>
                    </p>
                  </div>
                  <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <p className="font-semibold text-indigo-600 mb-2">
                      Staff Admin
                    </p>
                    <p className="text-sm text-gray-700">
                      Email:{" "}
                      <span className="font-mono text-gray-900">
                        staffadmin@test.com
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Password:{" "}
                      <span className="font-mono text-gray-900">test12345</span>
                    </p>
                  </div>
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 hover:bg-purple-100 transition-colors">
                    <p className="font-semibold text-purple-600 mb-2">
                      Teacher
                    </p>
                    <p className="text-sm text-gray-700">
                      Email:{" "}
                      <span className="font-mono text-gray-900">
                        demouserdontchange@teacher.com
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Password:{" "}
                      <span className="font-mono text-gray-900">test1234</span>
                    </p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors">
                    <p className="font-semibold text-green-600 mb-2">Parent</p>
                    <p className="text-sm text-gray-700">
                      Email:{" "}
                      <span className="font-mono text-gray-900">
                        demouserdontchange@parent.com
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Password:{" "}
                      <span className="font-mono text-gray-900">test1234</span>
                    </p>
                  </div>
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 hover:bg-orange-100 transition-colors md:col-span-2">
                    <p className="font-semibold text-orange-600 mb-2">
                      Student
                    </p>
                    <p className="text-sm text-gray-700">
                      Username:{" "}
                      <span className="font-mono text-gray-900">
                        demouserdontchange.student
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Password:{" "}
                      <span className="font-mono text-gray-900">test1234</span>
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              {/* Login Type Toggle */}
              <div className="flex justify-center space-x-4 mb-6">
                <Button
                  type="button"
                  variant={loginType === "email" ? "default" : "outline"}
                  onClick={() => setLoginType("email")}
                  className={`px-6 py-2 cursor-pointer transition-all font-semibold ${
                    loginType === "email"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "border-2 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Email Login
                </Button>
                <Button
                  type="button"
                  variant={loginType === "username" ? "default" : "outline"}
                  onClick={() => setLoginType("username")}
                  className={`px-6 py-2 cursor-pointer transition-all font-semibold ${
                    loginType === "username"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "border-2 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Student Login
                </Button>
              </div>

              {/* Email or Username Input */}
              <div>
                <label
                  htmlFor={loginType}
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {loginType === "email" ? "Email Address" : "Username"}
                </label>
                <Input
                  id={loginType}
                  name={loginType}
                  type={loginType === "email" ? "email" : "text"}
                  required
                  className={`appearance-none rounded-lg relative block w-full px-4 py-3 border-2 ${
                    errors[loginType]
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all`}
                  placeholder={
                    loginType === "email"
                      ? "Enter your email"
                      : "Enter your username (e.g., john.doe)"
                  }
                  value={formData[loginType]}
                  onChange={handleInputChange}
                />
                {errors[loginType] && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors[loginType]}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  required
                  className={`appearance-none rounded-lg relative block w-full px-4 py-3 border-2 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot Password Link */}
            {loginType === "email" && (
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
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
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            {/* Student Login Help */}
            {loginType === "username" && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium">
                  <strong>💡 Students:</strong> Use your username in the format
                  "firstname.lastname" (e.g., john.doe). If you don't know your
                  username, please contact your teacher.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
