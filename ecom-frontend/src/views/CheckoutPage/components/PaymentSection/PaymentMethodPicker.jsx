/**
 * PaymentMethodPicker.jsx
 * Component for selecting payment method during checkout.
 * Renamed from PaymentMethodSelection for better clarity.
 * Supports saved cards, new cards, and cash on delivery.
 */

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCreditCard, FaMoneyBillWave, FaWallet } from 'react-icons/fa';
import SavedCardInfo from './SavedCardInfo';
import { getUserPaymentCards, selectPaymentMethod, setNewCardDetails } from '../../../../store/actions';
import { useForm } from 'react-hook-form';
import TextInput from '../../../../components/ui/forms/TextInput';

const PaymentMethodPicker = () => {
  const dispatch = useDispatch();
  const { paymentCards, selectedPaymentMethod, selectedPaymentCard } = useSelector((state) => state.payment);
  const [expandedMethod, setExpandedMethod] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    mode: 'onTouched',
  });

  const formValuesRef = useRef({});

  useEffect(() => {
    dispatch(getUserPaymentCards());
  }, [dispatch]);

  // Auto-expand saved card if user has cards
  useEffect(() => {
    if (paymentCards && paymentCards.length > 0 && !selectedPaymentMethod && !expandedMethod) {
      setExpandedMethod('SAVED_CARD');
    }
  }, [paymentCards, selectedPaymentMethod, expandedMethod]);

  // Update card details in Redux on blur
  const handleCardFieldChange = () => {
    const formData = getValues();
    const formDataString = JSON.stringify(formData);

    if (formValuesRef.current !== formDataString) {
      formValuesRef.current = formDataString;
      dispatch(setNewCardDetails(formData));
    }
  };

  const handleSelectMethod = (method) => {
    dispatch(selectPaymentMethod(method));
    setExpandedMethod(method);
  };

  const paymentMethods = [
    {
      id: 'SAVED_CARD',
      label: 'Use Saved Card',
      icon: FaCreditCard,
      description:
        paymentCards && paymentCards.length > 0
          ? 'Select from your saved payment cards'
          : 'Add a payment card for future use',
      available: true,
    },
    {
      id: 'NEW_CARD',
      label: 'Pay with a Temporary Card',
      icon: FaWallet,
      description: 'Enter card details for this purchase only',
      available: true,
    },
    {
      id: 'COD',
      label: 'Cash on Delivery',
      icon: FaMoneyBillWave,
      description: 'Pay when you receive your order',
      available: true,
    },
  ];

  return (
    <div className="pt-4">
      <div className="p-6 rounded-lg max-w-2xl mx-auto">
        <h1 className="mb-6 text-slate-800 text-center font-bold text-2xl">
          Select Payment Method
        </h1>

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            if (!method.available) return null;

            const isSelected = selectedPaymentMethod === method.id;
            const isExpanded = expandedMethod === method.id;

            return (
              <div key={method.id} className="border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleSelectMethod(method.id)}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-green-50 border-green-500'
                      : 'bg-white hover:bg-gray-50'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-green-500' : 'border-gray-300'
                      }`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-green-500" />}
                    </div>
                    <method.icon className="text-gray-600" size={20} />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{method.label}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </button>

                {/* Expanded content for each payment method */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    {method.id === 'SAVED_CARD' && <SavedCardInfo cards={paymentCards} />}

                    {method.id === 'NEW_CARD' && (
                      <div className="max-w-md mx-auto">
                        <div className="mb-4 text-center">
                          <p className="text-sm text-gray-600">
                            Card details will be used only for this purchase and won't be saved
                          </p>
                        </div>
                        <form className="space-y-4" onBlur={handleCardFieldChange}>
                          <TextInput
                            label="Card Number"
                            required
                            id="cardNumber"
                            type="text"
                            message="*Card Number is required (13-19 digits)"
                            placeholder="Enter card number"
                            register={register}
                            errors={errors}
                            pattern={{
                              value: /^[0-9]{13,19}$/,
                              message: 'Card number must be 13-19 digits',
                            }}
                          />

                          <TextInput
                            label="Cardholder Name"
                            required
                            id="cardholderName"
                            type="text"
                            message="*Cardholder Name is required"
                            placeholder="Name on card"
                            register={register}
                            errors={errors}
                            min={2}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <TextInput
                              label="Expiry Month"
                              required
                              id="expiryMonth"
                              type="number"
                              message="*Expiry Month is required (1-12)"
                              placeholder="MM"
                              register={register}
                              errors={errors}
                              min={1}
                              max={12}
                            />

                            <TextInput
                              label="Expiry Year"
                              required
                              id="expiryYear"
                              type="number"
                              message="*Expiry Year must be 2024 or later"
                              placeholder="YYYY"
                              register={register}
                              errors={errors}
                              validate={{
                                minYear: (value) =>
                                  parseInt(value) >= 2024 || 'Year must be 2024 or later',
                              }}
                            />
                          </div>

                          <TextInput
                            label="CVV"
                            required
                            id="cvv"
                            type="text"
                            message="*CVV is required (3-4 digits)"
                            placeholder="CVV"
                            register={register}
                            errors={errors}
                            pattern={{
                              value: /^[0-9]{3,4}$/,
                              message: 'CVV must be 3-4 digits',
                            }}
                          />
                        </form>
                      </div>
                    )}

                    {method.id === 'COD' && (
                      <div className="text-center py-4">
                        <FaMoneyBillWave className="mx-auto text-green-600 mb-3" size={40} />
                        <p className="text-gray-700 font-medium">
                          You will pay cash when your order is delivered
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Please keep exact change ready for smooth delivery
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!selectedPaymentMethod && (
          <p className="text-sm text-red-600 text-center mt-4">
            Please select a payment method to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodPicker;
