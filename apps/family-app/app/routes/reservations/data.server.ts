import { redirect } from "react-router";
import { convertTo12Hour } from "~/lib/utils";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";

//
// Data
// Fetchers
//

const getResIdData = async ({
  userId,
  reservationId,
}: {
  userId: string;
  reservationId: string;
}) => {
  const userProfileDoc = await foodPantryDb.users.read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const language = userProfileDoc.language;

  const reservationDoc = await foodPantryDb.reservations.read(reservationId);
  if (!reservationDoc) {
    throw redirect("/home");
  }

  // const docTime = reservationDoc.time.toString();

  // const hour = docTime.substring(0, 2);
  // const minute = docTime.substring(2, 4);

  // const timeSlot = hour + ":" + minute;

  const time_slot = convertTo12Hour(reservationDoc.time);

  const reservation = {
    ...reservationDoc,
    time_slot,
  };

  const reservationUserId = reservationDoc.userId;

  if (reservationUserId !== userId) {
    throw redirect("/home");
  }
  const eventDoc = await foodPantryDb.events.read({
    eventId: reservationDoc.eventId,
  });

  if (!eventDoc) {
    throw redirect("/");
  }

  return { language, reservation, event: eventDoc };
};

export { getResIdData };

//
// Data
// Mutations
//
