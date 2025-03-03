import React from 'react';
import { OrderStatus } from '../types';
import { Clock, CreditCard, Truck } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <Clock className="h-4 w-4 mr-1" /> Pending
        </span>
      );
    case 'paid':
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <CreditCard className="h-4 w-4 mr-1" /> Paid
        </span>
      );
    case 'shipped':
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          <Truck className="h-4 w-4 mr-1" /> Shipped
        </span>
      );
    default:
      return null;
  }
};

export default OrderStatusBadge;