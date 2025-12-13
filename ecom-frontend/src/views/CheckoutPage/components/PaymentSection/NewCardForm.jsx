/**
 * NewCardForm.jsx
 * Form for adding or editing payment cards.
 * Renamed from AddPaymentCardForm for better clarity.
 * Uses React Hook Form for validation.
 */

import React, { useEffect } from 'react';
import TextInput from '../../../../components/ui/forms/TextInput';
import { useForm } from 'react-hook-form';
import { FaCreditCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addUpdateUserPaymentCard } from '../../../../store/actions';

const NewCardForm = ({ card, setOpenCardModal }) => {
  const dispatch = useDispatch();
  const { btnLoader } = useSelector((state) => state.errors);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const handleSaveCard = async (data) => {
    dispatch(addUpdateUserPaymentCard(data, toast, card?.cardId, setOpenCardModal));
  };

  useEffect(() => {
    if (card?.cardId) {
      setValue('cardNumber', card?.cardNumber);
      setValue('cardholderName', card?.cardholderName);
      setValue('expiryMonth', card?.expiryMonth);
      setValue('expiryYear', card?.expiryYear);
      setValue('cvv', card?.cvv);
      setValue('isDefault', card?.isDefault);
    }
  }, [card]);

  return (
    <div>
      <form onSubmit={handleSubmit(handleSaveCard)}>
        <div className="flex justify-center items-center mb-4 font-semibold text-2xl text-slate-800 py-2 px-4">
          <FaCreditCard className="mr-2 text-2xl" />
          {!card?.cardId ? 'Add Payment Card' : 'Update Payment Card'}
        </div>
        <div className="flex flex-col gap-4">
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
                minYear: (value) => parseInt(value) >= 2024 || 'Year must be 2024 or later',
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

          <div className="flex items-center">
            <input
              id="isDefault"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              {...register('isDefault')}
            />
            <label htmlFor="isDefault" className="ml-2 text-sm font-medium text-gray-700">
              Set as default payment card
            </label>
          </div>
        </div>

        <button
          disabled={btnLoader}
          className="text-white bg-custom-blue px-4 py-2 rounded-md mt-4"
          type="submit">
          {btnLoader ? 'Loading...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default NewCardForm;
