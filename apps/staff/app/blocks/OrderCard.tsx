import { BellAlertIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';
import type { Order, OrderStatus } from '~/mock/types';
// import { Order, OrderStatus } from '../types';
// import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

const statusConfig = {
  pending: { icon: ClockIcon, color: 'text-gray-500', bg: 'bg-gray-100' },
  approved: { icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-100' },
  waitlisted: { icon: BellAlertIcon, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  declined: { icon: XCircleIcon, color: 'text-red-500', bg: 'bg-red-100' }
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig[order.status].bg}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig[order.status].color}`} />
          <span className="text-sm font-medium capitalize">{order.status}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="font-medium mb-2">Customer Details</h4>
        <div className="text-sm text-gray-600">
          <p>{order.customer.name}</p>
          <p>{order.customer.email}</p>
          <p>{order.customer.phone}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="font-medium mb-2">Order Items</h4>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="font-medium mb-2">Update Status</h4>
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange(order.id, 'approved')}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onStatusChange(order.id, 'waitlisted')}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Waitlist
          </button>
          <button
            onClick={() => onStatusChange(order.id, 'declined')}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}