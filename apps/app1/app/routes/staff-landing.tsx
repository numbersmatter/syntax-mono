// import { CalendarDaysIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, CircleStackIcon, ClockIcon, ShoppingBagIcon, UsersIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { CalendarDaysIcon, ChartBarIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import { useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getOpenEvents } from "./events/events-data.server";
import { EventCard } from "~/components/blocks/event-card";
import type { Route } from "./+types/staff-landing";
// import { EventCard } from "~/blocks/EventCard";
// import { mockEvents, mockOrders } from "~/mock/data";




export async function loader({ params, request }: Route.LoaderArgs) {
  await requireAuth({ request });

  const { openEvents, returnedReservations } = await getOpenEvents();
  const reservations = returnedReservations.flat();


  const stats = {
    totalEvents: openEvents.length,
    totalOrders: reservations.length,
    totalCapacity: 0,
    pending: reservations.filter((r) => r.status === 'pending').length,
    approved: reservations.filter((r) => r.status === 'approved').length,
    waitlisted: reservations.filter((r) => r.status === 'waitlist').length,
    declined: reservations.filter((r) => r.status === 'declined').length,

    upcomingEvents: 0,
  }


  //     totalEvents,
  //     totalOrders,
  //     totalCapacity,
  //     ordersByStatus,
  //     upcomingEvents,
  //   };



  return { stats, openEvents, returnedReservations, reservations }

}







export default function StaffLanding({ loaderData }: Route.ComponentProps) {
  const { stats, openEvents, reservations } = loaderData;
  const navigation = useNavigate();

  const onEventClick = (eventId: string) => navigation(`/events/${eventId}`);

  const eventsWithStats = openEvents.map((event) => {
    const eventReservations = reservations.filter((r) => r.eventId === event.id);
    const totalCapacity = 0
    const totalOrders = eventReservations.length;
    const pending = eventReservations.filter((r) => r.status === 'pending').length;
    const approved = eventReservations.filter((r) => r.status === 'approved').length;
    const waitlisted = eventReservations.filter((r) => r.status === 'waitlist').length;
    const declined = eventReservations.filter((r) => r.status === 'declined').length;



    return {
      ...event,
      totalOrders,
      totalCapacity,
      pending,
      approved,
      waitlisted,
      declined,
    };
  });


  return (
    <div className="px-4 py-4 space-y-8">
      <section>
        <SectionHeader />
        <Dashboard />
      </section>
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Upcoming Events
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventsWithStats.map((event) => {

            return <EventCard
              key={event.id}
              event={event}
              onEventClick={onEventClick}
            />
          })}
        </div>
      </section>
      <section>
        <pre>
          {JSON.stringify(stats, null, 2)}
        </pre>
      </section>
    </div>
  );
}




function Dashboard() {
  const { stats } = useLoaderData();
  // const stats = useMemo(() => {
  //   const totalEvents = mockEvents.length;
  //   const totalOrders = mockOrders.length;
  //   const totalCapacity = mockEvents.reduce((sum, event) => sum + event.capacity, 0);

  //   const ordersByStatus = {
  //     pending: mockOrders.filter(order => order.status === 'pending').length,
  //     approved: mockOrders.filter(order => order.status === 'approved').length,
  //     waitlisted: mockOrders.filter(order => order.status === 'waitlisted').length,
  //     declined: mockOrders.filter(order => order.status === 'declined').length,
  //   };

  //   const upcomingEvents = mockEvents.filter(
  //     event => new Date(event.date) > new Date()
  //   ).length;

  //   return {
  //     totalEvents,
  //     totalOrders,
  //     totalCapacity,
  //     ordersByStatus,
  //     upcomingEvents,
  //   };
  // }, []);


  const statCards = [
    {
      title: 'Upcoming Events',
      value: stats.totalEvents,
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Orders To Review',
      value: stats.pending,
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Orders Approved',
      value: stats.approved,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
    },
  ];

  // const orderStatusCards = [
  //   {
  //     title: 'Pending Orders',
  //     value: stats.ordersByStatus.pending,
  //     icon: ClockIcon,
  //     color: 'bg-gray-500',
  //   },
  //   {
  //     title: 'Approved Orders',
  //     value: stats.ordersByStatus.approved,
  //     icon: CheckCircleIcon,
  //     color: 'bg-green-500',
  //   },
  //   {
  //     title: 'Waitlisted Orders',
  //     value: stats.ordersByStatus.waitlisted,
  //     icon: CircleStackIcon,
  //     color: 'bg-yellow-500',
  //   },
  //   {
  //     title: 'Declined Orders',
  //     value: stats.ordersByStatus.declined,
  //     icon: XCircleIcon,
  //     color: 'bg-red-500',
  //   },
  // ];

  return (



    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>

  )
};


function SectionHeader() {
  return (

    // <div className="bg-amber-400 mx-auto px-4 py-4 sm:px-6 lg:px-8">
    <div className="flex items-center gap-2">
      <ChartBarIcon className="w-6 h-6 text-indigo-600" />
      <h1 className="text-3xl font-semibold text-gray-900">
        Dashboard
      </h1>
    </div>
    // </div>
  )
}