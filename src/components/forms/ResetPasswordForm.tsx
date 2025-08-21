import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  resetUserPassword,
  clearError,
  clearSuccess,
} from "../../store/slices/userManagementSlice";
import type { RootState } from "../../store";

const ResetPasswordForm: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, error, resetPasswordSuccess } = useSelector(
    (state: RootState) => state.userManagement
  );

  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.new_password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.new_password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        resetUserPassword({
          email: formData.email,
          newPassword: formData.new_password,
        }) as any
      );
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

  React.useEffect(() => {
    if (resetPasswordSuccess) {
      toast.success("Password reset successfully!");
      setFormData({
        email: "",
        new_password: "",
        confirmPassword: "",
      });
      dispatch(clearSuccess());
    }
  }, [resetPasswordSuccess, dispatch]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Reset User Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            User Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter user's email address"
            required
          />
        </div>

        <div>
          <label
            htmlFor="new_password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <PasswordInput
            id="new_password"
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            placeholder="Enter new password"
            required
            minLength={6}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            required
            minLength={6}
          />
          <p className="text-sm text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
