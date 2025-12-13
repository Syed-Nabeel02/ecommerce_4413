
import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import OrderCard from './OrderCard';
import OrderDetailsModal from './OrderDetailsModal';

const OrderHistory = ({ orders, isLoading }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Order History</h2>

            {!orders || orders.length === 0 ? (
                <div className="p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center">
                    <FaShoppingCart size={50} className="text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Orders Yet</h3>
                    <p className="text-slate-600 text-center mb-6">
                        Start shopping to see your orders here
                    </p>
                    <Link to="/products">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Browse Products
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            onViewDetails={() => handleViewDetails(order)}
                        />
                    ))}
                </div>
            )}

            <OrderDetailsModal
                open={openModal}
                setOpen={setOpenModal}
                order={selectedOrder}
            />
        </div>
    );
};

export default OrderHistory;
