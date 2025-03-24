import {
  type ActionFunctionArgs,
  isRouteErrorResponse,
  type LoaderFunctionArgs,
  NavLink,
  Outlet,
  useLoaderData
} from 'react-router';
import { requireAuth } from '~/services/firebase-auth/auth-funcs.server';
import { getEventData } from './events-data.server';
import { cn } from '~/lib/utils';
import type { Route } from './+types/eventid-nav';
import { ChevronDownIcon } from 'lucide-react';


// import { mutations } from './data/mutations.server';
// import { getPageData } from './data/data-fetchers.server';
// import EventDetails from './components/event-details';
// import EventsHeader from './components/events-header';
// import { Route } from './+types/route';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  await requireAuth({ request });
  const eventData = await getEventData({
    eventId: params.eventId
  });



  // const eventId = args.params.eventId as string;
  // const data = await getPageData({ eventId });
  return { ...eventData }
};

export const action = async (args: ActionFunctionArgs) => {
  // await handleAuth(args);
  return null;
};

export default function Page({ loaderData }: Route.ComponentProps) {
  const { event, tabs } = loaderData;
  return (
    <>
      <div
        className="border-b border-gray-200 pb-5 pt-4 px-4 sm:pb-0"
      >
        <h3
          className="text-base font-semibold text-primary"
        >
          {event.name}
        </h3>
        <p>
          {event.eventDate.toLocaleDateString()}
        </p>
        <p>
          {event.eventDate.toLocaleTimeString()}
        </p>
        <p>
          {event.stage}
        </p>
        <div className="mt-3 sm:mt-4">

          <div className="">
            <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.to}
                  end={tab.end}
                  reloadDocument
                  className={(
                    { isActive, isPending, isTransitioning }
                  ) => {
                    const styleClasses = isActive ? 'border-indigo-500 text-accent-foreground bg-accent' : ' text-gray-500 hover:text-gray-700 hover:border-gray-300'

                    return cn(
                      styleClasses,
                      'roup relative min-w-0 flex-1 overflow-hidden px-4 py-4 text-center font-medium first:rounded-l-lg last:rounded-r-lg text-lg')
                    // : cn('border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap border-b-2 px-1 pb-4 text-lg font-medium ')
                  }
                  }
                >
                  {tab.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <Outlet context={{ loaderData }} />
    </>
  )
}




const tabs = [
  { name: 'Applied', href: '#', current: false },
  { name: 'Phone Screening', href: '#', current: false },
  { name: 'Interview', href: '#', current: true },
  { name: 'Offer', href: '#', current: false },
  { name: 'Hired', href: '#', current: false },
]

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

function HeaderSection() {
  return (
    <div className="border-b border-gray-200 pb-5 sm:pb-0">
      <h3 className="text-base font-semibold text-gray-900">Candidates</h3>
      <div className="mt-3 sm:mt-4">
        <div className="grid grid-cols-1 sm:hidden">
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            defaultValue={tabs.find((tab) => tab.current)?.name || ''}
            aria-label="Select a tab"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
          />
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                aria-current={tab.current ? 'page' : undefined}
                className={classNames(
                  tab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
                )}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}



export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}
