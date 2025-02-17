import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import type { Route } from "./+types/family-event-form";
import { Form, Link, useNavigation } from "react-router";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { RequestReservationSchema } from "./schemas";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getClerkData, mutations } from "./events-data.server";



export async function loader({ request, params }: Route.LoaderArgs) {
  await requireAuth({ request });
  const userId = params.userId;

  const { userData } = await getClerkData({ userId })


  return {
    userData,
  }

}


export async function action({ request, params }: Route.ActionArgs) {
  await requireAuth({ request });
  const formData = await request.formData();

  const intent = formData.get("intent") as string;

  if (intent === "request-reservation") {

    return await mutations.staffReservationRequest({
      formData,
      userId: params.userId
    })
  }


  return {
    status: "submitted"
  }

}



export default function FamilyEventForm({
  matches, loaderData
}: Route.ComponentProps) {
  const [slot, setSlot] = useState("");
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  const [form, fields] = useForm({
    // lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RequestReservationSchema });
    }
  });

  const eventIdData = matches[2]

  const { event, pickupTimes } = eventIdData.data

  const { userData } = loaderData

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {`Add ${userData.fname} ${userData.lname} to ${event.name}`}
        </CardTitle>
        <CardDescription>
          {`Add ${userData.fname} ${userData.lname} to ${event.name}`}
        </CardDescription>
      </CardHeader>
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <CardContent>
          <input type="hidden" name="intent" value="request-reservation" />
          <input type="hidden" name="eventId" value={event.id} />
          <input type="hidden" name="semesterId" value={event.semesterId} />
          <div className="grid gap-4 py-4">
            <Label htmlFor={fields.time.id}>
              Time Slot
            </Label>
            <input
              hidden
              id={fields.time.id} name={fields.time.name}
              value={slot}
              readOnly
            />
            <Select value={slot} onValueChange={setSlot}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={"Select Time"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel> Time Slot</SelectLabel>
                  {pickupTimes.map((slot) => (
                    <SelectItem key={slot.key} value={slot.key}>
                      {slot.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div>
              {fields.time.errors}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-between gap-12 md:flex-row-reverse md:gap-8 ">
          <Button
            className="w-full md:w-auto"
            disabled={isSubmitting}
            type="submit"
          >
            Add Reservation Request

          </Button>

          <Link to=".." className="w-full md:w-auto">
            cancel
          </Link>

        </CardFooter>
      </Form>
    </Card>

  )
}


function FamilyEventFormContent() {

  return (
    <div>
      <h1>Family Event Form</h1>
      <p>Family Event Form Content</p>
    </div>
  )
}