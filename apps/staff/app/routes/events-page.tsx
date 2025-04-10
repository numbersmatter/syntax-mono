
// import { mockEvents, mockOrders } from '../data';
// import { OrderCard } from '../components/OrderCard';
import { CalendarDateRangeIcon } from '@heroicons/react/16/solid';
import type { Order, OrderStatus } from '../mock/types';
import {
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/react/20/solid";
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EventCard } from '~/blocks/EventCard';
import { mockEvents, mockOrders } from '~/mock/data';



// interface EventsPageProps {
//   onEventClick: (eventId: string) => void;
// }

export default function EventsPage() {
  const navigate = useNavigate();

  const onEventClick = (eventId: string) => navigate(`/events/${eventId}`);


  return (
    <>


      <PageHeader />


      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} onEventClick={onEventClick} />
          ))}
        </div>
      </main>
    </>

  )
}


function PageHeader() {
  return (

    // <div className="bg-amber-400 mx-auto px-4 py-4 sm:px-6 lg:px-8">
    <div className="flex items-center gap-2">
      <CalendarDateRangeIcon className="w-6 h-6 text-indigo-600" />
      <h1 className="text-3xl font-semibold text-gray-900">
        Events
      </h1>
    </div>
    // </div>
  )
}


