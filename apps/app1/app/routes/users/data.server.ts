import { getServerEnv } from "~/env.server";
import { foodPantryDb } from "~/services/firestore/firestore-connection.server";
import { createClerkClient } from "@clerk/react-router/api.server";
import { getActiveSemester } from "~/services/firestore/semesters/semesters-crud.server";
import { parseWithZod } from "@conform-to/zod";
import {
  AddStudentSchema,
  RemoveStudentSchema,
  UpdateAdultsSchema,
} from "./schemas";
import { data, redirect } from "react-router";

export const getEvents = async () => {
  const allEvents = await foodPantryDb.events.list();

  return allEvents;
};

const getApplications = async () => {
  const { semesterId } = await getActiveSemester();
  const applicationSnapshot = await foodPantryDb.applications.collection
    .where("semesterId", "==", semesterId)
    .get();

  const applicationDocs = applicationSnapshot.docs.map((doc) => doc.data());

  const applications = applicationDocs.map((application) => {
    return {
      id: application.id,
      primaryContact: application.primaryContact,
      status: application.status,
      userId: application.userId,
    };
  });

  return applications;
};

const getUserIndexData = async () => {
  const { CLERK_SECRET_KEY } = getServerEnv();
  const clerk = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
  });

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

  const applications = await getApplications();

  const allUsers = clerkUsers.map((user) => {
    const application = applications.find((app) => app.userId === user.userId);

    if (!application) {
      return {
        ...user,
        status: "error",
      };
    }

    return {
      ...user,
      status: application.status,
    };
  });
  const userDocs = await foodPantryDb.users.list();

  const userData = allUsers.map((user) => {
    const doc = userDocs.find((doc) => doc.id === user.userId);
    return {
      id: user.userId,
      fname: user.fname ?? "error",
      lname: user.lname ?? "error",
      status: doc ? "hasDoc" : "noDoc",
      lastSign: user.lastSignInAt,
      clerkId: user.clerkId,
    };
  });

  const hasDoc = clerkUsers
    .filter((user) => userDocs.find((doc) => doc.id === user.userId))
    .map((user) => {
      const doc = userDocs.find((doc) => doc.id === user.userId);
      return {
        id: user.userId,
        fname: user.fname ?? "error",
        lname: user.lname ?? "error",
        lastSign: user.lastSignInAt,
        clerkId: user.clerkId,
        students: doc?.students.length ?? 0,
      };
    });

  const noDocs = clerkUsers
    .filter((user) => !userDocs.find((doc) => doc.id === user.userId))
    .map((user) => {
      return {
        id: user.userId,
        fname: user.fname ?? "error",
        lname: user.lname ?? "error",
        lastSign: user.lastSignInAt,
        clerkId: user.clerkId,
      };
    });

  return { clerkUsers, allUsers, userData, hasDoc, noDocs };
};

const getUserIdData = async ({ userId }: { userId: string }) => {
  const { CLERK_SECRET_KEY } = getServerEnv();
  const clerkUserId = "user_" + userId;

  const clerkClient = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
  });

  try {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const userDoc = await foodPantryDb.users.read({ id: userId });
    const address = {
      street: userDoc?.address.street ?? "none",
      unit: userDoc?.address.unit ?? "none",
      city: userDoc?.address.city ?? "none",
      state: userDoc?.address.state ?? "none",
      zip: userDoc?.address.zip ?? "none",
    };

    const email = clerkUser.primaryEmailAddress?.emailAddress ?? "none";

    const fname = clerkUser.firstName ?? "No_First_Name";
    const lname = clerkUser.lastName ?? "No_Last_Name";
    const students = userDoc?.students ?? [];
    const adults = userDoc?.household_adults ?? 1;
    const phone = clerkUser.primaryPhoneNumber?.phoneNumber ?? "No Phone";

    return { address, email, fname, lname, students, adults, userId, phone };
  } catch (error) {
    throw data(`User: ${userId} not Found`, { status: 404 });
  }
};

const getUserHistoryReservations = async ({ userId }: { userId: string }) => {
  const resQuerySnap = await foodPantryDb.reservations.collection
    .where("userId", "==", userId)
    .get();

  const resDocs = resQuerySnap.docs.map((snap) => snap.data());

  const eventIds = resDocs.map((doc) => doc.eventId);

  const eventReadPromises = eventIds.map((eventId) => {
    return foodPantryDb.events.read({ eventId });
  });

  const eventPromiseArray = await Promise.allSettled(eventReadPromises);

  const eventsSuccess = eventPromiseArray
    .filter((p) => p.status === "fulfilled")
    .map((e) => e.value);

  const eventsDocs = eventsSuccess.filter((p) => p != null);

  const eventsDocsIds = eventsDocs.map((doc) => doc.id);

  //  filter to reservations with a corresponding event doc

  const resDocWEvent = resDocs.map((resDoc) => {
    const eventDoc = eventsDocs.find((event) => event.id === resDoc.eventId);
    return {
      ...resDoc,
      eventName: eventDoc ? eventDoc.name : "error name",
      eventDate: eventDoc ? eventDoc.eventDate : null,
    };
  });

  return resDocWEvent;
};

//
// Data Mutations
//

const addStudent = async ({
  formData,
  userId,
}: {
  userId: string;
  formData: FormData;
}) => {
  const submission = parseWithZod(formData, { schema: AddStudentSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  // check if user exists
  const userDoc = await foodPantryDb.users.read({ id: userId });

  // if it does exist go down the happy path
  if (userDoc) {
    await foodPantryDb.users.addStudent({
      userId,
      student: submission.value,
    });
    return redirect(`/users/${userId}`);
  }

  // if userDoc does not exist then just if clerk has user
  // if clerk has that userId it will return the userData
  // if not it will error and be caught by error boundary
  const userData = await getUserIdData({ userId });

  // create the user doc for the user

  await foodPantryDb.users.create({
    language: "en",
    email: userData.email,
    userId,
  });

  await foodPantryDb.users.addStudent({
    userId,
    student: submission.value,
  });

  return redirect(`/users/${userId}`);
};

const removeStudent = async ({
  formData,
  userId,
}: {
  formData: FormData;
  userId: string;
}) => {
  const submission = parseWithZod(formData, {
    schema: RemoveStudentSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { studentId } = submission.value;

  return await foodPantryDb.users.removeStudent({
    userId,
    studentId,
  });
};

const updateAdultsInHH = async ({ formData }: { formData: FormData }) => {
  const submission = parseWithZod(formData, {
    schema: UpdateAdultsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { userId, adults } = submission.value;

  await foodPantryDb.users.update({
    id: userId,
    updateData: {
      household_adults: adults,
    },
  });

  return redirect(`/users/${userId}`);
};

export {
  addStudent,
  removeStudent,
  getUserIndexData,
  getUserIdData,
  getUserHistoryReservations,
  updateAdultsInHH,
};
