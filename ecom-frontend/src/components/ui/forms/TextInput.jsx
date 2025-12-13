/**
 * TextInput.jsx
 *
 * DESCRIPTION:
 * A reusable text input component with built-in validation and error display.
 * Integrates with React Hook Form for form state management and validation.
 * Supports various input types: text, email, password, number, url, etc.
 *
 * USED IN:
 * - Login and Registration forms
 * - Product forms (admin)
 * - Category forms (admin)
 * - Address forms (checkout and profile)
 * - Payment card forms (checkout and profile)
 * - All forms throughout the application
 *
 * KEY FEATURES:
 * - Label and input field combined in one component
 * - Automatic validation (required, minLength, email format, etc.)
 * - Error message display below input
 * - Red border when validation fails
 * - Support for text, number, email, url, and password inputs
 * - Customizable styling via className prop
 * - Pattern matching for custom validation
 *
 * DEPENDENCIES:
 * - react-hook-form (form validation and state management)
 */

/**
 * TextInput Component
 *
 * @param {string} label - Text displayed above the input field
 * @param {string} id - Unique identifier for the input (also used as the name in form data)
 * @param {string} type - Input type (text, email, password, number, url, etc.)
 * @param {Object} errors - Errors object from React Hook Form (contains validation errors)
 * @param {function} register - Register function from React Hook Form (connects input to form)
 * @param {boolean} required - Whether this field is required (true/false)
 * @param {string} message - Error message to show when required validation fails
 * @param {string} className - Additional CSS classes to apply (optional)
 * @param {number} min - Minimum length for text or minimum value for numbers (optional)
 * @param {number} max - Maximum value for number inputs (optional)
 * @param {string} value - Controlled value for the input (optional)
 * @param {string} placeholder - Placeholder text shown when input is empty
 * @param {Object} pattern - Custom regex pattern for validation (optional)
 * @param {function} validate - Custom validation function (optional)
 *
 * @example
 * // Basic text input
 * <TextInput
 *   label="Product Name"
 *   id="productName"
 *   type="text"
 *   errors={errors}
 *   register={register}
 *   required={true}
 *   message="Product name is required"
 *   placeholder="Enter product name"
 * />
 *
 * @example
 * // Email input with automatic email validation
 * <TextInput
 *   label="Email Address"
 *   id="email"
 *   type="email"
 *   errors={errors}
 *   register={register}
 *   required={true}
 *   message="Email is required"
 * />
 *
 * @example
 * // Number input with min/max constraints
 * <TextInput
 *   label="Price"
 *   id="price"
 *   type="number"
 *   min={0}
 *   max={10000}
 *   errors={errors}
 *   register={register}
 *   required={true}
 *   message="Price is required"
 * />
 */
const TextInput = ({
    label,
    id,
    type,
    errors,
    register,
    required,
    message,
    className,
    min,
    max,
    value,
    placeholder,
    pattern,
    validate,
}) => {
    return (
        // Container div with vertical layout and spacing
        <div className="flex flex-col gap-1 w-full">

            {/* Label element - displays field name above input */}
            <label
                htmlFor="id"
                className={`${
                    className ? className : ""
                } font-semibold text-sm text-slate-800`}>
                {label}
            </label>

            {/* Input field - Register with React Hook Form using spread operator */}
            {/* Border color changes to red if there's an error for this field */}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className={`${
                    className ? className : ""
                } px-2 py-2 border outline-hidden bg-transparent text-slate-800 rounded-md ${
                    errors[id]?.message ? "border-red-500" : "border-slate-700"
                }`}
                {...register(id, {
                    // Required field validation
                    // If required is true and field is empty, show the message
                    required: {value: required, message},

                    // Minimum length validation (for text inputs)
                    // Example: minimum 8 characters for passwords
                    minLength: min
                        ? { value: min, message: `Minimum ${min} character is required`}
                        : undefined,

                    // Minimum value validation (for number inputs)
                    // Example: price cannot be negative
                    min: (type === "number" && min !== undefined)
                        ? { value: min, message: `Minimum value is ${min}` }
                        : undefined,

                    // Maximum value validation (for number inputs)
                    // Example: quantity cannot exceed stock
                    max: (type === "number" && max !== undefined)
                        ? { value: max, message: `Maximum value is ${max}` }
                        : undefined,

                    // Pattern validation using regex
                    // Built-in patterns for email and url types
                    // Custom patterns can be passed via pattern prop
                    pattern: pattern || (
                        type === "email"
                            ? {
                                // Email validation regex
                                // Checks for format: username@domain.com
                                value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                                message: "Invalid email"
                            }
                            : type === "url"
                            ? {
                                // URL validation regex
                                // Accepts http://, https://, or no protocol
                                value: /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                                message: "Please enter a valid url"
                            }
                            : undefined
                    ),

                    // Custom validation function
                    // Useful for complex validation like password confirmation matching
                    validate: validate || undefined,
                })}
                />

                {/* Error message display */}
                {/* Only shows if there's an error for this specific input */}
                {/* errors[id]?.message contains the error text (from message prop or validation) */}
                {errors[id]?.message && (
                    <p className="text-sm font-semibold text-red-600 mt-0">
                        {errors[id]?.message}
                    </p>
                )}
        </div>
    );
};

export default TextInput;
