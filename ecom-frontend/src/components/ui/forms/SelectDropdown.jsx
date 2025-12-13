/**
 * SelectDropdown.jsx
 *
 * DESCRIPTION:
 * A reusable dropdown select component for choosing from a list of options.
 * Provides a better user experience than native HTML select elements with
 * custom styling and smooth animations.
 *
 * USED IN:
 * - Product forms (selecting category)
 * - Product filters (filtering by category)
 * - Order management (updating order status)
 * - Any form that needs a dropdown selection
 *
 * KEY FEATURES:
 * - Custom styled dropdown (not native HTML select)
 * - Shows selected item with truncation for long text
 * - Dropdown menu with scrollable list
 * - Checkmark icon shows currently selected item
 * - Hover and focus states for better UX
 * - Smooth open/close animations
 * - Accessible keyboard navigation
 *
 * DEPENDENCIES:
 * - @headlessui/react (Listbox components for accessible dropdowns)
 * - react-icons/fa (FaCheck icon for selected item indicator)
 */

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";

/**
 * SelectDropdown Component
 *
 * @param {string} label - Text displayed above the dropdown
 * @param {Object} select - Currently selected item object
 * @param {function} setSelect - Function to update the selected item
 * @param {Array} lists - Array of option objects to choose from
 *
 * @example
 * const [selectedCategory, setSelectedCategory] = useState(null);
 * const categories = [
 *   { categoryId: 1, categoryName: "Electronics" },
 *   { categoryId: 2, categoryName: "Clothing" },
 *   { categoryId: 3, categoryName: "Books" }
 * ];
 *
 * <SelectDropdown
 *   label="Product Category"
 *   select={selectedCategory}
 *   setSelect={setSelectedCategory}
 *   lists={categories}
 * />
 */
const SelectDropdown = ({
    label,
    select,
    setSelect,
    lists
}) => {
    return (
        // Listbox component from Headless UI - manages dropdown state and accessibility
        // value and onChange props handle the selected state
        <Listbox value={select} onChange={setSelect}>

        {/* Container with vertical layout and spacing */}
        <div className="flex flex-col gap-2 w-full">

            {/* Label displayed above the dropdown */}
            <label
                htmlFor="id"
                className="font-semibold text-sm text-slate-800">
                {label}
            </label>

            {/* Relative positioning for dropdown menu positioning */}
            <div className="relative">

                {/* Button that shows current selection and triggers dropdown */}
                {/* When clicked, opens the dropdown menu below */}
                <ListboxButton
                className={`relative text-sm py-2 rounded-md border border-slate-700  w-full cursor-default  bg-white  text-left text-gray-600 sm:text-sm sm:leading-6`}>

                    {/* Display selected category name */}
                    {/* truncate class prevents long names from breaking layout */}
                    {/* ps-2 adds left padding (start padding) */}
                    <span className="block truncate ps-2">
                        {select?.categoryName}
                    </span>
                </ListboxButton>

                {/* Dropdown menu containing all options */}
                {/* absolute positioning places it below the button */}
                {/* z-10 ensures it appears above other content */}
                {/* max-h-60 limits height and enables scrolling for long lists */}
                <ListboxOptions
                    transition
                    className="absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-opacity-5 ring-black focus:outline-hidden">

                    {/* Loop through all available options */}
                    {/* Each category becomes a clickable option in the dropdown */}
                    {lists?.map((category) => (
                    <ListboxOption
                        key={category.categoryId}
                        value={category}
                        // data-focus adds hover/keyboard navigation styling
                        // Background turns indigo when hovered or focused
                        className="group relative cursor-default py-2 pl-3 pr-9 text-gray-900 data-focus:bg-indigo-600 data-focus:text-white">

                        {/* Category name text */}
                        {/* group-data-selected:font-semibold makes selected item bold */}
                        <span className="block truncate font-semibold group-data-selected:font-semibold">
                            {category.categoryName}
                        </span>

                        {/* Checkmark icon - only visible for the selected item */}
                        {/* [.group:not([data-selected])_&]:hidden hides it unless item is selected */}
                        {/* Positioned on the right side of the option */}
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-focus:text-white [.group:not([data-selected])_&]:hidden">
                            <FaCheck className="text-xl"/>
                        </span>

                    </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </div>
        </Listbox>
    );
};

export default SelectDropdown;
