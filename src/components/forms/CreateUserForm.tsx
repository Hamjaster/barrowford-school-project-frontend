import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  createUser,
  clearError,
  clearSuccess,
  fetchParents,
} from "@/store/slices/userManagementSlice";
import type { RootState } from "@/store";
import type { CreateUserFormData, UserRole } from "@/types";
import { validateEmail, validatePassword, validateName } from "@/lib/utils";
import { ROLEWISE_INFORMATION } from "@/constants";

interface CreateUserFormProps {
  allowedRoles: UserRole[];
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { isLoading, error, createUserSuccess, successMessage, parents } =
    useSelector((state: RootState) => state.userManagement);

  const [formData, setFormData] = useState<CreateUserFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: allowedRoles[0] || "student",
    parent_id: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Clear parent_id if role is changed from student to something else
      if (name === "role" && value !== "student") {
        newFormData.parent_id = "";
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const firstNameValidation = validateName(formData.first_name, "First name");
    const lastNameValidation = validateName(formData.last_name, "Last name");

    if (!emailValidation.isValid) {
      toast.error(emailValidation.error);
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.error);
      return;
    }

    if (!firstNameValidation.isValid) {
      toast.error(firstNameValidation.error);
      return;
    }

    if (!lastNameValidation.isValid) {
      toast.error(lastNameValidation.error);
      return;
    }

    // Validate parent selection for student role
    if (formData.role === "student" && !formData.parent_id) {
      toast.error("Please select a parent for the student");
      return;
    }

    try {
      const result = await dispatch(createUser(formData) as any);
      console.log(result, "result");
    } catch (err) {
      // Error handling is done in the slice
    }
  };

  // Fetch parents when component mounts
  React.useEffect(() => {
    dispatch(fetchParents() as any);
  }, [dispatch]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch, successMessage]);

  React.useEffect(() => {
    if (createUserSuccess) {
      toast.success(successMessage || "User created successfully!");
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: allowedRoles[0] || "student",
        parent_id: "",
      });
      dispatch(clearSuccess());
    }
  }, [createUserSuccess, dispatch, allowedRoles, successMessage]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name
            </label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name
            </label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

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
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
            minLength={6}
          />
          <p className="text-sm text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {allowedRoles.map((role) => (
              <option key={role} value={role}>
                {ROLEWISE_INFORMATION[role].displayName}
              </option>
            ))}
          </select>
        </div>

        {formData.role === "student" && (
          <div>
            <label
              htmlFor="parent_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Parent
            </label>
            <select
              id="parent_id"
              name="parent_id"
              value={formData.parent_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a parent...</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.first_name} {parent.last_name} ({parent.email})
                </option>
              ))}
            </select>
            {parents.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No parents available. Please create a parent user first.
              </p>
            )}
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Creating User..." : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
