import { FieldValue } from "firebase-admin/firestore";
import { data, redirect } from "react-router";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";
import {
  AddPickupTime,
  ChangeStageSchema,
  CreateNewEventSchema,
  RemovePickupTime,
} from "./schemas";
import { convertTo12Hour } from "~/lib/utils";
import { parseWithZod } from "@conform-to/zod";

// Data fetchers
export const getEvents = async () => {
  const allEvents = await foodPantryDb.events.list();

  return allEvents;
};

export const getEventData = async ({ eventId }: { eventId: string }) => {
  const eventDoc = await foodPantryDb.events.read({ eventId });
  if (!eventDoc) {
    throw data("Not Found", {
      status: 404,
      statusText: "Event Not Found",
    });
  }

  const baseUrl = `/events/${eventId}`;

  const timeSlots = eventDoc.timeSlots;

  // Turn timeSlots into an array of objects
  const timeSlotsArray = Object.entries(timeSlots)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => Number(a.key) - Number(b.key));

  const tabs = [
    { name: "Info", to: "", end: true },
    { name: "Edit", to: "edit", end: true },
    { name: "Pickup", to: "pickup", end: false },
  ].map((tab) => {
    return {
      name: tab.name,
      to: `${baseUrl}/${tab.to}`,
      end: tab.end,
    };
  });

  return { event: eventDoc, pickupTimes: timeSlotsArray, tabs };
};

// Event Index Page
export const getEventStats = async ({ eventId }: { eventId: string }) => {
  const eventDoc = await foodPantryDb.events.read({ eventId });

  if (!eventDoc) {
    throw new Error("Event by id does not exist");
  }

  const { semesterId } = eventDoc;

  //  get all reservations for the events
  const reservationsDocs = await foodPantryDb.reservations.listByEvent({
    eventId,
  });

  // order reservations by date requested
  const reservations = reservationsDocs.sort(
    (a, b) => a.createdDate.valueOf() - b.createdDate.valueOf()
  );

  //  get a list of approved reservations
  const approvedReservations = reservationsDocs.filter(
    (r) => r.status == "approved"
  );

  //  get list of approved reservations that have been delivered
  const reservationsDelivered = approvedReservations
    .map((r) => {
      const deliveryStatus = r.deliveryDetails?.status ?? "waiting";

      return {
        ...r,
        deliveryStatus,
      };
    })
    .filter((r) => r.deliveryStatus === "delivered");

  //  get list of userIds for the delivered reservations
  const userIds = reservationsDelivered.map((r) => r.userId);

  //  create an array of promises for the each user with Id to get their registration for that semester
  const registrationDocsPromises = userIds.map((userId) =>
    foodPantryDb.registrations.checkRegistration({ userId, semesterId })
  );

  const registrationQuery = await Promise.all(registrationDocsPromises);

  //  remove users who do not have registration Docs
  const registeredDocs = registrationQuery.filter((r) => r !== null);

  // get an array of all students then create separate lists by school
  const studentsArray = registeredDocs.map((doc) => doc.students).flat();

  const ldeStudents = studentsArray.filter((s) => s.school === "lde");
  const tpsStudents = studentsArray.filter((s) => s.school === "tps");
  const tmsStudents = studentsArray.filter((s) => s.school === "tms");
  const thsStudents = studentsArray.filter((s) => s.school === "ths");

  // get array of all adults
  const adults = registeredDocs
    .map((d) => d.household_adults)
    .reduce((a, c) => a + c, 0);

  //  find users missing some registration data
  const uncounted = userIds.length - registeredDocs.length;

  // create stats needed
  const stats = [
    { name: "Adults", stat: adults },
    { name: "Students", stat: studentsArray.length },
    { name: "High School", stat: thsStudents.length },
    { name: "Middle School", stat: tmsStudents.length },
    { name: "Elementary School", stat: ldeStudents.length },
    { name: "Primary School", stat: tpsStudents.length },
    { name: "Missing Info", stat: uncounted },
  ];

  return {
    studentsArray,
    requests: reservations,
    stats,
    registeredDocs,
    approvedReservations,
    reservationsDelivered,
  };
};

export const getEventPickupList = async ({ eventId }: { eventId: string }) => {
  const reservationDocsAll = await foodPantryDb.reservations.listByEvent({
    eventId,
  });

  const approvedReservations = reservationDocsAll.filter(
    (r) => r.status == "approved"
  );

  const reservationsOrdered = approvedReservations
    .sort((a, b) => a.time - b.time)
    .map((r) => {
      const timeSlot = convertTo12Hour(r.time);
      const deliveryStatus = r.deliveryDetails?.status ?? "waiting";

      return {
        ...r,
        timeSlot,
        deliveryStatus,
      };
    });

  const slots = new Set<number>();
  const slotMap = new Map();

  reservationsOrdered.map((r) => {
    slots.add(r.time);
  });

  const slotArray = [...slots].map((s) => {
    const reservationsAtTime = reservationsOrdered.filter((r) => r.time === s);

    slotMap.set(s, reservationsAtTime);

    return reservationsAtTime;
  });

  const slotTimes = [...slots].sort((a, b) => a - b);

  return { reservations: reservationsOrdered, slotMap, slots: slotTimes };
};

export const getReservationProcessData = async ({
  reservationId,
}: {
  reservationId: string;
}) => {
  const reservation = await foodPantryDb.reservations.read(reservationId);
  if (!reservation) {
    throw data("Reservation Not Found", { status: 404 });
  }
  return { reservation };
};

//
// Data mutations
//

const changeStage = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, {
    schema: ChangeStageSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await foodPantryDb.events.update({
    id: submission.value.eventId,
    data: {
      stage: submission.value.stage,
    },
  });

  return redirect(`/events/${submission.value.eventId}`);
};

const addPickupTime = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, {
    schema: AddPickupTime,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { time, eventId } = submission.value;

  const timeWithOutColon = time.replace(":", "");

  const timeNumber = Number(timeWithOutColon);

  const timeReadValue = convertTo12Hour(timeNumber);

  const updateData = {
    [`timeSlots.${timeWithOutColon}`]: timeReadValue,
  };

  await foodPantryDb.events.update({
    id: eventId,
    data: updateData,
  });

  return redirect(`/events/${eventId}/edit`);
};

const removePickupTime = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, {
    schema: RemovePickupTime,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { eventId, timeId } = submission.value;

  const eventDoc = await foodPantryDb.events.read({ eventId });

  if (!eventDoc) {
    throw new Response("Event Not Found", { status: 404 });
  }

  const timeSlots = eventDoc.timeSlots;

  const newTimeSlots = Object.fromEntries(
    Object.entries(timeSlots).filter(([key]) => key !== timeId)
  );

  await foodPantryDb.events.update({
    id: eventId,
    data: {
      timeSlots: newTimeSlots,
    },
  });
};

const makeEvent = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, { schema: CreateNewEventSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const eventId = await foodPantryDb.events.create(submission.value);

  return redirect(`/events/${eventId}`);
};

const confirmPickup = async ({
  reservationId,
  staffId,
  eventId,
}: {
  reservationId: string;
  staffId: string;
  eventId: string;
}) => {
  const reservation = await foodPantryDb.reservations.read(reservationId);
  if (!reservation) {
    throw data("No reservation found", { status: 404 });
  }

  const updateReservation = foodPantryDb.reservations.update;

  const updateData = {
    deliveryTimestamp: FieldValue.serverTimestamp(),
    status: "delivered",
    staffId,
  };

  await updateReservation({
    id: reservationId,
    data: {
      deliveryDetails: updateData,
    },
  });

  return redirect(`/events/${eventId}/pickup`);
};

export const mutations = {
  changeStage,
  addPickupTime,
  removePickupTime,
  makeEvent,
  confirmPickup,
};
