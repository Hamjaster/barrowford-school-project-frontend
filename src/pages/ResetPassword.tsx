import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { PasswordInput } from "../components/ui/password-input";
import type { RootState } from "../store";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import supabase from "@/lib/supabse";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1); // remove the #
    const params = new URLSearchParams(hash);

    const access = params.get("access_token");
    const refresh = params.get("refresh_token");

    if (!access || !refresh) {
      toast.error("Invalid reset link. Please request a new password reset.");
      navigate("/forgot-password");
    }
    setAccessToken(access);
    setRefreshToken(refresh);
  }, []);

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

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!validateForm() || !accessToken || !refreshToken) {
      setIsLoadingResetPassword(false);
      return;
    }

    setIsLoadingResetPassword(true);
    e.preventDefault();

    try {
      // const result = await dispatch(
      //   resetPassword({
      //     accessToken,
      //     refreshToken,
      //     newPassword: formData.newPassword,
      //   })
      // );

      // if (resetPassword.fulfilled.match(result)) {
      //   setIsSubmitted(true);
      //   toast.success(result.payload.message);
      // } else if (resetPassword.rejected.match(result)) {
      //   toast.error(
      //     (result.payload as string) ||
      //       "Failed to reset password. Please try again."
      //   );
      // }
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      const { data, error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });
      if (error) {
        toast.error(error.message);
        setIsLoadingResetPassword(false);
      }
      if (data) {
        toast.success("Password reset successful");
        setIsSubmitted(true);
        setIsLoadingResetPassword(false);
      }
    } catch (error: any) {
      console.error("Password reset failed:", error);
      toast.error("Failed to reset password. Please try again.");
      setIsLoadingResetPassword(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Password reset successful
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully updated. You can now sign in
              with your new password.
            </p>
          </div>

          <div className="mt-8">
            <Link
              to="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set your new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* New Password Input */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.newPassword ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              loading={isLoadingResetPassword}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoadingResetPassword ? "Updating..." : "Update password"}
            </Button>

            <Link
              to="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
          </div>

          {/* Password Requirements */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Password Requirements:</strong>
            </p>
            <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
              <li>At least 6 characters long</li>
              <li>Both passwords must match</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
