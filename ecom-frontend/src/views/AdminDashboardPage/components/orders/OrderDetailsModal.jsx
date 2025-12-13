import { useState } from 'react';
import BaseModal from '../../../../components/ui/modals/BaseModal';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';

const OrderDetailsModal = ({ open, setOpen, order }) => {
  const [activeTab, setActiveTab] = useState('items');

  if (!order) return null;

  const tabs = [
    { id: 'items', label: 'Sale Items', icon: FaShoppingCart },
    { id: 'info', label: 'Sale Info', icon: FaInfoCircle },
  ];

  return (
    <BaseModal open={open} setOpen={setOpen} title={`Sale #${order.id}`}>
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
        {activeTab === 'items' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Sale Items</h3>
            <div className="space-y-4">
              {order.orderItems?.length > 0 ? (
                order.orderItems.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex items-start gap-4">
                      {item.product?.image && (
                        <img
                          src={`http://localhost:8080/api/public/products/image/${item.product.image}`}
                          alt={item.product?.productName}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.product?.productName}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.product?.description}</p>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="font-medium">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="font-medium">${item.orderedProductPrice?.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="font-medium">${(item.orderedProductPrice * item.quantity)?.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No items found for this sale</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Sale Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Sale ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sale Date</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sale Status</p>
                <p className="font-medium">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-lg">${order.totalAmount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address ID</p>
                <p className="font-medium">{order.addressId || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default OrderDetailsModal;
