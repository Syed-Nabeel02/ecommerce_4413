import { FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';
import StatusBadge from '../../../components/ui/feedback/StatusBadge';

const OrderCard = ({ order, onViewDetails }) => {
    const itemCount = order.orderItems?.length || 0;
    const totalQuantity = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const formattedDate = new Date(order.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Determine status styling
    const getStatusStyle = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('accepted') || statusLower.includes('confirmed')) {
            return { bg: 'bg-green-100', color: 'text-green-800', icon: FaCheckCircle };
        }
        if (statusLower.includes('shipped') || statusLower.includes('transit')) {
            return { bg: 'bg-blue-100', color: 'text-blue-800', icon: FaTruck };
        }
        return { bg: 'bg-gray-100', color: 'text-gray-800', icon: FaClock };
    };

    const statusStyle = getStatusStyle(order.orderStatus);

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-slate-800">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-600">{formattedDate}</p>
                </div>
                <StatusBadge
                    text={order.orderStatus}
                    bg={statusStyle.bg}
                    color={statusStyle.color}
                    icon={statusStyle.icon}
                />
            </div>

            {/* Order Summary */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{itemCount} product(s) ({totalQuantity} units)</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-slate-800">${order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className="text-slate-700">{order.payment?.paymentMethod}</span>
                </div>
            </div>

            {/* View Details Button */}
            <button
                onClick={onViewDetails}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                View Details
            </button>
        </div>
    );
};

export default OrderCard;
