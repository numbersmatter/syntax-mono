import { createClerkClient } from "@clerk/react-router/api.server";
import { getServerEnv } from "~/env.server";

export const getClerkClient = () => {
  const { CLERK_SECRET_KEY } = getServerEnv();
  const clerk = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
  });

  return clerk;
};
