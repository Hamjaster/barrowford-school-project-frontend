import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword, clearError } from "../../store/slices/authSlice";
import type { RootState } from "../../store";

const ForgotPasswordForm: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user is logged in, use their email automatically
    const emailToUse = user?.email || email;

    if (!emailToUse) {
      toast.error("Email address is required");
      return;
    }

    if (!emailToUse.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await dispatch(forgotPassword({ email: emailToUse }) as any);
      setSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (err) {
      // Error handling is done in the slice
    }
  };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-4">
            We've sent password reset instructions to{" "}
            <strong>{user?.email || email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Reset Your Password
      </h2>
      {user ? (
        // Logged in user - simplified form
        <div>
          <p className="text-gray-600 mb-6">
            Click the button below to request a password reset for your account:{" "}
            <strong>{user.email}</strong>
          </p>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Sending Instructions..." : "Request Password Reset"}
          </Button>
        </div>
      ) : (
        // Not logged in - show email input form
        <div>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading
                  ? "Sending Instructions..."
                  : "Request Password Reset"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
