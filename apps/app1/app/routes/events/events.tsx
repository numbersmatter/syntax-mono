import { Link, useLoaderData } from "react-router"
import type { Route } from "./+types/events";
import { getEvents } from "./events-data.server";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { Car, ChevronRightIcon, PackageOpenIcon } from "lucide-react";
import type { EventAppModel } from "~/services/firestore/events/event-types";
import { DataTable } from "~/components/ui/data-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { Button } from "~/components/ui/button";



export const loader = async ({ request }: Route.LoaderArgs) => {
  await requireAuth({ request });
  const events = await getEvents();
  return { events };
};




export default function EventsIndex({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData;

  return (
    <div>

      <div className="flex justify-between items-center py-2 px-2">
        <Link to="create">
          <Button>
            Create Event
          </Button>
        </Link>
      </div>
      <EventsHistoryTable events={events} />
      <EventsList events={events} />
    </div>
  )
}


function EventsList({ events }: { events: EventAppModel[] }) {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
      {events.map((event) => (
        <li key={event.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
          <div className="flex min-w-0 gap-x-4">
            {
              event.type === "pickup" && <Car aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
            }
            {
              event.type === "drive-thru" && <PackageOpenIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
            }
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <Link to={`/events/${event.id}`}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {event.name}, {event.type}
                </Link>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {event.eventDate.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                {event.stage}
              </p>

            </div>
            <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
          </div>
        </li>
      ))}
    </ul>
  )
}



function EventsHistoryTable({ events }: { events: EventAppModel[] }) {

  type EventRow = {
    id: string;
    name: string;
    type: string;
    eventDate: Date;
    stage: string;
  }

  const columns: ColumnDef<EventRow>[] = [
    {
      accessorKey: 'name',
      header: 'Event Name',
      cell: ({ row }) =>
        <Link to={`/events/${row.original.id}`}>{row.original.name}</Link>
    },
    {
      accessorKey: 'eventDate',
      header: 'Event Date',
      cell: ({ row }) => row.original.eventDate.toLocaleDateString()
    },
    {
      accessorKey: 'id',
      header: 'Stage',
      cell: ({ row }) => <Link to={`/events/${row.original.id}`}>
        {row.original.stage}
      </Link>
    }
  ]

  const eventSorted = events.sort((a, b) => b.eventDate.valueOf() - a.eventDate.valueOf());

  return <DataTable columns={columns} data={eventSorted} />

}