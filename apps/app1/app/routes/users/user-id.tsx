import { isRouteErrorResponse, Link, Outlet, useFetcher, useLoaderData } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import type { Route } from "./+types/user-id";
import { getUserIdData } from "./data.server";
import type { Student } from "~/services/firestore/common-types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "~/components/ui/button";


export const loader = async (args: Route.LoaderArgs) => {
  await requireAuth(args);

  const userId = args.params.userId;
  const pageData = await getUserIdData({ userId });
  return { ...pageData };
};


export default function UserId({ loaderData }: Route.ComponentProps) {
  const { fname, lname, email, students, adults } = loaderData;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{fname} {lname}</CardTitle>
          <CardDescription>
            {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            <div className=" sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">
                Students
              </dt>
              <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <span className="grow">
                  {students.length}
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
                  {adults}
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
          <Outlet context={loaderData} />
        </CardContent>
      </Card>
    </>
  )
}

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {error.status} {error.statusText}
          </CardTitle>
          <CardDescription>{error.data}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to="/users">
            <Button>
              All Users
            </Button>
          </Link>

        </CardFooter>
      </Card>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}


function UserDetailsCard() {
  const data = useLoaderData<typeof loader>();


  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.fname} {data.lname}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-gray-100">
          <div className=" sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
        <div>
          <ul className="divide-y divide-gray-100">
            {data.students.map((student: Student) => (
              <StudentRow key={student.id} student={student} />
            )
            )}
          </ul>
        </div>
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


function StudentRow({ student, }: {
  student: Student,
}) {
  const fetcher = useFetcher();

  const handleRemove = async () => {
    return fetcher.submit({ intent: "removeStudent", studentId: student.id }, { method: "post" });
  }


  return <li key={student.id} className="flex justify-between gap-x-6 py-5">
    <div className="flex min-w-0 gap-x-4">
      <div className="h-12 w-12 pt-3 flex place-content-center flex-none rounded-full bg-gray-50">
        {student.fname.charAt(0)}
      </div>
      <div className="min-w-0 flex-auto">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {student.fname} {student.lname}
        </p>
        <p className="mt-1 flex text-xs leading-5 text-gray-500">

        </p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-x-6">
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        <p className="text-sm leading-6 text-gray-900">{student.school}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          School: {student.school}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
          <span className="sr-only">
            edit
          </span>
          <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
        >
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          {/* <DropdownMenuItem>{lang.edit}</DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleRemove}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </li>
}

