import { useLoaderData, Link } from "react-router";
import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import type { loader } from "./index-page";



export default function EventsCard() {
  const { openEvents } = useLoaderData<typeof loader>()

  const events = openEvents.map((event) => {
    return {
      ...event,
      eventDate: new Date(event.eventDate).toLocaleDateString(),
    }
  })



  return (
    <div className="p-0 md:py-8 md:px-4">
      <Card className={" "}>
        <CardHeader>
          <CardTitle>Open for Reservations</CardTitle>
          <CardDescription>
            Reserve your spot for an event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Tracking Code</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                return (
                  <TableRow key={event.id}>
                    {/* <TableCell className="hidden sm:table-cell">
                      <CarIcon
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        width="64"
                      />
                    </TableCell> */}
                    <TableCell className="font-medium">
                      {event.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.eventDate}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/events/${event.id}`} className="text-primary">
                        <Button variant="outline">
                          Request
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
        {/* <pre>{JSON.stringify(events, null, 2)}</pre> */}
        <CardFooter>
          <div className="text-xs text-muted-foreground">

          </div>
        </CardFooter>
      </Card>
    </div>

  )
}
