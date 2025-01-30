import { Link, Outlet, useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import type { Route } from "./+types/user-id";
import { getUserIdData } from "./data.server";


export const loader = async (args: Route.LoaderArgs) => {
  await requireAuth(args);

  const userId = args.params.userId;
  const pageData = await getUserIdData({ userId });
  return { ...pageData };
};


export default function UserId({ loaderData }: Route.ComponentProps) {

  return (
    <>
      <UserDetailsCard />
      <Outlet context={loaderData} />
    </>
  )
}


function UserDetailsCard() {
  const data = useLoaderData<typeof loader>();


  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.fname} {data.lname}</CardTitle>
      </CardHeader>
      <CardContent>
        <UserDetailList />
      </CardContent>
    </Card>
  )

}


function UserDetailList() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">


          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">
                {data.email}
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">
              Students
            </dt>
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">
                {data.students.length}
              </span>
              <span className="ml-4 shrink-0">
                <Link relative="path" to="students"
                  className="mt-2 block text-sm/6 font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </Link>
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">
              Adults
            </dt>
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">
                {data.adults}
              </span>
              <span className="ml-4 shrink-0">
                <Link relative="path" to="adults"
                  className="mt-2 block text-sm/6 font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Update
                </Link>
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </>
  )
}
