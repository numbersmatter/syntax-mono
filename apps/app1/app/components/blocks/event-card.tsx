import { ArrowRightCircleIcon, CalendarDaysIcon, CheckCircleIcon, ClockIcon, UsersIcon } from "lucide-react";
import type { EventAppModel } from "~/services/firestore/events/event-types";




interface EventCardProps {
  event: EventAppModel;
  onEventClick: (eventId: string) => void;
}

const statusConfig = {
  planning: { color: 'bg-gray-100 text-gray-800' },
  "open-for-requests": { color: 'bg-green-100 text-green-800' },
  "open-for-pickups": { color: 'bg-blue-100 text-blue-800' },
  "event-finished": { color: 'bg-purple-100 text-purple-800' }
};

export function EventCard({ event, onEventClick }: EventCardProps) {


  const imageSrc = "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&q=80&w=1000"


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 relative">
        <img
          src={imageSrc}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
          {event.type}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[event.stage].color}`}>
            {event.stage.replace('-', ' ').split(' ').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-2">{event.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{event.message}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4" />
            <span>Capacity: Not Set</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-semibold">
                  0
                </div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-semibold">
                  0
                </div>
                <div className="text-sm text-gray-500">Approved</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onEventClick(event.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          View Details
          <ArrowRightCircleIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}