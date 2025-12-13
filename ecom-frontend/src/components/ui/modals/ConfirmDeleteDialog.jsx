/**
 * ConfirmDeleteDialog.jsx
 *
 * DESCRIPTION:
 * A unified confirmation dialog for delete operations throughout the application.
 * This replaces the duplicate ConfirmDeleteDialog components that existed in different folders.
 * Shows a warning icon and asks user to confirm before deleting.
 *
 * USED IN:
 * - Admin product management (delete products)
 * - Admin category management (delete categories)
 * - Cart (remove cart items)
 * - Checkout (delete saved addresses and payment cards)
 * - User profile (delete addresses and payment methods)
 *
 * KEY FEATURES:
 * - Warning icon with red background for visual emphasis
 * - Customizable title (e.g., "Delete Product", "Remove Address")
 * - Delete and Cancel buttons
 * - Loading state during deletion
 * - Close button in top-right corner
 * - Centered modal with backdrop overlay
 * - Smooth fade-in/fade-out animations
 *
 * DEPENDENCIES:
 * - @headlessui/react (accessible dialog components)
 * - react-icons/fa (warning triangle and close icons)
 */

import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

/**
 * ConfirmDeleteDialog Component
 *
 * @param {boolean} open - Controls dialog visibility (true = shown, false = hidden)
 * @param {function} setOpen - Function to close the dialog (sets open to false)
 * @param {string} title - Title text for the dialog (e.g., "Delete Product")
 * @param {function} onDeleteHandler - Function to execute when user confirms deletion
 * @param {boolean} loader - Whether deletion is in progress (shows "Loading..." text)
 *
 * @example
 * const [showDeleteDialog, setShowDeleteDialog] = useState(false);
 *
 * const handleDelete = () => {
 *   // Delete logic here
 *   console.log("Deleting item...");
 * };
 *
 * <ConfirmDeleteDialog
 *   open={showDeleteDialog}
 *   setOpen={setShowDeleteDialog}
 *   title="Delete Product"
 *   onDeleteHandler={handleDelete}
 *   loader={isDeleting}
 * />
 */
export const ConfirmDeleteDialog = ({
  open,
  setOpen,
  title,
  onDeleteHandler,
  loader,
}) => {
  return (
    // Dialog component manages focus, keyboard navigation (ESC to close), and click-outside-to-close
    // z-50 ensures this appears above other content
    <Dialog open={open} onClose={setOpen} className="relative z-50">

      {/* Backdrop - semi-transparent dark overlay */}
      {/* data-[closed]:opacity-0 makes it fade out when closing */}
      {/* Transition timing: 300ms to appear, 200ms to disappear */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      {/* Fixed positioning container that covers the entire screen */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">

        {/* Flexbox centering - works for both mobile and desktop */}
        {/* items-end on mobile (bottom aligned), items-center on desktop (vertically centered) */}
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

          {/* The actual dialog panel */}
          {/* Slides up from bottom on mobile, scales up on desktop */}
          {/* max-w-lg limits width to keep dialog compact */}
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {/* Close button in top-right corner */}
            {/* Only visible on desktop (sm:block), hidden on mobile */}
            {/* Disabled while loading to prevent closing during deletion */}
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                disabled={loader}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {/* Screen reader text for accessibility */}
                <span className="sr-only">Close</span>
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {/* Content section with icon and text */}
            <div className="sm:flex sm:items-start">

              {/* Warning icon container */}
              {/* Circular background with red color to draw attention */}
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaExclamationTriangle className=" text-red-600" />
              </div>

              {/* Text content */}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                {/* Dialog title - displays what's being deleted */}
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold font-metropolis leading-6 text-textColor"
                >
                  {title}
                </DialogTitle>

                {/* Confirmation message */}
                <div className="mt-2">
                  <p className="text-sm text-textColor2 font-metropolis">
                    Are you sure you want to delete? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons section */}
            {/* On mobile: stacked vertically, On desktop: side by side in reverse order */}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">

              {/* Delete button (appears on right on desktop) */}
              {/* Disabled while loading to prevent multiple deletions */}
              {/* Shows "Loading..." text when deletion is in progress */}
              <button
                disabled={loader}
                type="button"
                onClick={onDeleteHandler}
                className="inline-flex w-full bg-customRed justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                {loader ? "Loading..." : "Delete"}
              </button>

              {/* Cancel button (appears on left on desktop) */}
              {/* Also disabled while loading for consistency */}
              <button
                disabled={loader}
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
