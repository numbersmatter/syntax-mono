
import { Link, useLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getUserIndexData } from "./data.server";
import type { Route } from "./+types/users-index";
import { UserDataTable, UsersHasDocsTable, UsersMissingDocsTable } from "./users-table";


export const loader = async (args: Route.LoaderArgs) => {
  await requireAuth(args);
  const data = await getUserIndexData();
  return { ...data };
};



export default function ClerkUsersList() {
  const { clerkUsers, userData, hasDoc, noDocs } = useLoaderData<typeof loader>();



  return (
    <>
      <UsersNoDocs noDocs={noDocs} />
      <UsersWithDocs hasDoc={hasDoc} />
    </>

  )
}

function UsersWithDocs({ hasDoc }: { hasDoc: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users With Docs</CardTitle>
        <CardDescription>
          Users with documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersHasDocsTable usersHasDocs={hasDoc} />
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  )
}
function UsersNoDocs({ noDocs }: { noDocs: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users No Info</CardTitle>
        <CardDescription>
          Users without family information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersMissingDocsTable usersMissingDocs={noDocs} />
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  )
}




const UserList = ({ clerkUsers }: { clerkUsers: any[] }) => {

  return <ul
    role="list"
    className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
  >
    {clerkUsers.map((user) => {
      const lastSignInAt = user.lastSignInAt
        ? new Date(user.lastSignInAt).toLocaleDateString()
        : "Never signed in";

      return (
        <li key={user.clerkId} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
          <Link to={`/users/${user.userId}`}>
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {user.fname} {user.lname}
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                Last Signed-in: {lastSignInAt}
              </p>
            </div>
          </Link>

        </li>

      )
    })}
  </ul>
}