import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/userid-index";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Student } from "~/services/firestore/common-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { removeStudent } from "./data.server";

export async function action({ request, params }: Route.ActionArgs) {
  await requireAuth({ request });
  const formData = await request.formData();

  const intent = formData.get("intent");

  if (intent === "removeStudent") {
    const studentId = formData.get("studentId");
    return await removeStudent({ formData, userId: params.userId });
  }

  return {};
}



export default function UserIdIndex({ matches }: Route.ComponentProps) {
  const routedata = matches[2]

  const data = routedata.data

  return (

    <ul className="divide-y divide-gray-100">
      {data.students.map((student: Student) => (
        <StudentRow key={student.id} student={student} />
      )
      )}
    </ul>

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




function UserDetailList({ data }: { data: any }) {

  return (
    <>
      <div>
        <ul className="divide-y divide-gray-100">
          {data.students.map((student: Student) => (
            <StudentRow key={student.id} student={student} />
          )
          )}
        </ul>
      </div>

    </>
  )
}
