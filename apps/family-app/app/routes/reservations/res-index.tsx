import { requireAuth } from "~/services/auth/clerk-auth.server";
import type { Route } from "./+types/res-index";
import { getIndexPageData } from "../index/data.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await requireAuth(args);
  const { reservations } = await getIndexPageData({ userId });

  return { reservations };
};

export default function ResHome({ loaderData }: Route.ComponentProps) {
  const { reservations } = loaderData;
  return <div>
    <h1>test</h1>
    <pre>
      {JSON.stringify(reservations, null, 2)}
    </pre>
  </div>;
}
