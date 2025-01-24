import { useLoaderData } from "react-router";
import type { Route } from "./+types/eventIdIndex";
import { getEventStats } from "./events-data.server";
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
    <ReportingCards />
  )
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
