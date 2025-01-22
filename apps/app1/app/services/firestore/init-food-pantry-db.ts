import { getFirestore } from "firebase-admin/firestore";
import { applicationsDb } from "./applications/applications-crud.server";
import { eventsDb } from "./events/crud.server";
import type { EventStage, EventType } from "./events/event-types";
import { initFirebase } from "./firestore";
import { registrationsDb } from "./registrations/registrations-crud.server";
import { reservationsDb } from "./reservations/crud.server";
import { UserDb } from "./users/crud.server";
import { semesterDb } from "./semesters/semesters-crud.server";

// This is your packages entry point, everything exported from here will be accessible to the end-user.

type CollectionPaths = {
  applications?: string;
  events?: string;
  registrations?: string;
  reservations?: string;
  users?: string;
};

export const initializeFirestoreFoodPantryDb = ({
  FIREBASE_APP_NAME,
  SERVICE_ACCOUNT,
  collectionPaths,
}: {
  FIREBASE_APP_NAME: string;
  SERVICE_ACCOUNT: string;
  collectionPaths: Record<string, string>;
}) => {
  const fireApp = initFirebase({ FIREBASE_APP_NAME, SERVICE_ACCOUNT });
  const firestore = getFirestore(fireApp);

  const applicationsPath = collectionPaths.applications ?? "applications";
  const eventsPath = collectionPaths.events ?? "events";
  const registrationsPath = collectionPaths.registrations ?? "registrations";
  const reservationsPath = collectionPaths.reservations ?? "reservations";
  const usersPath = collectionPaths.users ?? "users";
  const semesterPath = collectionPaths.semesters ?? "semesters";

  const applications = applicationsDb({ firestore, path: applicationsPath });
  const events = eventsDb({ firestore, path: eventsPath });
  const registrations = registrationsDb({ firestore, path: registrationsPath });
  const reservations = reservationsDb({ firestore, path: reservationsPath });
  const users = UserDb({ firestore, path: usersPath });
  const semesters = semesterDb({ firestore, path: semesterPath });

  const foodPantryDb = {
    applications,
    events,
    registrations,
    reservations,
    users,
    semesters,
  };
  return {
    foodPantryDb,
  };
};

export type { EventType, EventStage };
