import { getAuth } from "@clerk/react-router/ssr.server";
import { createClerkClient } from "@clerk/react-router/api.server";

import {
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { getServerEnv } from "~/env.server";

export const getClerkAuth = async (args: LoaderFunctionArgs) => {
  
  const clerkAuth = await getAuth(args);

  const { CLERK_SECRET_KEY } = getServerEnv();
  const secretKey = CLERK_SECRET_KEY;

  if (!clerkAuth.userId) {
    return {
      userId: null,
      email: null,
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
  };
};

const requireAuth = async (args: LoaderFunctionArgs) => {
  const clerkAuth  = await getAuth(args);

  if(!clerkAuth.userId) {
    return  redirect("/sign-in");
  }
  
  return clerkAuth;
};

export { requireAuth };
