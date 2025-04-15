import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/add-family";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getAddableFamilies } from "./events-data.server";
import { Card, CardContent } from "~/components/ui/card";
import { Link, useFetcher, useParams } from "react-router";


export async function loader({ request, params }: Route.LoaderArgs) {
  await requireAuth({ request });

  const addableFamilies = await getAddableFamilies({ eventId: params.eventId });

  return { addableFamilies }

}

export async function action({ request, params }: Route.ActionArgs) {

  await requireAuth({ request });
  const formData = await request.formData();

  const intent = formData.get("intent");




  return { status: "attempt made" };
}


export default function AddFamily({ loaderData }: Route.ComponentProps) {
  const { addableFamilies } = loaderData

  return (
    <div>
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold text-gray-900">
          Add Client
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          This page allows staff to manually add clients to the event. Staff can search for clients already in the database. Once a client is found, staff can click the "Add" button to add a request for them to the event. That request will show up in the "Process Requests" tab.
        </p>
      </div>
      <Card>
        <CardContent>
          <UnaddedFamilyTable families={addableFamilies} />
        </CardContent>
      </Card>
    </div>
  )

}


type UserRow = {
  userId: string;
  fname: string;
  lname: string;
  clerkId: string;
  // email: string;
}


const columns: ColumnDef<UserRow>[] = [

  {
    accessorKey: 'fname',
    header: ({ column }) => {
      const sort = () => column.toggleSorting(column.getIsSorted() === "asc")
      const direction = column.getIsSorted()

      return (
        <Button
          variant="ghost"
          onClick={() => sort()}
        >

          First Name
          <span>
            <ArrowRight className={cn("ml-2 h-4 w-4",
              direction === "asc" && "-rotate-90",
              direction === "desc" && "rotate-90",
            )}
            />
          </span>
        </Button>
      )
    },
    cell: ({ row }) =>
      <p>{row.original.fname}</p>
  },
  {
    accessorKey: 'lname',
    header: ({ column }) => {
      const sort = () => column.toggleSorting(column.getIsSorted() === "asc")
      const direction = column.getIsSorted()

      return (
        <Button
          variant="ghost"
          onClick={() => sort()}
        >

          Last Name
          <span>
            <ArrowRight className={cn("ml-2 h-4 w-4",
              direction === "asc" && "-rotate-90",
              direction === "desc" && "rotate-90",
            )}
            />
          </span>
        </Button>
      )
    },
    cell: ({ row }) =>
      <p>{row.original.lname}</p>
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    cell: ({ row }) => <p>{row.original.userId}</p>
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <Link to={row.original.userId}> Add </Link>
  }

]

function AddFamilyFetcher({ userId, clerkId }: { userId: string, clerkId: string }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <input hidden name="userId" value={userId} />
      <input hidden name="clerkId" value={clerkId} />
      <Button>Add</Button>
    </fetcher.Form>
  )

}


function UnaddedFamilyTable({ families }: { families: UserRow[] }) {

  const { eventId } = useParams();

  return (

    <DataTable columns={columns} data={families} />

  )
} 