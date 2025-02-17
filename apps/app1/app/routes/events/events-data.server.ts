import { FieldValue } from "firebase-admin/firestore";
import { data, redirect } from "react-router";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";
import {
  AddPickupTime,
  ChangeStageSchema,
  CreateNewEventSchema,
  RemovePickupTime,
  RequestReservationSchema,
} from "./schemas";
import { convertTo12Hour } from "~/lib/utils";
import { parseWithZod } from "@conform-to/zod";
import { getServerEnv } from "~/env.server";
import { createClerkClient } from "@clerk/react-router/api.server";
import type { PrimaryContact } from "~/services/firestore/common-types";
import { getClerkClient } from "~/services/clerk/clerk-interface.server";

// Data fetchers
export const getEvents = async () => {
  const allEvents = await foodPantryDb.events.list();

  return allEvents;
};

export const getClerkData = async ({ userId }: { userId: string }) => {
  const clerkId = "user_" + userId;

  const clerk = getClerkClient();

  const clerkUser = await clerk.users.getUser(clerkId);

  const userData = {
    fname: clerkUser.firstName,
    lname: clerkUser.lastName,
  };

  return {
    userData,
  };
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

export const getReservationRequests = async ({
  eventId,
}: {
  eventId: string;
}) => {
  const reservationsDocs = await foodPantryDb.reservations.listByEvent({
    eventId,
  });

  // order reservations by date requested
  return reservationsDocs.sort(
    (a, b) => a.createdDate.valueOf() - b.createdDate.valueOf()
  );
};

// Event Index Page
export const getEventStats = async ({ eventId }: { eventId: string }) => {
  const eventDoc = await foodPantryDb.events.read({ eventId });

  if (!eventDoc) {
    throw new Error("Event by id does not exist");
  }

  const { semesterId } = eventDoc;

  // order reservations by date requested
  const reservations = await getReservationRequests({ eventId });

  //  get a list of approved reservations
  const approvedReservations = reservations.filter(
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

export const getAddableFamilies = async ({ eventId }: { eventId: string }) => {
  const reservations = await getReservationRequests({ eventId });
  const clerk = getClerkClient();

  const clerkUsersObjects = (await clerk.users.getUserList({ limit: 50 })).data;

  const clerkUsers = clerkUsersObjects.map((user) => {
    const userId = user.id.split("_", 2)[1];

    return {
      clerkId: user.id,
      userId,
      fname: user.firstName,
      lname: user.lastName,
      lastSignInAt: user.lastSignInAt,
    };
  });

  const reservationUserIds = reservations.map((r) => r.userId);

  const addableFamilies = clerkUsers
    .filter((user) => !reservationUserIds.includes(user.userId))
    .map((clerkUser) => {
      return {
        userId: clerkUser.userId,
        fname: clerkUser.fname ?? "error  first name",
        lname: clerkUser.lname ?? "error last name",
        clerkId: clerkUser.clerkId,
      };
    });

  return addableFamilies;
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

const requestReservation = async ({
  eventId,
  userId,
  clerkId,
  time,
}: {
  eventId: string;
  userId: string;
  clerkId: string;
  time: number;
}) => {
  //  does a reservation for this event already exist?
  //  if so, redirect to that reservation
  //  if not, create a new reservation

  const existingReservation = await foodPantryDb.reservations.checkReservation({
    userId,
    eventId,
  });

  if (existingReservation) {
    return { status: "error-already" };
  }

  const clerk = getClerkClient();

  const clerkUser = await clerk.users.getUser(clerkId);

  const reservationData = {
    eventId,
    userId,
    fname: clerkUser.firstName ?? "error fname",
    lname: clerkUser.lastName ?? " error lname",
    email: clerkUser.primaryEmailAddress?.emailAddress ?? "error email",
    phone: clerkUser.primaryPhoneNumber?.phoneNumber ?? "error phone",
    time,
  };

  const newReservationId = await foodPantryDb.reservations.makeReservation(
    reservationData
  );

  return { status: "success", reservationId: newReservationId };
};

const staffReservationRequest = async ({
  formData,
  userId,
}: {
  formData: FormData;
  userId: string;
}) => {
  const submission = parseWithZod(formData, {
    schema: RequestReservationSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const clerkId = "user_" + userId;

  await requestReservation({
    eventId: submission.value.eventId,
    userId,
    clerkId,
    time: submission.value.time,
  });

  return redirect(`/events/${submission.value.eventId}/add-family`);
};

export const mutations = {
  changeStage,
  addPickupTime,
  removePickupTime,
  makeEvent,
  confirmPickup,
  staffReservationRequest,
};
