import { getAuth } from "@clerk/react-router/ssr.server";
import { createClerkClient } from "@clerk/react-router/api.server";

import {
  type LoaderFunction,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { getServerEnv } from "~/env.server";

export const getClerkAuth = async (args: LoaderFunctionArgs) => {
  // @ts-expect-error the auth expects a more defined type
  const clerkAuth = await getAuth(args);

  const { CLERK_SECRET_KEY, SIGN_IN_PATH } = getServerEnv();
  const secretKey = CLERK_SECRET_KEY;

  if (!clerkAuth.userId) {
    return {
      userId: null,
      email: null,
      SIGN_IN_PATH,
    };
  }

  const user = await createClerkClient({ secretKey }).users.getUser(
    clerkAuth.userId
  );

  //  clerk prefixs userId with "user_"
  const userId = clerkAuth.userId.split("_", 2)[1];

  const email = user.primaryEmailAddress?.emailAddress as string;
  const phone = user.primaryPhoneNumber?.phoneNumber as string;
  const lname = user.lastName as string;
  const fname = user.firstName as string;

  return {
    userId,
    email,
    phone,
    lname,
    fname,
    SIGN_IN_PATH,
  };
};

const requireAuth = async (args: LoaderFunctionArgs) => {
  // const userId = "bROxxo3adedzFYFaOy7t"

  // const email = "test@testemail.com"
  // const phone = "555-555-555"
  // const fname = "test"
  // const lname= "user"

  const { SIGN_IN_PATH, userId, email, phone, fname, lname } =
    await getClerkAuth(args);

  if (!userId) {
    throw redirect(SIGN_IN_PATH);
  }

  return {
    userId,
    email,
    phone,
    fname,
    lname,
  };
};

export { requireAuth };
