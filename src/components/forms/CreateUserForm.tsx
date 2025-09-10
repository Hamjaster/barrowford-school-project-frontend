import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import MultiSelect from "@/components/ui/multi-select";
import {
  createUser,
  clearError,
  clearSuccess,
  fetchParents,
} from "@/store/slices/userManagementSlice";
import type { RootState } from "@/store";
import type { CreateUserFormData, UserRole } from "@/types";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateUsername,
} from "@/lib/utils";
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
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    role: allowedRoles[0] || "student",
    parent_ids: [],
    year_group_id: 1,
    class_id: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Clear parent_ids if role is changed from student to something else
      if (name === "role" && value !== "student") {
        newFormData.parent_ids = [];
      }

      // Clear username/email when switching roles
      if (name === "role") {
        if (value === "student") {
          newFormData.email = "";
        } else {
          newFormData.username = "";
        }
      }

      return newFormData;
    });
  };

  const handleParentSelection = (selectedParentIds: (string | number)[]) => {
    setFormData((prev) => ({
      ...prev,
      parent_ids: selectedParentIds.map((id) => Number(id)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const passwordValidation = validatePassword(formData.password);
    const firstNameValidation = validateName(formData.first_name, "First name");
    const lastNameValidation = validateName(formData.last_name, "Last name");

    // Validate email or username based on role
    if (formData.role === "student") {
      const usernameValidation = validateUsername(formData.username || "");
      if (!usernameValidation.isValid) {
        toast.error(usernameValidation.error);
        return;
      }
    } else {
      const emailValidation = validateEmail(formData.email || "");
      if (!emailValidation.isValid) {
        toast.error(emailValidation.error);
        return;
      }
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
    if (
      formData.role === "student" &&
      (!formData.parent_ids || formData.parent_ids.length === 0)
    ) {
      toast.error("Please select at least one parent for the student");
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
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        role: allowedRoles[0] || "student",
        parent_ids: [],
        year_group_id: 1,
        class_id: 1,
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

        {formData.role === "student" ? (
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username || ""}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Students use username instead of email for login
            </p>
          </div>
        ) : (
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
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </div>
        )}

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            required
          >
            {allowedRoles.map((role) => (
              <option key={role} value={role} className="cursor-pointer">
                {ROLEWISE_INFORMATION[role].displayName}
              </option>
            ))}
          </select>
        </div>

        {formData.role === "student" && (
          <div>
            <label
              htmlFor="parent_ids"
              className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
            >
              Select Parents
            </label>
            <MultiSelect
              options={parents.map((parent) => ({
                value: Number(parent.id),
                label: `${parent.first_name} ${parent.last_name} (${parent.email})`,
              }))}
              value={formData.parent_ids || []}
              onChange={handleParentSelection}
              placeholder="Select parents..."
              className="w-full"
            />
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
            disabled={
              isLoading ||
              !formData.first_name ||
              !formData.password ||
              !formData.role
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {isLoading ? "Creating User..." : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
