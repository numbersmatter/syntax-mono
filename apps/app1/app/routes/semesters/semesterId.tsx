import type { LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/semesterId";



export const loader = async (args: LoaderFunctionArgs) => {

  const semesterInfo = {};

  return { semesterInfo };
};


export default function SemesterIdPage({
  loaderData
}: Route.ComponentProps) {
  const { semesterInfo } = loaderData;
  return (
    <div>
      <h1>SemesterId</h1>
    </div>
  );
}