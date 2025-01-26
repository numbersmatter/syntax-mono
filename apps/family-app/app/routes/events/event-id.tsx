import { Form, Link, useActionData, useLoaderData, useNavigation, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,


} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useState } from "react";
import { RequestReservationSchema } from "./schemas";
import { requireAuth } from "~/services/auth/clerk-auth.server";
import { getPageData, mutations } from "./data.server";
import type { Route } from "./+types/event-id"

export const loader = async (args: Route.LoaderArgs) => {
  const { userId } = await requireAuth(args)

  const { event } = await getPageData({ eventId: args.params.eventId });

  return { event };
};

export const action = async (args: Route.ActionArgs) => {
  const {
    userId,
    fname,
    lname,
    email,
    phone
  } = await requireAuth(args);

  const formData = await args.request.formData();
  const primaryContact = {
    fname,
    lname,
    email,
    phone
  }



  return mutations.requestReservation({
    formData,
    userId,
    primaryContact,
  });
};


export default function EventSignupCard() {
  const { event } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [slot, setSlot] = useState("");
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RequestReservationSchema });
    }
  });

  const english = {
    title: "Sign up",
    description: "Reserve your spot for event.",
    button: "Reserve",
    cancel: "Cancel",
    timeSlot: "Time Slot",
    placeholder: "Select a time slot",
  }

  const lang = english



  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {event.name}
        </CardTitle>
        <CardDescription>
          {lang.description}
        </CardDescription>
      </CardHeader>
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <CardContent>
          <input type="hidden" name="intent" value="request-reservation" />
          <input type="hidden" name="eventId" value={event.id} />
          <input type="hidden" name="semesterId" value={event.semesterId} />
          <div className="grid gap-4 py-4">
            <Label htmlFor={fields.time.id}>
              {lang.timeSlot}
            </Label>
            <input
              hidden
              id={fields.time.id} name={fields.time.name}
              value={slot}
              readOnly
            />
            <Select value={slot} onValueChange={setSlot}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={lang.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{lang.timeSlot}</SelectLabel>
                  {event.timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.label}
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
            {lang.button}

          </Button>

          <Link to="/home" className="w-full md:w-auto">
            <Button variant={"secondary"} className="w-full">
              {lang.cancel}
            </Button>
          </Link>

        </CardFooter>
      </Form>
    </Card>
  )
}


