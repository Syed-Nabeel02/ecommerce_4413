/**
 * CheckoutView.jsx
 * Multi-step checkout process with address, payment, and order summary.
 * Uses custom stepper component instead of MUI.
 */

import React, { useEffect, useState } from 'react';
import CheckoutStepper from './components/CheckoutStepper';
import AddressSelector from './components/ShippingAddress/AddressSelector';
import PaymentMethodPicker from './components/PaymentSection/PaymentMethodPicker';
import OrderSummaryPanel from './components/OrderSummaryPanel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAddressList, submitUserOrder } from '../../store/actions';
import toast from 'react-hot-toast';
import ErrorDisplay from '../../components/ui/feedback/ErrorDisplay';
import { useNavigate } from 'react-router-dom';

const CheckoutView = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { items, totalAmount } = useSelector((state) => state.cart);
    const { userAddresses, checkoutAddress } = useSelector((state) => state.authentication);
    const { selectedPaymentMethod, selectedPaymentCard, newCardDetails } = useSelector(
        (state) => state.payment
    );

    const handleGoBack = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleProceed = () => {
        // Step 0: Validate address selected
        if(currentStep === 0 && !checkoutAddress) {
            toast.error("Please select checkout address before proceeding.");
            return;
        }

        // Step 1: Validate payment method
        if(currentStep === 1) {
            if (!selectedPaymentMethod) {
                toast.error("Please select a payment method before proceeding.");
                return;
            }

            // Validate new card details if NEW_CARD is selected
            if (selectedPaymentMethod === 'NEW_CARD') {
                if (!newCardDetails ||
                    !newCardDetails.cardNumber ||
                    !newCardDetails.cardholderName ||
                    !newCardDetails.expiryMonth ||
                    !newCardDetails.expiryYear ||
                    !newCardDetails.cvv) {
                    toast.error("Please fill out all card details before proceeding.");
                    return;
                }
            }

            // Validate saved card is selected
            if (selectedPaymentMethod === 'SAVED_CARD' && !selectedPaymentCard) {
                toast.error("Please select a payment card before proceeding.");
                return;
            }
        }

        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handleSubmitOrder = () => {
        if (!checkoutAddress) {
            toast.error("Please select a delivery address.");
            return;
        }

        if (!selectedPaymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }

        const orderPayload = {
            addressId: checkoutAddress.addressId
        };

        // Build payment data based on selected method
        if (selectedPaymentMethod === 'SAVED_CARD' && selectedPaymentCard) {
            orderPayload.paymentMethod = 'Card';
            orderPayload.cardId = selectedPaymentCard.cardId;
            orderPayload.pgName = 'Demo Payment Gateway';
            orderPayload.pgPaymentId = `PG-${Date.now()}`;
        } else if (selectedPaymentMethod === 'NEW_CARD' && newCardDetails) {
            orderPayload.paymentMethod = 'Card';
            orderPayload.pgName = 'Demo Payment Gateway';
            orderPayload.pgPaymentId = `PG-${Date.now()}`;
        } else if (selectedPaymentMethod === 'COD') {
            orderPayload.paymentMethod = 'Cash on Delivery';
            orderPayload.pgName = 'None';
            orderPayload.pgPaymentId = 'N/A';
        }

        dispatch(submitUserOrder(orderPayload, navigate, toast));
    };

    const checkoutSteps = [
        "Address",
        "Payment",
        "Order Summary",
    ];

    useEffect(() => {
        dispatch(fetchUserAddressList());
    }, [dispatch]);

  return (
    <div className='py-14 min-h-[calc(100vh-100px)]'>
        {/* Custom stepper - shows current checkout step */}
        <CheckoutStepper steps={checkoutSteps} activeStep={currentStep} />

        {/* Step content - conditional rendering based on current step */}
        <div className='mt-5'>
            {currentStep === 0 && <AddressSelector address={userAddresses} />}
            {currentStep === 1 && <PaymentMethodPicker />}
            {currentStep === 2 && <OrderSummaryPanel
                                    totalPrice={totalAmount}
                                    cart={items}
                                    address={checkoutAddress}
                                    paymentMethod={selectedPaymentMethod}
                                    paymentCard={selectedPaymentCard} />}
        </div>

        {/* Fixed bottom navigation bar */}
        <div
            className='flex justify-between items-center px-4 fixed z-50 h-24 bottom-0 bg-white left-0 w-full py-4 border-slate-200'
            style={{ boxShadow: "0 -2px 4px rgba(100, 100, 100, 0.15)" }}>
            <button
                disabled={currentStep === 0}
                onClick={handleGoBack}
                className={`px-6 py-2 border border-gray-300 rounded-md font-semibold transition-colors
                    ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
                Back
            </button>

            {currentStep === checkoutSteps.length - 1 ? (
                <button
                    disabled={isLoading || !checkoutAddress || !selectedPaymentMethod}
                    className={`bg-green-600 font-semibold px-6 h-10 rounded-md text-white hover:bg-green-700
                       ${isLoading || !checkoutAddress || !selectedPaymentMethod ? "opacity-60 cursor-not-allowed" : ""}`}
                    onClick={handleSubmitOrder}>
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
            ) : (
                <button
                    disabled={errorMessage || (currentStep === 0 && !checkoutAddress) || (currentStep === 1 && !selectedPaymentMethod)}
                    className={`bg-custom-blue font-semibold px-6 h-10 rounded-md text-white
                       ${errorMessage || (currentStep === 0 && !checkoutAddress) || (currentStep === 1 && !selectedPaymentMethod) ? "opacity-60" : ""}`}
                    onClick={handleProceed}>
                    Proceed
                </button>
            )}
        </div>

        {errorMessage && <ErrorDisplay message={errorMessage} />}
    </div>
  );
}

export default CheckoutView;
