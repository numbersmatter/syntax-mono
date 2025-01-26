import { Link, useLoaderData } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { ChevronRightIcon } from "lucide-react"
import type { loader } from "./index-page";

export default function ReservationsCard() {
  return (
    <div className="py-4 md:py-8 md:px-4">

      <Card className={""}>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>
            Here you can see all active and pending reservations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0" >
          <ReservationsList />
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  )
}

function ReservationsList() {
  const { reservations } = useLoaderData<typeof loader>()



  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
      {reservations.map((r) => (
        <li key={r.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <Link to={`/reservations/${r.id}`}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {r.eventName}
                </Link>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {new Date(r.date).toLocaleDateString()} {r.time_slot}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <p className="text-sm font-medium leading-6 text-gray-900">
              {r.status}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 font-bold text-gray-900">
                {r.confirm}
              </p>
            </div>
            <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
          </div>
        </li>
      ))}
    </ul>
  )
}

