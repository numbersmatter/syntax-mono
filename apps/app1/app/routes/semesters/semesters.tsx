/* eslint-disable react/react-in-jsx-scope */
import { ChevronRightIcon, PackageOpenIcon } from 'lucide-react';
import { Link, type LoaderFunctionArgs } from 'react-router';
import type { Route } from './+types/semesters';
import { listItems } from './db.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const testsemester = {
    id: '1',
    name: 'Spring 2025',
    type: 'Semester',
  };

  const semesters = [testsemester];
  const items = await listItems();

  return { semesters, items };
}

export default function SemestersPage({ loaderData }: Route.ComponentProps) {
  const { semesters } = loaderData;
  return (
    <>
      <h1>Semesters</h1>
      <div>
        <Link to="/semesters/create">Create Semester</Link>
      </div>
      <ul
        role="list"
        className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        {semesters.map((semester) => (
          <li
            key={semester.id}
            className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
          >
            <div className="flex min-w-0 gap-x-4">
              <PackageOpenIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />

              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <Link to={`/semesters/${semester.id}`}>
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {semester.name}, {semester.type}
                  </Link>
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  test
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">stage</p>
              </div>
              <ChevronRightIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
