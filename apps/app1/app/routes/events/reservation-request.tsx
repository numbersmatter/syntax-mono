import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router";
import { convertTo12Hour } from "~/lib/utils";
import type { Route } from "./+types/reservation-request";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getReservationRequests } from "./events-data.server";


export async function loader({ params, request }: Route.LoaderArgs) {
  await requireAuth({ request });
  const requests = await getReservationRequests({ eventId: params.eventId });

  return { requests }

}


export default function ReservationRequests({
  loaderData
}: Route.ComponentProps
) {
  const { requests } = loaderData;
  return (
    <>
      <RequestList requests={requests} />
    </>
  )
}

function RequestList({ requests }: { requests: any[] }) {


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
