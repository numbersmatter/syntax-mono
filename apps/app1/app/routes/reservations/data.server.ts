import { parseWithZod } from "@conform-to/zod";
import { data, redirect } from "react-router";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";
import { ApproveReservaitonSchema } from "./schemas";

//
// Data Fetchers
//

const getReservationsAll = async ({}: {}) => {
  const reservationAll = await foodPantryDb.reservations.list();

  return { reservationAll };
};

const getResIdData = async ({ reservationId }: { reservationId: string }) => {
  const reservationDoc = await foodPantryDb.reservations.read(reservationId);
  if (!reservationDoc) {
    throw data("Not Found", {
      status: 404,
      statusText: "Reservation Not Found",
    });
  }

  return { reservation: reservationDoc };
};

export { getResIdData, getReservationsAll };

//
// Data
// Mutations
//

const approveReservation = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, {
    schema: ApproveReservaitonSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await foodPantryDb.reservations.update({
    id: submission.value.reservationId,
    data: {
      status: "approved",
    },
  });

  return;
};

const waitlistReservation = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, {
    schema: ApproveReservaitonSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await foodPantryDb.reservations.update({
    id: submission.value.reservationId,
    data: {
      status: "waitlist",
    },
  });

  return submission.reply();
};

const declineReservation = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, {
    schema: ApproveReservaitonSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await foodPantryDb.reservations.update({
    id: submission.value.reservationId,
    data: {
      status: "declined",
    },
  });

  return submission.reply();
};

export const mutations = {
  approveReservation,
  waitlistReservation,
  declineReservation,
};
