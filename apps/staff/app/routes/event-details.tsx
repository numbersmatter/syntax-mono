import type { Order, OrderStatus } from '../mock/types';
import {
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
} from "@heroicons/react/20/solid";
import { useState } from 'react';
import { OrderCard } from '~/blocks/OrderCard';
import { mockEvents, mockOrders } from '~/mock/data';
import type { Route } from './+types/event-details';






interface EventDetailsPageProps {
  eventId: string;
  onBack: () => void;
  onEdit: (eventId: string) => void;
}

export const loader = async ({ params, request }: Route.LoaderArgs) => {

  const event = mockEvents[0];



  return { event }
};


export default function EventDetailsPage({ loaderData }: Route.ComponentProps) {

  const event = loaderData.event;

  const eventId = event.id;
  const [orders, setOrders] = useState<Order[]>(
    mockOrders.filter(order => order.eventId === eventId)
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const onBack = () => {
    // Navigate back to the event list
    return console.log("Back to event list");
  };

  const onEdit = (eventId: string) => {
    // Navigate to the edit event page
    return console.log(`Edit event ${eventId}`);
  };


  if (!event) {
    return <div>Event not found</div>;
  }

  const statusConfig = {
    planning: { color: 'bg-gray-100 text-gray-800' },
    open_orders: { color: 'bg-green-100 text-green-800' },
    open_pickups: { color: 'bg-blue-100 text-blue-800' },
    finished: { color: 'bg-purple-100 text-purple-800' }
  };

  // const eventImage = event.image.split('?')[0];

  const eventImage = "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-64 relative overflow-hidden bg-amber-500" >
        <img
          src={eventImage}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-50" /> */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => onEdit(event.id)}
          className="absolute top-4 right-4 flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Cog6ToothIcon className="w-4 h-4" />
          Edit Event
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {event.type}
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[event.status].color}`}>
                  {event.status.replace('_', ' ').split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </div>
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{event.name}</h1>
              <p className="mt-2 text-gray-600">{event.description}</p>
            </div>

            <div className="flex gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-gray-400" />
                <span>Reservations: {event.capacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <span>Virtual Event</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Orders</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No orders yet for this event
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



