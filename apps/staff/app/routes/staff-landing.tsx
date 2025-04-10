import { CalendarDaysIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, CircleStackIcon, ClockIcon, ShoppingBagIcon, UsersIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useMemo } from "react";
import { mockEvents, mockOrders } from "~/mock/data";






export default function StaffLanding() {
  return (
    <>


      <PageHeader />


      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Dashboard />
      </main>
    </>
  );
}




function Dashboard() {
  const stats = useMemo(() => {
    const totalEvents = mockEvents.length;
    const totalOrders = mockOrders.length;
    const totalCapacity = mockEvents.reduce((sum, event) => sum + event.capacity, 0);

    const ordersByStatus = {
      pending: mockOrders.filter(order => order.status === 'pending').length,
      approved: mockOrders.filter(order => order.status === 'approved').length,
      waitlisted: mockOrders.filter(order => order.status === 'waitlisted').length,
      declined: mockOrders.filter(order => order.status === 'declined').length,
    };

    const upcomingEvents = mockEvents.filter(
      event => new Date(event.date) > new Date()
    ).length;

    return {
      totalEvents,
      totalOrders,
      totalCapacity,
      ordersByStatus,
      upcomingEvents,
    };
  }, []);
  const statCards = [
    {
      title: 'Upcoming Events',
      value: stats.totalEvents,
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Orders To Review',
      value: stats.totalCapacity,
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Orders Approved',
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
    },
  ];

  const orderStatusCards = [
    {
      title: 'Pending Orders',
      value: stats.ordersByStatus.pending,
      icon: ClockIcon,
      color: 'bg-gray-500',
    },
    {
      title: 'Approved Orders',
      value: stats.ordersByStatus.approved,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Waitlisted Orders',
      value: stats.ordersByStatus.waitlisted,
      icon: CircleStackIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Declined Orders',
      value: stats.ordersByStatus.declined,
      icon: XCircleIcon,
      color: 'bg-red-500',
    },
  ];
  return (


    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
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
      </section>

      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Orders by Status</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {orderStatusCards.map((stat) => {
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
      </section>
    </div>



  )
};


function PageHeader() {
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