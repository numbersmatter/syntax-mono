import { useLoaderData } from "react-router"
import type { Route } from "./+types/events";
import { getEvents } from "./events-data.server";



export const loader = async () => {
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
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  )
}