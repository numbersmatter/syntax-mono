import { Link, useLoaderData } from "react-router"
import type { Route } from "./+types/events";
import { getEvents } from "./events-data.server";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";



export const loader = async ({ request }: Route.LoaderArgs) => {
  await requireAuth({ request });
  const events = await getEvents();
  return { events };
};




export default function EventsIndex({ loaderData }: Route.ComponentProps) {
  const { events } = loaderData;

  return (
    <div>
      <h1>Events Index</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>

            <Link to={`/events/${event.id}`} >{event.name}- {event.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}