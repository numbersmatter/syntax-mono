import {
  type DocumentData,
  FieldValue,
  type Firestore,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import { makeConfirmationCode } from "../make-confirm-code";
import type * as m from "./reservation-types";

interface ReserveConverter
  extends FirestoreDataConverter<m.ReservationAppModel, m.ReservationDbModel> {}

const firestoreConverter: ReserveConverter = {
  toFirestore: (reservation: m.ReservationAppModel) => {
    return {
      id: reservation.id,
      createdTimestamp: Timestamp.fromDate(reservation.createdDate),
      updatedTimestamp: Timestamp.fromDate(reservation.updatedDate),
      eventId: reservation.eventId,
      status: reservation.status,
      time: reservation.time,
      primaryContact: reservation.primaryContact,
      userId: reservation.userId,
      confirm: reservation.confirm,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.ReservationDbModel>) => {
    const createdDate = snapshot.data()?.createdDate
      ? //@ts-expect-error
        snapshot.data()?.createdDate.toDate()
      : snapshot.data().createdTimestamp.toDate();

    const updatedDate = snapshot.data().updatedTimestamp
      ? snapshot.data().updatedTimestamp.toDate()
      : new Date();

    const details = snapshot.data().deliveryDetails;

    const deliveredDate = details?.deliveryTimestamp.toDate();

    const deliveryDetails = snapshot.data().deliveryDetails
      ? {
          status: details?.status as m.DeliveryStatuses,
          staffId: details?.staffId as string,
          deliveredDate: deliveredDate as Date,
        }
      : undefined;

    return {
      id: snapshot.id,
      userId: snapshot.data().userId,
      createdDate,
      updatedDate,
      eventId: snapshot.data().eventId,
      status: snapshot.data().status,
      time: snapshot.data().time,
      confirm: snapshot.data().confirm,
      primaryContact: snapshot.data().primaryContact,
      deliveryDetails,
    };
  },
};

export const reservationsDb = ({
  firestore,
  path,
}: {
  firestore: Firestore;
  path: string;
}) => {
  const collectionWrite = firestore.collection(path);

  const collectionRead = firestore
    .collection(path)
    .withConverter(firestoreConverter);

  const read = async (id: string) => {
    const docSnap = await collectionRead.doc(id).get();
    const doc = docSnap.data();
    if (typeof doc === "undefined") {
      return null;
    }
    return doc;
  };

  const list = async () => {
    const querySnapshot = await collectionRead.get();
    const docs = querySnapshot.docs.map((doc) => doc.data());
    return docs;
  };

  const listByEvent = async ({ eventId }: { eventId: string }) => {
    const querySnapshot = await collectionRead
      .where("eventId", "==", eventId)
      .get();

    const docs = querySnapshot.docs.map((doc) => doc.data());

    return docs;
  };

  const makeReservation = async ({
    eventId,
    userId,
    fname,
    time,
    email,
    phone,
    lname,
  }: {
    eventId: string;
    userId: string;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    time: number;
  }) => {
    const reservationDocRef = collectionWrite.doc();
    const confirmCode = makeConfirmationCode(4);

    const reservationData = {
      id: reservationDocRef.id,
      createdTimestamp: FieldValue.serverTimestamp(),
      updatedTimestamp: FieldValue.serverTimestamp(),
      eventId: eventId,
      status: "pending",
      time: time,
      confirm: confirmCode,
      primaryContact: {
        fname,
        lname,
        email,
        phone,
      },
      userId,
    };

    await reservationDocRef.set(reservationData);

    return reservationDocRef.id;
  };

  // const listOpen = async () => {
  //   const requestReadyEvents = await readReservationCollection
  //     .where("stage", "==", "open-for-requests")
  //     .get();
  //   const requestDocs = requestReadyEvents.docs.map((doc) => doc.data());

  //   const pickupReadyEvents = await readReservationCollection
  //     .where("stage", "==", "open-for-pickups")
  //     .get();

  //   const pickupDocs = pickupReadyEvents.docs.map((doc) => doc.data());

  //   return [...requestDocs, ...pickupDocs];
  // };

  const checkReservation = async ({
    userId,
    eventId,
  }: {
    userId: string;
    eventId: string;
  }) => {
    const querySnapshot = await collectionRead
      .where("userId", "==", userId)
      .where("eventId", "==", eventId)
      .get();
    const docs = querySnapshot.docs.map((doc) => doc.data());

    if (docs.length === 0) {
      return null;
    }

    return docs[0];
  };

  const update = async ({ id, data }: { id: string; data: DocumentData }) => {
    const updateData = {
      ...data,
      updatedDate: FieldValue.serverTimestamp(),
    };
    return await collectionRead.doc(id).update(updateData);
  };

  const checkUserReservations = async ({
    userId,
    eventIdArray,
  }: {
    userId: string;
    eventIdArray: string[];
  }) => {
    if (eventIdArray.length === 0) {
      return [];
    }
    const querySnapshot = await collectionRead
      .where("userId", "==", userId)
      .where("eventId", "in", eventIdArray)
      .get();
    const docs = querySnapshot.docs.map((doc) => doc.data());

    return docs;
  };

  return {
    read,
    list,
    makeReservation,
    checkReservation,
    listByEvent,
    update,
    checkUserReservations,
    collection: collectionRead,
    untypedCollection: collectionWrite,
    // listOpen,
  };
};
