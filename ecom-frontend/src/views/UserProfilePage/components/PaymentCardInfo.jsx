import React, { useState } from 'react';
import { FaCreditCard } from 'react-icons/fa';
import AddressInfoModal from '../../CheckoutPage/components/ShippingAddress/AddressFormModal';
import AddPaymentCardForm from '../../CheckoutPage/components/PaymentSection/NewCardForm';
import { useDispatch, useSelector } from 'react-redux';
import PaymentCardList from '../../CheckoutPage/components/PaymentSection/PaymentCardList';
import ConfirmDeleteDialog from '../../../components/ui/modals/ConfirmDeleteDialog';
import toast from 'react-hot-toast';
import { deleteUserPaymentCard } from '../../../store/actions';

const PaymentCardInfo = ({ cards }) => {
    const [openCardModal, setOpenCardModal] = useState(false);
    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
    const [selectedCard, setSelectedCard] = useState("");

    const addNewCardHandler = () => {
        setSelectedCard("");
        setOpenCardModal(true);
    };

    const dispatch = useDispatch();

    const deleteCardHandler = () => {
        dispatch(deleteUserPaymentCard(
            toast,
            selectedCard?.cardId,
            setOpenConfirmDeleteDialog
        ));
    };

    const noCardsExist = !cards || cards.length === 0;
    const { isLoading, btnLoader } = useSelector((state) => state.errors);

    return (
        <div className='pt-4'>
            {noCardsExist ? (
                <div className='p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center'>
                    <FaCreditCard size={50} className='text-gray-500 mb-4' />
                    <h1 className='mb-2 text-slate-900 text-center font-semibold text-2xl'>
                        No Payment Cards Added Yet
                    </h1>
                    <p className='mb-6 text-slate-800 text-center'>
                        Please add a payment card or choose another payment method
                    </p>

                    <button
                        onClick={addNewCardHandler}
                        className='px-4 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 transition-all'>
                        Add Card
                    </button>
                </div>
            ) : (
                <div className='relative p-6 rounded-lg max-w-md mx-auto'>
                    <h1 className='text-slate-800 text-center font-bold text-2xl'>
                        Select Payment Card
                    </h1>

                    <div className='space-y-4 pt-6'>
                        <PaymentCardList
                            cards={cards}
                            setSelectedCard={setSelectedCard}
                            setOpenCardModal={setOpenCardModal}
                            setOpenConfirmDeleteDialog={setOpenConfirmDeleteDialog}
                        />
                    </div>

                    {cards.length > 0 && (
                        <div className='mt-4'>
                            <button
                                onClick={addNewCardHandler}
                                className='px-4 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 transition-all'>
                                Add More
                            </button>
                        </div>
                    )}
                </div>
            )}

            <AddressInfoModal
                open={openCardModal}
                setOpen={setOpenCardModal}>
                <AddPaymentCardForm
                    card={selectedCard}
                    setOpenCardModal={setOpenCardModal} />
            </AddressInfoModal>

            <ConfirmDeleteDialog
                open={openConfirmDeleteDialog}
                loader={btnLoader}
                setOpen={setOpenConfirmDeleteDialog}
                title="Delete Payment Card"
                onDeleteHandler={deleteCardHandler}
            />
        </div>
    );
}

export default PaymentCardInfo;
