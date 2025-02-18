import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/eventIdIndex";
import { getEventStats } from "./events-data.server";
import { ChevronRightIcon } from "lucide-react";
import { convertTo12Hour } from "~/lib/utils";
import { Button } from "~/components/ui/button";
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
  }
}


export default function EventIdIndex({ loaderData }: Route.ComponentProps) {

  return (
    <>
      <AddFamilyNavition />
      <ReportingCards />
      <RequestList />
    </>
  )
}


function AddFamilyNavition() {

  return <div className="flex gap-4 py-4 px-4">
    <Link to="add-family" className="text-blue-600">
      <Button>
        Add Family
      </Button>
    </Link>
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

