import { createClerkClient } from "@clerk/react-router/api.server";
import { getServerEnv } from "~/env.server";

export const getClerkClient = () => {
  const { CLERK_SECRET_KEY } = getServerEnv();
  const clerk = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
  });

  return clerk;
};

export const getUserIdClerkData = async ({ userId }: { userId: string }) => {
  const { CLERK_SECRET_KEY } = getServerEnv();
  const clerkUserId = "user_" + userId;

  const clerkClient = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
  });

  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  return clerkUser;
};

export const getClerkDataFromUserIds = async ({
  userIds,
}: {
  userIds: string[];
}) => {
  const { CLERK_SECRET_KEY } = getServerEnv();
  // const clerkUserId = "user_" + userId;

  const clerkClient = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
  });

  const p = userIds.map((id) => {
    const clerkUserId = "user_" + id;

    const clerkUser = clerkClient.users.getUser(clerkUserId);
    return clerkUser;
  });

  const clerkUsersReads = await Promise.allSettled(p);

  const clerkUsers = clerkUsersReads
    .filter((r) => r.status == "fulfilled")
    .map((d) => d.value)
    .filter((v) => v)
    .map((u) => {
      return {
        firstName: u.firstName,
        lastName: u.lastName,
      };
    });

  return clerkUsers;
};
