import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { AddReservationSchema } from "./schemas";
import { DataTable } from "~/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { EventAppModel } from "~/services/firestore/events/event-types";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";





export default function CreateReservation() {
  return (
    <div>
      <CreateReservationForm formId="add-reservation" />
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
            Student ID
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
          <Button type="submit" className="col-start-2 col-span-3">
            Submit
          </Button>
        </div>
      </div>
    </Form>
  )
}


