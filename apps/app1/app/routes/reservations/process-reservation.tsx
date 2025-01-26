import { useLoaderData, Link, Form } from "react-router";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { convertTo12Hour } from "~/lib/utils";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getResIdData, mutations } from "./data.server";
import type { Route } from "./+types/process-reservation"



export const loader = async (args: Route.LoaderArgs) => {
  await requireAuth(args);
  const reservId = args.params.rId;

  const data = await getResIdData({ reservationId: reservId });
  return { ...data };
};

export const action = async (args: Route.ActionArgs) => {
  await requireAuth(args);

  const formData = await args.request.formData();

  return await mutations.approveReservation({ formData });
};


export default function ProcessReservationCard() {
  const { reservation } = useLoaderData<typeof loader>();

  const timeSlot = convertTo12Hour(reservation.time);

  return (
    <div
      className="col-span-1 flex flex-col divide-y divide-gray-200 md:rounded-lg bg-white text-center shadow"
    >
      <div className="flex flex-1 flex-col p-8">
        <Link to={`/events/${reservation.eventId}`} className="mx-auto">
          <Button className='flex justify-between gap-1 '>
            Back to Event
          </Button>
        </Link>
        {/* <img alt="" src={person.imageUrl} className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" /> */}
        <h3 className="mt-6 text-xl font-medium text-gray-900">
          {`${reservation.primaryContact.fname} ${reservation.primaryContact.lname}`}
        </h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="">
            Date Applied
          </dt>
          <dd className="text-sm text-gray-500">
            {new Date(reservation.createdDate).toLocaleDateString()}
          </dd>
          <dt >
            Appointment Time
          </dt>
          <dd className="text-sm text-gray-500">
            {timeSlot}
          </dd>
          <dt className="sr-only">Status</dt>
          <dd className="mt-3">
            <span className="inline-flex items-center px-2 py-1  font-medium ">
              {reservation.status}
            </span>
          </dd>
        </dl>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="-ml-px flex w-0 flex-1">
            <div
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <XCircleIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              Other
            </div>
          </div>
          <div className="flex w-0 flex-1">
            <Form method="post"
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <input type="hidden" name="reservationId" value={reservation.id} />
              <input type="hidden" name="eventId" value={reservation.eventId} />
              <Button type="submit" name="intent" value="approve-reservation" variant="outline" className="flex justify-between gap-1 ">
                <CheckCircle2Icon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                Approve
              </Button>
            </Form>
          </div>

        </div>
      </div>
    </div>

  )
}

