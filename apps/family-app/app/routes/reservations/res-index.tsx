import { requireAuth } from "~/services/auth/clerk-auth.server";
import type { Route } from "./+types/res-index";
import { getReservations } from "./data.server";
import { getIndexPageData } from "../index/data.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async (args: Route.LoaderArgs) => {
  const { userId } = await requireAuth(args);
  const { reservations } = await getIndexPageData({ userId });

  return { reservations };
};

export default function ResHome() {
  return <div>
    <h1>test</h1>
  </div>;
}
