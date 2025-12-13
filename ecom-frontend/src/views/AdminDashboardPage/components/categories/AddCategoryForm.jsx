/**
 * AddCategoryForm.jsx
 *
 * Form component for creating new categories or updating existing ones in the admin dashboard.
 * Simpler than AddProductForm - only requires category name field.
 *
 * USED IN:
 * - CategoryManagementView (Admin dashboard)
 *
 * KEY FEATURES:
 * - Dual mode: Create new categories or update existing ones
 * - Single field form (category name only)
 * - Form validation using react-hook-form
 * - Auto-population when editing
 *
 * DEPENDENCIES:
 * - react-hook-form (form validation and state management)
 * - react-hot-toast (success/error notifications)
 *
 * @param {Function} setOpen - Callback to close the modal
 * @param {boolean} open - Loading state (used to disable buttons)
 * @param {Object} category - Category data when in update mode
 * @param {boolean} update - Flag indicating edit mode vs create mode
 */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  addNewCategoryDashboard,
  modifyDashboardCategory,
} from "../../../../store/actions";
import TextInput from "../../../../components/ui/forms/TextInput";

const AddCategoryForm = ({ setOpen, open, category, update = false }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  /**
   * Handle form submission for creating or updating a category
   * - CREATE mode: Dispatch action to add new category
   * - UPDATE mode: Dispatch action to modify existing category using category.id
   */
  const addNewCategoryHandler = (data) => {
    if (!update) {
      // CREATE MODE: Add new category to the database
      dispatch(addNewCategoryDashboard(data, setOpen, reset, toast));
    } else {
      // UPDATE MODE: Modify existing category identified by category.id
      dispatch(
        modifyDashboardCategory(data, setOpen, category.id, reset, toast)
      );
    }
  };

  // EFFECT: Pre-populate category name field when editing
  // This runs when component loads in UPDATE mode
  useEffect(() => {
    if (update && category) {
      setValue("categoryName", category?.categoryName);
    }
  }, [update, category]);

  return (
    <div className="py-5 relative h-full ">
      <form
        className="space-y-4 "
        onSubmit={handleSubmit(addNewCategoryHandler)}
      >
        <div className="flex md:flex-row flex-col gap-4 w-full ">
          <TextInput
            label="Category Name"
            required
            id="categoryName"
            type="text"
            message="This field is required*"
            placeholder="Category Name"
            register={register}
            errors={errors}
          />
        </div>

        <div className="flex  w-full justify-between items-center absolute bottom-14">
          <button
            disabled={open}
            onClick={() => setOpen(false)}
            type="button"
            className={`border border-borderColor rounded-[5px] font-metropolis  text-textColor py-[10px] px-4 text-sm font-medium`}
          >
            Cancel
          </button>
          <button
            disabled={open}
            type="submit"
            className={`font-metropolis rounded-[5px]  bg-custom-blue hover:bg-blue-800 text-white  py-[10px] px-4 text-sm font-medium`}
          >
            {open ? "Loading.." : update ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;