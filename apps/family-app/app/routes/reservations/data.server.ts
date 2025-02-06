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

  // if (!userProfileDoc) {
  //   throw redirect("/language");
  // }

  const language = "en";

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

const getReservations = async ({
  userId,
  eventIds,
}: {
  userId: string;
  eventIds: string[];
}) => {
  const reservationDocs = await foodPantryDb.reservations.checkUserReservations(
    {
      userId,
      eventIdArray: eventIds,
    }
  );

  // const testReservation ={
  //   id: "test-1",
  //   eventName: "Test Event",
  //   date: new Date("11-14-2024"),
  //   time_slot: "4:00 PM",
  //   confirm: "TEST",
  //   status: "approved",
  // }

  // return [ testReservation]

  return reservationDocs.map((doc) => {
    return {
      id: doc.id,
      eventId: doc.eventId,
      time: doc.time,
      confirm: doc.confirm,
      status: doc.status,
    };
  });
};

export { getResIdData, getReservations };

//
// Data
// Mutations
//
