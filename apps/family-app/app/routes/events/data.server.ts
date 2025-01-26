import { parseWithZod } from "@conform-to/zod";
import { data, redirect } from "react-router";
import type { PrimaryContact } from "~/services/firestore/common-types";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";
import { RequestReservationSchema } from "./schemas";

const getPageData = async ({ eventId }: { eventId: string }) => {
  const eventDoc = await foodPantryDb.events.read({ eventId });
  if (!eventDoc) {
    throw data(null, { status: 404, statusText: "Event not found" });
  }

  // check if event is open for requests
  // if not, redirect to home
  if (eventDoc.stage !== "open-for-requests") {
    throw redirect("/");
  }

  const docTimeSlots = eventDoc.timeSlots;

  // Turn timeSlots into an array of objects
  const timeSlots = Object.entries(docTimeSlots)
    .map(([key, value]) => ({ id: key, label: value }))
    .sort((a, b) => Number(a.id) - Number(b.id));

  // const timeSlots = [
  //   { id: "1600", label: "4:00 PM" },
  //   { id: "1630", label: "4:30 PM" },
  //   { id: "1700", label: "5:00 PM" },
  //   { id: "1730", label: "5:30 PM" },
  // ];

  const event = {
    id: eventDoc.id,
    name: eventDoc.name,
    type: eventDoc.type,
    stage: eventDoc.stage,
    eventDate: eventDoc.eventDate,
    semesterId: eventDoc.semesterId,
    timeSlots,
  };

  return { event };
};

export { getPageData };

//
// Data
// Mutations
//

const requestReservation = async ({
  formData,
  userId,
  primaryContact,
}: {
  formData: FormData;
  userId: string;
  primaryContact: PrimaryContact;
}) => {
  const submission = parseWithZod(formData, {
    schema: RequestReservationSchema,
  });

  if (submission.status !== "success") {
    return data(submission.reply(), { status: 400 });
  }

  //  does a reservation for this event already exist?
  //  if so, redirect to that reservation
  //  if not, create a new reservation

  const existingReservation = await foodPantryDb.reservations.checkReservation({
    userId,
    eventId: submission.value.eventId,
  });

  if (existingReservation) {
    throw redirect(`/reservations/${existingReservation.id}`);
  }

  const reservationData = {
    eventId: submission.value.eventId,
    userId,
    fname: primaryContact.fname,
    lname: primaryContact.lname,
    email: primaryContact.email,
    phone: primaryContact.phone,
    time: submission.value.time,
  };

  const newReservationId = await foodPantryDb.reservations.makeReservation(
    reservationData
  );

  return redirect(`/reservations/${newReservationId}`);
};

export const mutations = {
  requestReservation,
};
