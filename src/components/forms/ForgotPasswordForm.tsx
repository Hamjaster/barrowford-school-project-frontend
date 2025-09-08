import React, { useState, useEffect } from "react";
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
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const startCooldown = () => {
    setIsOnCooldown(true);
    setCooldownTime(20);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user is logged in, use their email automatically
    const emailToUse = user?.email || email;

    const data = await dispatch(forgotPassword({ email: emailToUse }) as any);
    console.log(data, "DATA");
    if (!data.error) {
      startCooldown(); // Start the 20-second cooldown
      toast.success(
        data.payload.message || "Password reset instructions sent to your email"
      );
    } else {
      console.log(data, "failed to send reset email");
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOnCooldown && cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
    } else if (cooldownTime === 0 && isOnCooldown) {
      setIsOnCooldown(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOnCooldown, cooldownTime]);

  // Error handling effect
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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
          {isOnCooldown && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">
                ⏳ Please wait <strong>{cooldownTime} seconds</strong> before
                requesting another password reset.
              </p>
            </div>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isOnCooldown}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Sending Instructions..."
              : isOnCooldown
              ? `Request Password Reset`
              : "Request Password Reset"}
          </Button>
        </div>
      ) : (
        // Not logged in - show email input form
        <div>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
          {isOnCooldown && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">
                ⏳ Please wait <strong>{cooldownTime} seconds</strong> before
                requesting another password reset.
              </p>
            </div>
          )}
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
                disabled={isLoading || isOnCooldown}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Sending Instructions..."
                  : isOnCooldown
                  ? `Wait ${cooldownTime}s to request again`
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
