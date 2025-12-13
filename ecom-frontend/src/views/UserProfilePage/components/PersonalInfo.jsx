/**
 * PersonalInfo.jsx
 *
 * Component for displaying and editing user personal information.
 * Allows users to update their display name (username).
 *
 * USED IN:
 * - ProfileView (User profile page)
 *
 * KEY FEATURES:
 * - Display user information (email is read-only, username is editable)
 * - Inline editing mode with edit/cancel buttons
 * - Form validation using react-hook-form
 * - Prevents unnecessary updates (checks if username actually changed)
 *
 * DEPENDENCIES:
 * - react-hook-form (form validation and state management)
 * - react-hot-toast (success/error/info notifications)
 *
 * @param {Object} user - User object containing email and username
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import TextInput from "../../../components/ui/forms/TextInput";
import { updateUserDisplayName } from "../../../store/actions";

const PersonalInfo = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const { btnLoader } = useSelector((state) => state.errors);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: user?.username || "",
    },
  });

  /**
   * Handle form submission to update username
   * Checks if username actually changed before making API call
   */
  const onSubmit = (data) => {
    // Prevent unnecessary API calls if username hasn't changed
    if (data.username === user?.username) {
      toast.info("Username is the same");
      setIsEditing(false);
      return;
    }

    // Dispatch action to update username in backend
    dispatch(updateUserDisplayName(data.username, toast, setIsEditing));
  };

  /**
   * Handle cancel button - reset form to original values and exit edit mode
   */
  const handleCancel = () => {
    reset({ username: user?.username });
    setIsEditing(false);
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username - Editable */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Username
          </label>
          {isEditing ? (
            <TextInput
              id="username"
              type="text"
              register={register}
              errors={errors}
              required
              min={3}
              message="*Username must be at least 3 characters"
              placeholder="Enter username"
            />
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-slate-800 font-medium">{user?.username}</p>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <FaEdit /> Edit
              </button>
            </div>
          )}
        </div>

        {/* Edit mode buttons */}
        {isEditing && (
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={btnLoader}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoader ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={btnLoader}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Email - Always read-only */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Email
          </label>
          <p className="text-slate-600">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
