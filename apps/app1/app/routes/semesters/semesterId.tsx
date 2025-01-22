import type { LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/semesterId";
import { requireAuth } from "~/services/firebase-auth/auth-funcs.server";
import { getSemester } from "./db.server";



export const loader = async ({ request, params }: Route.LoaderArgs) => {
  await requireAuth({ request: request });
  const semester = await getSemester({ id: params.semesterId });


  return { semester };
};


export default function SemesterIdPage({
  loaderData
}: Route.ComponentProps) {
  const { semester } = loaderData;
  return (
    <div>
      <h1>SemesterId</h1>
      <pre>{JSON.stringify(semester, null, 2)}</pre>
    </div>
  );
}