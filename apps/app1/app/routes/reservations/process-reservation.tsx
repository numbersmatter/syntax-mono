import { useLoaderData, Link, Form } from "react-router";
import { AlertCircle, CheckCircle2Icon, CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
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
  const intent = formData.get("intent");

  if(intent === "approve-reservation") {
    return await mutations.approveReservation({ formData });
  }

  if(intent === "waitlist") {
    return await mutations.waitlistReservation({ formData });
  }

  if(intent === "decline") {
    return await mutations.declineReservation({ formData });
  }


  return 
};


export default function ProcessReservationCard() {
  const { reservation } = useLoaderData<typeof loader>();

  const statusConfig = {
    pending: { icon: ClockIcon, color: 'text-gray-500', bg: 'bg-gray-100' },
    approved: { icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-100' },
    waitlist: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    declined: { icon: XCircleIcon, color: 'text-red-500', bg: 'bg-red-100' }
  };

  const primaryContact = reservation.primaryContact;

  const StatusIcon = statusConfig[reservation.status].icon;

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



      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> */}

      <div className="px-4 py-2">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">
              Reservation: {reservation.id}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(reservation.createdDate).toLocaleDateString()} at{' '}
              {new Date(reservation.createdDate).toLocaleTimeString()}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig[reservation.status].bg}`}>
            <StatusIcon className={`w-4 h-4 ${statusConfig[reservation.status].color}`} />
            <span className="text-sm font-medium capitalize">
              {reservation.status}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium mb-2">Client Details</h4>
            <h4
              className="font-medium mb-2"
            >
              {`${primaryContact.fname} ${primaryContact.lname}`}
            </h4>
          <div className="text-sm text-gray-600">
            <p>{primaryContact.email}</p>
            <p>{primaryContact.phone}</p>
          </div>
        </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-medium mb-2">
              Reservation Details
            </h4>
            <div className="space-y-2">
              {/* <div className="flex justify-between text-sm">
                <span>Placeholder</span>
                <span>second</span>
              </div> */}
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Appointment Time</span>
                <span>{timeSlot}</span>
              </div>
            </div>
          </div>



        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium mb-2">Update Status</h4>
          <div className="flex gap-2">
              <Form method="post"
                className="flex-1 bg-slate-400"

              >
                <input type="hidden" name="reservationId" value={reservation.id} />
                <input type="hidden" name="eventId" value={reservation.eventId} />
                <Button 
                  type="submit" 
                  name="intent" 
                  value="approve-reservation"  
                  className="w-full  px-3 py-2  inline-flex text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors "
                >
                  <CheckCircle2Icon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                  Approve
                </Button>
              </Form>
              <Form method="post"
                className="flex-1 bg-slate-400"

              >
                <input type="hidden" name="reservationId" value={reservation.id} />
                <input type="hidden" name="eventId" value={reservation.eventId} />
                <Button 
                  type="submit" 
                  name="intent" 
                  value="waitlist"  
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  <ClockIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                  Waitlist
                </Button>
              </Form>
              <Form method="post"
                className="flex-1 bg-slate-400"

              >
                <input type="hidden" name="reservationId" value={reservation.id} />
                <input type="hidden" name="eventId" value={reservation.eventId} />
                <Button 
                  type="submit" 
                  name="intent" 
                  value="decline"  
                  className="w-full  px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                >
                  <ClockIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                  Decline
                </Button>
              </Form>
            {/* <button
              // onClick={() => onStatusChange(order.id, 'waitlisted')}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Waitlist
            </button> */}
            {/* <button
              // onClick={() => onStatusChange(order.id, 'declined')}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
            >
              Decline
            </button> */}
          </div>
        </div>
        </div>
      </div>


    </div>

  )
}





// export function OrderCard() {
//   const StatusIcon = statusConfig["pending"].icon;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-lg font-semibold">Order #{order.id}</h3>
//           <p className="text-sm text-gray-500">
//             {new Date(order.createdAt).toLocaleDateString()} at{' '}
//             {new Date(order.createdAt).toLocaleTimeString()}
//           </p>
//         </div>
//         <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig[order.status].bg}`}>
//           <StatusIcon className={`w-4 h-4 ${statusConfig[order.status].color}`} />
//           <span className="text-sm font-medium capitalize">{order.status}</span>
//         </div>
//       </div>

//       <div className="border-t border-gray-100 pt-4">
//         <h4 className="font-medium mb-2">Customer Details</h4>
//         <div className="text-sm text-gray-600">
//           <p>{order.customer.name}</p>
//           <p>{order.customer.email}</p>
//           <p>{order.customer.phone}</p>
//         </div>
//       </div>

    

//       <div className="border-t border-gray-100 pt-4">
//         <h4 className="font-medium mb-2">Update Status</h4>
//         <div className="flex gap-2">
//           <button
//             onClick={() => onStatusChange(order.id, 'approved')}
//             className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
//           >
//             Approve
//           </button>
//           <button
//             onClick={() => onStatusChange(order.id, 'waitlisted')}
//             className="flex-1 px-3 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
//           >
//             Waitlist
//           </button>
//           <button
//             onClick={() => onStatusChange(order.id, 'declined')}
//             className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
//           >
//             Decline
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
