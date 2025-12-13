import BaseModal from '../../../components/ui/modals/BaseModal';
import StatusBadge from '../../../components/ui/feedback/StatusBadge';
import { FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';

const OrderDetailsModal = ({ open, setOpen, order }) => {
    if (!order) return null;

    const getStatusStyle = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('accepted')) {
            return { bg: 'bg-green-100', color: 'text-green-800', icon: FaCheckCircle };
        }
        if (statusLower.includes('shipped')) {
            return { bg: 'bg-blue-100', color: 'text-blue-800', icon: FaTruck };
        }
        return { bg: 'bg-gray-100', color: 'text-gray-800', icon: FaClock };
    };

    const statusStyle = getStatusStyle(order.orderStatus);
    const formattedDate = new Date(order.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <BaseModal open={open} setOpen={setOpen} title={`Order #${order.orderId}`}>
            <div className="space-y-6 pt-4">
                {/* Status */}
                <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Order Status</h3>
                        <StatusBadge {...statusStyle} text={order.orderStatus} />
                    </div>
                    <p className="text-sm text-gray-600">Ordered on: {formattedDate}</p>
                </div>

                {/* Order Items */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Items</h3>
                    <div className="space-y-3">
                        {order.orderItems?.map((item) => (
                            <div key={item.orderItemId} className="flex gap-4 p-3 bg-gray-50 rounded-md">
                                <img
                                    src={`${import.meta.env.VITE_BACK_END_URL}/images/${item.product?.image}`}
                                    alt={item.product?.productName}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800">
                                        {item.product?.productName}
                                    </h4>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">
                                        Price: ${item.orderedProductPrice?.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Info */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium">{order.payment?.paymentMethod}</span>
                        </div>
                        {order.payment?.pgName && order.payment.pgName !== 'None' && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gateway:</span>
                                <span className="font-medium">{order.payment.pgName}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Total */}
                <div className="pt-2">
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-bold text-slate-800">
                            ${order.totalAmount?.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Address */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
                    <p className="text-sm text-gray-600">Address ID: {order.addressId}</p>
                </div>
            </div>
        </BaseModal>
    );
};

export default OrderDetailsModal;
