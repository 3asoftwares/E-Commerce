/**
 * Order Card Component
 * Used to display orders in order history
 */


import { Order, OrderStatus } from '@e-commerce/types';

export interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  showActions?: boolean;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PROCESSING]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.OUT_FOR_DELIVERY]: 'bg-teal-100 text-teal-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.RETURNED]: 'bg-orange-100 text-orange-800',
  [OrderStatus.REFUNDED]: 'bg-gray-100 text-gray-800',
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onTrackOrder,
  onCancelOrder,
  showActions = true,
}) => {
  const canCancel = [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status);
  const canTrack = [OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY].includes(order.status);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
        >
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Items Preview */}
      <div className="space-y-3 mb-4">
        {order.items.slice(0, 2).map((item:any) => (
          <div key={item.id} className="flex gap-3">
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.productName}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-gray-900">${item.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-sm text-primary-600">+{order.items.length - 2} more items</p>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-3 border-t">
        <span className="text-gray-600">Total Amount:</span>
        <span className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onViewDetails?.(order.id)}
            className="flex-1 px-4 py-2 border border-primary-600 text-primary-600 rounded hover:bg-primary-50"
          >
            View Details
          </button>
          {canTrack && (
            <button
              onClick={() => onTrackOrder?.(order.id)}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Track Order
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancelOrder?.(order.id)}
              className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};
