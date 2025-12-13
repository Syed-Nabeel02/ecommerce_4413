import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseModal from '../../../../components/ui/modals/BaseModal';
import { FaUser, FaAddressBook, FaCreditCard, FaShoppingCart } from 'react-icons/fa';
import { getCustomerDetails } from '../../../../store/actions';
import AddressInfo from '../../../UserProfilePage/components/AddressInfo';
import PaymentCardInfo from '../../../UserProfilePage/components/PaymentCardInfo';
import OrderHistory from '../../../UserProfilePage/components/OrderHistory';

const CustomerDetailsModal = ({ open, setOpen, customer }) => {
  const [activeTab, setActiveTab] = useState('info');
  const dispatch = useDispatch();
  const { selectedCustomerDetails } = useSelector((state) => state.customer);
  const { isLoading } = useSelector((state) => state.errors);

  useEffect(() => {
    if (open && customer?.id) {
      dispatch(getCustomerDetails(customer.id));
    }
  }, [open, customer, dispatch]);

  if (!customer) return null;

  const tabs = [
    { id: 'info', label: 'Customer Info', icon: FaUser },
    { id: 'addresses', label: 'Addresses', icon: FaAddressBook },
    { id: 'cards', label: 'Payment Cards', icon: FaCreditCard },
    { id: 'orders', label: 'Orders', icon: FaShoppingCart },
  ];

  return (
    <BaseModal open={open} setOpen={setOpen} title={`Customer: ${customer.username}`}>
      <div className="mt-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}>
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium">{customer.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium">{customer.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div>
            {selectedCustomerDetails?.addresses?.length > 0 ? (
              <AddressInfo address={selectedCustomerDetails.addresses} />
            ) : (
              <p className="text-sm text-gray-600 mb-4">No addresses found for this customer</p>
            )}
          </div>
        )}

        {activeTab === 'cards' && (
          <div>
            {selectedCustomerDetails?.paymentCards?.length > 0 ? (
              <PaymentCardInfo cards={selectedCustomerDetails.paymentCards} />
            ) : (
              <p className="text-sm text-gray-600 mb-4">No payment cards found for this customer</p>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {selectedCustomerDetails?.orders?.length > 0 ? (
              <OrderHistory orders={selectedCustomerDetails.orders} isLoading={false} />
            ) : (
              <p className="text-sm text-gray-600 mb-4">No orders found for this customer</p>
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default CustomerDetailsModal;


