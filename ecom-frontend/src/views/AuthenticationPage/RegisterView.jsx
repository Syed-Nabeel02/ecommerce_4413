/**
 * RegisterView.jsx
 * User registration page with optional address and payment card sections.
 * Supports collapsible sections for default address and payment card.
 * Uses react-hook-form for validation.
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaUserPlus, FaAddressCard, FaCreditCard } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../../components/ui/forms/TextInput';
import { useDispatch } from 'react-redux';
import { registerNewUser } from '../../store/actions';
import toast from 'react-hot-toast';
import CollapsiblePanel from '../../components/ui/forms/CollapsiblePanel';

const RegisterView = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showAddressSection, setShowAddressSection] = useState(false);
    const [showPaymentSection, setShowPaymentSection] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        mode: "onTouched",
    });

    const handleRegister = async (formData) => {
        dispatch(registerNewUser(formData, toast, reset, navigate, setIsLoading));
     };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md">

                {/* Form header */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <FaUserPlus className="text-slate-800 text-5xl"/>
                    <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
                        Register Here
                    </h1>
                </div>

                <hr className="mt-2 mb-5 text-black" />

                {/* Required fields */}
                <div className="flex flex-col gap-3">
                    <TextInput
                        label="UserName"
                        required
                        id="username"
                        type="text"
                        message="*UserName is required"
                        placeholder="Enter your username"
                        register={register}
                        errors={errors}
                    />

                    <TextInput
                        label="Email"
                        required
                        id="email"
                        type="email"
                        message="*Email is required"
                        placeholder="Enter your email"
                        register={register}
                        errors={errors}
                    />

                    <TextInput
                        label="Password"
                        required
                        id="password"
                        min={6}
                        type="password"
                        message="*Password is required"
                        placeholder="Enter your password"
                        register={register}
                        errors={errors}
                    />
                </div>

                {/* Optional Address Section - uses Headless UI Disclosure */}
                <CollapsiblePanel
                    title="Add Default Address"
                    icon={FaAddressCard}
                    isOpen={showAddressSection}
                    setIsOpen={setShowAddressSection}>
                    <div className="flex flex-col gap-3">
                        <TextInput
                            label="Building Name"
                            id="buildingName"
                            type="text"
                            placeholder="Enter building name"
                            register={register}
                            errors={errors}
                            required={showAddressSection}
                            message="*Building name is required"
                            min={5}
                        />
                        <TextInput
                            label="Street"
                            id="street"
                            type="text"
                            placeholder="Enter street"
                            register={register}
                            errors={errors}
                            required={showAddressSection}
                            message="*Street is required"
                            min={5}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                label="City"
                                id="city"
                                type="text"
                                placeholder="Enter city"
                                register={register}
                                errors={errors}
                                required={showAddressSection}
                                message="*City is required"
                                min={4}
                            />
                            <TextInput
                                label="State"
                                id="state"
                                type="text"
                                placeholder="Enter state"
                                register={register}
                                errors={errors}
                                required={showAddressSection}
                                message="*State is required"
                                min={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                label="Country"
                                id="country"
                                type="text"
                                placeholder="Enter country"
                                register={register}
                                errors={errors}
                                required={showAddressSection}
                                message="*Country is required"
                                min={2}
                            />
                            <TextInput
                                label="Postal Code"
                                id="pincode"
                                type="text"
                                placeholder="Enter postal code"
                                register={register}
                                errors={errors}
                                required={showAddressSection}
                                message="*Postal code is required (min 4 characters)"
                                min={4}
                            />
                        </div>
                    </div>
                </CollapsiblePanel>

                {/* Optional Payment Card Section */}
                <CollapsiblePanel
                    title="Add Default Payment Card"
                    icon={FaCreditCard}
                    isOpen={showPaymentSection}
                    setIsOpen={setShowPaymentSection}>
                    <div className="flex flex-col gap-3">
                        <TextInput
                            label="Card Number"
                            id="cardNumber"
                            type="text"
                            placeholder="Enter card number (13-19 digits)"
                            register={register}
                            errors={errors}
                            required={showPaymentSection}
                            message="*Card number is required (13-19 digits)"
                            pattern={{
                                value: /^[0-9]{13,19}$/,
                                message: "Card number must be 13-19 digits"
                            }}
                        />
                        <TextInput
                            label="Cardholder Name"
                            id="cardholderName"
                            type="text"
                            placeholder="Name on card"
                            register={register}
                            errors={errors}
                            required={showPaymentSection}
                            message="*Cardholder name is required"
                            min={2}
                        />
                        <div className="grid grid-cols-3 gap-3">
                            <TextInput
                                label="Expiry Month"
                                id="expiryMonth"
                                type="number"
                                placeholder="MM"
                                register={register}
                                errors={errors}
                                required={showPaymentSection}
                                message="*Month required (1-12)"
                                min={1}
                                max={12}
                            />
                            <TextInput
                                label="Expiry Year"
                                id="expiryYear"
                                type="number"
                                placeholder="YYYY"
                                register={register}
                                errors={errors}
                                required={showPaymentSection}
                                message="*Year must be 2024+"
                                validate={{
                                    minYear: (value) => !value || parseInt(value) >= 2024 || "Year must be 2024 or later"
                                }}
                            />
                            <TextInput
                                label="CVV"
                                id="cvv"
                                type="text"
                                placeholder="CVV"
                                register={register}
                                errors={errors}
                                required={showPaymentSection}
                                message="*CVV is required (3-4 digits)"
                                pattern={{
                                    value: /^[0-9]{3,4}$/,
                                    message: "CVV must be 3-4 digits"
                                }}
                            />
                        </div>
                    </div>
                </CollapsiblePanel>

                {/* Submit button */}
                <button
                    disabled={isLoading}
                    className="bg-button-gradient flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-xs my-3"
                    type="submit">
                    {isLoading ? "Loading..." : "Register"}
                </button>

                {/* Login link */}
                <p className="text-center text-sm text-slate-700 mt-6">
                  Already have an account?
                  <Link
                    className="font-semibold underline hover:text-black"
                    to="/login">
                  <span> Login</span></Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterView;
