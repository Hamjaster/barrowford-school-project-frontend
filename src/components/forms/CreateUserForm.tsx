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
import { uploadFileToSupabase } from "@/utils/fileUpload";

import type { RootState } from "@/store";
import type { CreateUserFormData, UserRole } from "@/types";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateUsername,
} from "@/lib/utils";
import { ROLEWISE_INFORMATION } from "@/constants";
import { Image } from "lucide-react";

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
    profile_image: null,
  });




  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      if (name === "role" && value !== "student") {
        newFormData.parent_ids = [];
      }

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_image: file }));

    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Basic field validations
    const passwordValidation = validatePassword(formData.password);
    const firstNameValidation = validateName(formData.first_name, "First name");
    const lastNameValidation = validateName(formData.last_name, "Last name");

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

    // ✅ Student-specific checks
    if (
      formData.role === "student" &&
      (!formData.parent_ids || formData.parent_ids.length === 0)
    ) {
      toast.error("Please select at least one parent for the student");
      return;
    }

    // 📤 Upload image to Cloudinary first (if student + image exists)
    let imageUrl = "";
    if (formData.role === "student" && formData.profile_image) {
      toast.info("Uploading profile image...");

      try {
        const userId = formData.username || "unknown_user";
        const uploadResult = await uploadFileToSupabase(
          formData.profile_image,
          "barrowford-school-uploads",
          userId
        );

        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          toast.success("Profile image uploaded!");
        } else {
          toast.error(uploadResult.error || "Image upload failed. Please try again.");
          return;
        }
      } catch (err) {
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }


    // ✅ Prepare final payload
    const payload = {
      ...formData,
      profile_photo: imageUrl || null,
    };

    try {
      const result = await dispatch(createUser(payload) as any);
      console.log(result, "result");
    } catch (err) {
      // error handled in slice
    }
  };

  // 📦 Load parents when component mounts
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
        profile_image: null,
      });

      dispatch(clearSuccess());
      return;
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
          <>
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
            <div>
              <label
                htmlFor="profile_image"
                className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
              >
                Upload Profile Image
              </label>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="profile_image"
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition text-center"
                >
                  <Image className="w-8 h-8 text-gray-400 mb-2" />

                  {formData.profile_image ? (
                    <span className="text-sm text-green-600 font-medium">
                      📁 {formData.profile_image.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600">
                      Click to upload image
                    </span>
                  )}

                  <input
                    type="file"
                    id="profile_image"
                    name="profile_image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>


            </div>

          </>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={
              !formData.first_name || !formData.password || !formData.role
            }
            loading={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
