/**
 * PaymentCardList.jsx
 * Displays list of saved payment cards with edit/delete options.
 * Used in SavedCardInfo component.
 */

import React from 'react';
import { FaCreditCard, FaCheckCircle, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectPaymentCard, setDefaultPaymentCard } from '../../../../store/actions';
import toast from 'react-hot-toast';

const PaymentCardList = ({ cards, setSelectedCard, setOpenCardModal, setOpenConfirmDeleteDialog }) => {
  const dispatch = useDispatch();
  const { selectedPaymentCard } = useSelector((state) => state.payment);

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setOpenCardModal(true);
  };

  const handleDeleteCard = (card) => {
    setSelectedCard(card);
    setOpenConfirmDeleteDialog(true);
  };

  const handleSelectCard = (card) => {
    dispatch(selectPaymentCard(card));
  };

  const handleSetDefault = (e, card) => {
    e.stopPropagation();
    dispatch(setDefaultPaymentCard(card.cardId, toast));
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber || cardNumber.length < 4) return cardNumber;
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.cardId}
          onClick={() => handleSelectCard(card)}
          className={`p-4 border rounded-md cursor-pointer relative ${
            selectedPaymentCard?.cardId === card.cardId
              ? 'bg-green-100 border-green-500'
              : 'bg-white'
          }`}>
          <div className="flex items-start">
            <div className="space-y-1 flex-1">
              <div className="flex items-center">
                <FaCreditCard size={16} className="mr-2 text-gray-600" />
                <p className="font-semibold">{card.cardholderName}</p>
                {selectedPaymentCard?.cardId === card.cardId && (
                  <FaCheckCircle className="text-green-500 ml-2" />
                )}
                {card.isDefault && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    DEFAULT
                  </span>
                )}
              </div>

              <div className="flex items-center">
                <p className="text-gray-700">{maskCardNumber(card.cardNumber)}</p>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <p>
                  Expires: {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 absolute top-4 right-2">
            {!card.isDefault && (
              <button
                onClick={(e) => handleSetDefault(e, card)}
                title="Set as default"
                className="hover:scale-110 transition-transform">
                <FaStar size={18} className="text-gray-400 hover:text-yellow-500" />
              </button>
            )}
            <button onClick={() => handleEditCard(card)}>
              <FaEdit size={18} className="text-teal-700" />
            </button>
            <button onClick={() => handleDeleteCard(card)}>
              <FaTrash size={17} className="text-rose-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentCardList;
