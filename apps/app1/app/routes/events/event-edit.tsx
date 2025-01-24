import {
  Form,
  Link,
  useFetcher,
  useOutletContext,
} from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { CheckCircle2Icon, EllipsisVerticalIcon, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useForm } from "@conform-to/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import type { Route } from "./+types/event-edit";
import type { Route as EventId } from "./+types/eventid-nav"
import { mutations } from "./events-data.server";

export const loader = async (args: Route.LoaderArgs) => {
  await requireAuth(args);
  return {};
};

export const action = async (args: Route.ActionArgs) => {
  await requireAuth(args);
  const eventId = args.params.eventId
  const formData = await args.request.formData();
  const intent = formData.get('intent') as string;
  formData.set('eventId', eventId);

  if (intent === 'update-stage') {
    return await mutations.changeStage({ formData });
  }

  if (intent === 'add-pickup-time') {
    return await mutations.addPickupTime({ formData });
  }

  if (intent === 'remove-pickup-time') {
    return await mutations.removePickupTime({ formData });
  }
  return null;
};

export default function EditEvent({ loaderData }: Route.ComponentProps) {
  const { } = loaderData;
  return (
    <>
      <PickupTimesCard />
      <ChangeStage />
    </>
  )
}








function ChangeStage() {
  const { loaderData } = useOutletContext<EventId.ComponentProps>();
  const event = loaderData.event;
  const [newStage, setNewStage] = useState(event.stage);


  return (
    <div
      className="col-span-1 flex flex-col divide-y divide-gray-200 md:rounded-lg bg-white text-center shadow"
    >
      <div className="flex flex-1 flex-col p-8">
        {/* <img alt="" src={person.imageUrl} className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" /> */}
        <h3 className="mt-6 text-xl font-medium text-gray-900">
          Current Stage
        </h3>
        <div>
          <p>{event.stage}</p>
        </div>
        <div className="mt-6">
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
            New Stage
          </label>
          <select
            id="stage"
            name="stage"
            className="mt-1 mx-auto  block max-w-sm rounded-md border-gray-800 py-2 pl-3 pr-10 font-medium text-base bg-gray-200  focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={newStage}
            // @ts-expect-error it is the proper string type
            onChange={(e) => setNewStage(e.target.value)}
          >
            <option value="planning">Planning</option>
            <option value="open-for-requests">Open for Requests</option>
            <option value="open-for-pickups">Open for Pickups</option>
            <option value="event-finished">Event Finished</option>
          </select>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="-ml-px flex w-0 flex-1">
            <div
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <Link to={`/events/${event.id}`} className="flex justify-between gap-1">
                <XIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                cancel
              </Link>
            </div>
          </div>
          <div className="flex w-0 flex-1">
            <Form method="post"
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <input type="hidden" name="eventId" value={event.id} />
              <input type="hidden" name="stage" value={newStage} />
              <Button type="submit" name="intent" value="update-stage" variant="outline" className="flex justify-between gap-1 ">
                <CheckCircle2Icon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                Submit
              </Button>
            </Form>
          </div>

        </div>
      </div>

    </div>

  )
}


function PickupTimesCard() {
  const { loaderData } = useOutletContext<EventId.ComponentProps>();

  const [form, fields] = useForm({
    // onValidate({ formData }) {
    //   return parseWithZod(formData, { schema: CreateEventSchema });
    // }
  });

  const pickupTimes = loaderData?.pickupTimes || [];


  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pickup Times
        </CardTitle>
        <CardDescription>
          Set the times that people can pick up their items.
        </CardDescription>
      </CardHeader>
      <CardContent>

        <PickupTimeList pickupTimes={pickupTimes} />
      </CardContent>
      <CardFooter>
        <Form
          id={form.id}
          onSubmit={form.onSubmit}
          method="post"
          className="flex flex-row gap-2"
        >
          <Input
            type="time"
            name="time"
            id="time"
          />
          <Button
            name="intent"
            value="add-pickup-time"
            type="submit"
          >
            Add Time
          </Button>
        </Form>
      </CardFooter>

    </Card>
  )
}



function PickupTimeList({ pickupTimes }: { pickupTimes: { key: string, value: string }[] }) {


  return (
    <ul className="divide-y divide-gray-100">
      {pickupTimes.map((pickupTime, index) => (
        <PickupRow
          timeId={pickupTime.key}
          displayTime={pickupTime.value}
          index={index}
          key={pickupTime.key}
        />
      )
      )}
    </ul>
  )
}




function PickupRow({ timeId, displayTime, index }: {
  timeId: string,
  displayTime: string,
  index: number
}) {
  const fetcher = useFetcher();

  const handleRemove = async () => {
    return fetcher.submit({
      intent: "remove-pickup-time",
      timeId
    }, { method: "post" });
  }

  const listNumber = index + 1;

  return <li key={timeId} className="flex justify-between gap-x-6 py-5">
    <div className="flex min-w-0 gap-x-4">
      <div className="h-12 w-12  bg-gray-50">
        {listNumber}
      </div>
      <div className="min-w-0 flex-auto">
        {displayTime}
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-x-6">
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        {/* <p className="text-sm leading-6 text-gray-900">{student.school}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          School: {student.school}
        </p> */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
          <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
        >
          <DropdownMenuLabel>

          </DropdownMenuLabel>
          {/* <DropdownMenuItem>{lang.edit}</DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleRemove}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </li>
}
