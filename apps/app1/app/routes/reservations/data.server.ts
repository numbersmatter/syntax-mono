import { parseWithZod } from "@conform-to/zod";
import { data, redirect } from "react-router";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";
import { ApproveReservaitonSchema } from "./schemas";

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

export { getResIdData };

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

  return redirect(`/events/${submission.value.eventId}`);
};

export const mutations = { approveReservation };
