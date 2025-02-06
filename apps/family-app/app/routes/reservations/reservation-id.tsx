import { requireAuth } from "~/services/auth/clerk-auth.server";
import { getResIdData } from "./data.server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "react-router";
import type { Route } from "./+types/reservation-id";
import { Button } from "~/components/ui/button";



export const loader = async (args: Route.LoaderArgs) => {
  const { userId } = await requireAuth(args);

  const resIdData = await getResIdData({
    userId,
    reservationId: args.params.rId,
  });

  return { ...resIdData };
}


export default function ReservationCard({ loaderData }: Route.ComponentProps) {
  const { reservation, language, event } = loaderData;

  const eventDate = event.eventDate.toLocaleDateString();

  const english = {
    title: `Reservation for ${event.name} `,
    description: eventDate,
  }

  const spanish = {
    title: "Reserva",
    description: eventDate,
  }


  const lang = language === "es" ? spanish : english
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {lang.title}
        </CardTitle>
        <CardDescription>
          {lang.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8 items-center">
        <div className="grid grid-cols-1 gap-4 items-center mx-auto">
          <h5>
            Confirmation Code
          </h5>
          <p className="text-3xl text-accent-foreground font-extrabold">
            {reservation.confirm}
          </p>
          <p className="text-lg text-accent-foreground font-medium">
            Status: {reservation.status}
          </p>
          <p >
            Time Slot: {reservation.time_slot}
          </p>
        </div>
        <pre>

        </pre>
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-6 md:flex-row md:gap-8 ">

        <Link to={"/"} className="w-full md:w-auto">
          <Button>
            Back
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}