import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { AddReservationSchema } from "../events/schemas";
import { Form, useSearchParams } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { DataTable } from "~/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { EventAppModel } from "~/services/firestore/events/event-types";
import { getEvents } from "./data.server";
import type { Route } from "./+types/create-reservation";


export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth({ request });
  const events = await getEvents();
  return { events };
}


export default function CreateReservation() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleParamSet = () => {
    const params = new URLSearchParams();
    params.set("eventId", "123");

    return setSearchParams(params);

  }

  const queryParams = Object.fromEntries(searchParams.entries());

  return (
    <div>
      {/* <CreateReservationForm formId="add-reservation" />
       */}
      <Button onClick={handleParamSet}>
        Test Param
      </Button>
      <pre>
        {JSON.stringify(queryParams, null, 2)}
      </pre>
      {
        queryParams.eventId && <p>Event ID: {queryParams.eventId}</p>
      }
    </div>
  );

}

function CreateReservationForm({ formId }: { formId: string }) {
  const [form, fields] = useForm({
    id: formId,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AddReservationSchema })
    },
    defaultValue: {
      timeSlot: "",
      eventId: "",
    },
  })

  return (
    <Form method="post"
      {...getFormProps(form)}
      className="border mt-3"
    >

      <div className="grid gap-4 py-4">
        <h2 className="text-lg font-semibold text-center">Add Reservation Form</h2>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fields.timeSlot.id} className="text-right">
            Time Slot
          </Label>
          <Input
            className="col-span-3"
            {...getInputProps(fields.timeSlot, { type: "text" })}
            key={fields.timeSlot.key}
          />
          <div className="text-red-500 col-start-2 col-span-3">
            {fields.timeSlot.errors}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fields.eventId.id} className="text-right">
            Event ID
          </Label>
          <Input
            className="col-span-3"
            {...getInputProps(fields.eventId, { type: "text" })}
            key={fields.eventId.key}
          />
          <div className="text-red-500 col-start-2 col-span-3">
            {fields.eventId.errors}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="col-start-2 col-span-3">
            <Button
              type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
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
      cell: ({ row }) => { row.original.name }
    },
    {
      accessorKey: 'eventDate',
      header: 'Event Date',
      cell: ({ row }) => row.original.eventDate.toLocaleDateString()
    },
    {
      accessorKey: 'id',
      header: 'Id',
      cell: ({ row }) => { row.original.id }
    }
  ]

  const eventSorted = events.sort((a, b) => b.eventDate.valueOf() - a.eventDate.valueOf());

  return <DataTable columns={columns} data={eventSorted} />

}