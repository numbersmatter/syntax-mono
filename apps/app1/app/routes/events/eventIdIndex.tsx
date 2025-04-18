import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/eventIdIndex";
import { getEventStats } from "./events-data.server";
import { Building2, ChevronRightIcon, CreditCardIcon, UserIcon, UsersIcon } from "lucide-react";
import { cn, convertTo12Hour } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { getClerkDataFromUserIds } from "~/services/clerk/clerk-interface.server";
// import { ChartConfig } from "~/staff/components/ui/chart";
// import { TestChart } from "./test-chart";

export async function loader({ params }: Route.LoaderArgs) {

  const eventIndexData = await getEventStats({ eventId: params.eventId })

  // const chartConfig = {
  //   requests: {
  //     label: "Requests",
  //     color: "hsl(var(--chart-1))",
  //   },
  //   approvals: {
  //     label: "Approvals",
  //     color: "hsl(var(--chart-2))",
  //   },
  // } satisfies ChartConfig

  const chartData = [
    { requests: 200, fill: "var(--color-requests)" },
    { approvals: 100, fill: "var(--color-approvals)" },
  ]

  const { stats } = eventIndexData

  const clerkUsers = await getClerkDataFromUserIds({
    userIds: eventIndexData.missingIds,
  })

  return {
    ...eventIndexData,
    cardData: {
      title: "Percent Pickup",
      descript: "example description",
      footerTitle: "Total",
      footerDescript: "example description",
    },
    // chartConfig,
    chartData,
    clerkUsers
  }
}


export default function EventIdIndex({ loaderData }: Route.ComponentProps) {

  return (
    <>
      <ActivityNavition />
      <ReportingCards />
      <MissingIds />
    </>
  )
}


function ActivityNavition() {

  const tabs = [
    { name: 'Process Requests', href: 'process-requests', icon: UsersIcon, current: false },
    { name: 'Pickup Page', href: 'pickup', icon: CreditCardIcon, current: false },
  ]


  return <div className="py-4">
    <div className="border-b border-gray-200">
      <nav aria-label="Tabs" className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.href}
            aria-current={tab.current ? 'page' : undefined}
            className={cn(
              tab.current
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
            )}
          >
            <tab.icon
              aria-hidden="true"
              className={cn(
                tab.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                'mr-2 -ml-0.5 size-5',
              )}
            />
            <span>{tab.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  </div>

}

function MissingIds() {
  const {
    missingIds,
    clerkUsers
  } = useLoaderData<typeof loader>();
  return <div className="px-4 py-2">
    <h1>Missing Info </h1>
    <p>Reporting is Missing information on following clients</p>
    <ul>
      {missingIds.map((id) => {
        return <li key={id}>{id}</li>
      })}
    </ul>
    <pre>
      {JSON.stringify(clerkUsers, null, 2)}
    </pre>
  </div>

}

function ReportingCards() {
  const {
    stats,
    requests,
    approvedReservations,
    reservationsDelivered,
  } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="px-4 py-2">
        <h3 className="text-base font-semibold text-gray-900">Event Stats</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
            </div>
          ))}
        </dl>
      </div>
      {/* <TestChart
        totalReservations={requests.length}
        approvedReservations={approvedReservations.length}
        reservationsDelivered={reservationsDelivered.length}
      /> */}
    </>
  )
}

function RequestList() {
  const { requests } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 py-4">
      <h2 className="text-lg font-semibold text-gray-900 px-2">
        Reservation Requests
      </h2>
      {
        requests.length === 0 && <p className="text-sm text-gray-500">No requests</p>
      }
      <ul
        role="list"
        className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        {requests.map((request) => {
          const timeSlot = convertTo12Hour(request.time);
          const createdDate = new Date(request.createdDate).toLocaleDateString();
          return (
            <li key={request.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <Link to={`/reservations/${request.id}`}>
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {`${request.primaryContact.fname} ${request.primaryContact.lname}`}
                    </Link>
                  </p>
                  <div className="flex flex-row gap-5">
                    <p className="mt-1 flex text-xs leading-5 text-gray-500">
                      {new Date(request.createdDate).toLocaleDateString()}
                    </p>
                    <p className="mt-1 flex text-xs leading-5 text-gray-500">
                      {timeSlot}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <div className="flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    {request.status}
                  </p>
                </div>
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

