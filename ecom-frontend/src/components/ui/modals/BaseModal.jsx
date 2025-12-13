/**
 * BaseModal.jsx
 *
 * DESCRIPTION:
 * A reusable base modal component for displaying content in a slide-out panel.
 * This modal slides in from the right side of the screen and includes a backdrop overlay.
 *
 * USED IN:
 * - Product form dialogs
 * - Category form dialogs
 * - Address and payment forms
 * - Any component that needs to display content in a modal
 *
 * KEY FEATURES:
 * - Slides in from the right side of screen
 * - Dark backdrop overlay when open
 * - Close button with X icon
 * - Smooth animations (500ms transition)
 * - Scrollable content area
 * - Responsive design (adjusts width on mobile)
 *
 * DEPENDENCIES:
 * - @headlessui/react (accessible modal components with built-in animations)
 * - react-icons/rx (RxCross1 icon for close button)
 */

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { RxCross1 } from 'react-icons/rx';

/**
 * BaseModal Component
 *
 * @param {boolean} open - Controls whether the modal is visible
 * @param {function} setOpen - Function to update the open state (typically sets to false to close)
 * @param {ReactNode} children - Content to display inside the modal
 * @param {string} title - Title text displayed at the top of the modal (default: empty string)
 *
 * @example
 * const [isModalOpen, setIsModalOpen] = useState(false);
 *
 * <BaseModal
 *   open={isModalOpen}
 *   setOpen={setIsModalOpen}
 *   title="Add New Product"
 * >
 *   <ProductForm />
 * </BaseModal>
 */
function BaseModal({ open, setOpen, children, title = "" }) {
  return (
    <>
      {/* Dialog component from Headless UI - manages modal state and accessibility */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">

        {/* Backdrop - dark overlay behind the modal */}
        {/* Covers entire screen and fades in/out based on modal state */}
        <DialogBackdrop
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        {/* Container for the modal panel - covers full screen */}
        <div className="fixed inset-0 overflow-hidden">
          <div className='absolute inset-0 overflow-hidden'>

            {/* Positioning wrapper - aligns modal to the right side */}
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>

              {/* The actual modal panel that slides in from right */}
              {/* max-w-[800px] limits panel width to 800 pixels */}
              {/* data-closed:translate-x-full makes it slide off-screen when closing */}
              <DialogPanel
                transition
                className='pointer-events-auto relative w-screen max-w-[800px] transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700'
              >
                {/* Inner container - white background with shadow */}
                {/* overflow-y-scroll allows content to scroll if too long */}
                <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>

                  {/* Header section (currently hidden but available for future use) */}
                  <div className='px-4 sm:px-6'>
                    <DialogTitle className='text-base font-semibold leading-6 text-gray-900'>
                      Panel Title
                    </DialogTitle>
                  </div>

                  {/* Main content area */}
                  <div className='relative mt-6 flex-1 p-8'>

                    {/* Title bar with close button */}
                    {/* border-b creates bottom border, pb-8 adds padding below */}
                    <div className='border-b pb-8 flex justify-between'>

                      {/* Modal title text */}
                      <h1 className='font-montserrat font-bold text-slate-800 text-2xl pt-4'>
                        {title}
                      </h1>

                      {/* Close button - clicking sets open to false */}
                      <button onClick={() => setOpen(false)}>
                        <RxCross1 className='text-slate-800 text-2xl'/>
                      </button>
                    </div>

                    {/* Children content - this is where form fields, text, etc. will appear */}
                    {children}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}


export default BaseModal;
