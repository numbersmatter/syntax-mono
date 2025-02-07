import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getReservationsAll } from "./data.server";
import type { Route } from "./+types/reserve-index";



export const loader = async ({ request }: Route.LoaderArgs) => {
  await requireAuth({ request });

  const { reservationAll } = await getReservationsAll({});
  return { reservationAll };
}



export default function ReservationIndex({ loaderData }: Route.ComponentProps) {
  const { reservationAll } = loaderData;


  return (
    <>
      <h1>Reservations</h1>
      <pre>
        {JSON.stringify(reservationAll, null, 2)}
      </pre>
    </>
  )

}