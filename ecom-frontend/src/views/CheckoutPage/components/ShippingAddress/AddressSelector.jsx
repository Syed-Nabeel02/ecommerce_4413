/**
 * AddressSelector.jsx
 * Main component for selecting or adding shipping addresses during checkout.
 * Renamed from AddressInfo for better clarity.
 */

import React, { useState } from 'react';
import { FaAddressBook } from 'react-icons/fa';
import AddressFormModal from './AddressFormModal';
import AddAddressForm from './AddAddressForm';
import { useDispatch, useSelector } from 'react-redux';
import AddressList from './AddressList';
import ConfirmDeleteDialog from '../../../../components/ui/modals/ConfirmDeleteDialog';
import toast from 'react-hot-toast';
import { removeUserAddress } from '../../../../store/actions';

const AddressSelector = ({ address }) => {
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const dispatch = useDispatch();
  const { btnLoader } = useSelector((state) => state.errors);

  const handleAddNewAddress = () => {
    setSelectedAddress('');
    setOpenAddressModal(true);
  };

  const handleDeleteAddress = () => {
    dispatch(
      removeUserAddress(toast, selectedAddress?.addressId, setOpenConfirmDeleteDialog)
    );
  };

  const noAddressExist = !address || address.length === 0;

  return (
    <div className="pt-4">
      {noAddressExist ? (
        <div className="p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center">
          <FaAddressBook size={50} className="text-gray-500 mb-4" />
          <h1 className="mb-2 text-slate-900 text-center font-semibold text-2xl">
            No Address Added Yet
          </h1>
          <p className="mb-6 text-slate-800 text-center">
            Please add your address to complete purchase
          </p>

          <button
            onClick={handleAddNewAddress}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 transition-all">
            Add Address
          </button>
        </div>
      ) : (
        <div className="relative p-6 rounded-lg max-w-md mx-auto">
          <h1 className="text-slate-800 text-center font-bold text-2xl">
            Select Address
          </h1>

          <div className="space-y-4 pt-6">
            <AddressList
              addresses={address}
              setSelectedAddress={setSelectedAddress}
              setOpenAddressModal={setOpenAddressModal}
              setOpenConfirmDeleteDialog={setOpenConfirmDeleteDialog}
            />
          </div>

          {address.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleAddNewAddress}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 transition-all">
                Add More
              </button>
            </div>
          )}
        </div>
      )}

      <AddressFormModal open={openAddressModal} setOpen={setOpenAddressModal}>
        <AddAddressForm
          address={selectedAddress}
          setOpenAddressModal={setOpenAddressModal}
        />
      </AddressFormModal>

      <ConfirmDeleteDialog
        open={openConfirmDeleteDialog}
        loader={btnLoader}
        setOpen={setOpenConfirmDeleteDialog}
        title="Delete Address"
        onDeleteHandler={handleDeleteAddress}
      />
    </div>
  );
};

export default AddressSelector;
