import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import EventsCard from "./events-card";
import ReservationsCard from "./reservations-card";
import { getIndexPageData } from "./data.server";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/index-page";
import { requireAuth } from "~/services/auth/clerk-auth.server";

export const loader = async (args: Route.LoaderArgs) => {
  const { userId } = await requireAuth(args)
  // const testReservation = {
  //   eventName: "Test reservatopm",
  //   id: "1234",
  //   date: new Date().toLocaleDateString(),
  //   eventId: "1234",
  //   status: "approved",
  //   time: 1630,
  //   confirm: ["TEST"],
  //   time_slot: ["4:00 PM"],
  // };
  // const reservations = [testReservation]

  const { openEvents, reservations } = await getIndexPageData({ userId });

  return { reservations, openEvents };
};

export const action = async (args: ActionFunctionArgs) => {
  return null;
};

export default function IndexRoute() {
  return (
    <>
      <h1>test</h1>
      <EventsCard />
      <ReservationsCard />
    </>
  )
}