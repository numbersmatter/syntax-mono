
import { useOrderStats } from '~/hooks/useOrderStats';
import type { Event } from '../mock/types';
import { CalendarDaysIcon, CheckCircleIcon, ClockIcon, UsersIcon } from '@heroicons/react/20/solid';
// import { Calendar, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
// import { useOrderStats } from '../hooks/useOrderStats';

interface EventCardProps {
  event: Event;
  onEventClick: (eventId: string) => void;
}

const statusConfig = {
  planning: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  open_orders: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  open_pickups: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  finished: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
};

export function EventCard({ event, onEventClick }: EventCardProps) {
  const { totalOrders, approvedOrders } = useOrderStats(event.id);

  return (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
  <div className="h-48 relative">
    <img
      src={event.image}
      alt={event.name}
      className="w-full h-full object-cover"
    />
    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
      {event.type}
    </div>
  </div>
  
  <div className="p-6 space-y-4">
    <div>
      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[event.status].color}`}>
        {event.status.replace('_', ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">{event.name}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
    </div>

    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <CalendarDaysIcon className="w-4 h-4" />
        <span>{new Date(event.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <UsersIcon className="w-4 h-4" />
        <span>Capacity: {event.capacity}</span>
      </div>
    </div>

    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{totalOrders}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
          <div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{approvedOrders}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Approved</div>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={() => onEventClick(event.id)}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
    >
      View Details
     
    </button>
  </div>
</div>
);
}