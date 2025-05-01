
import { CalendarDateRangeIcon } from '@heroicons/react/16/solid';
import type { Event } from '../mock/types';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/table';
import { mockEvents } from '~/mock/data';
import { CalendarDaysIcon } from '@heroicons/react/20/solid';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table"
import { Pagination, PaginationGap, PaginationList, PaginationNext, PaginationPage, PaginationPrevious } from '~/components/pagination';
import { Button } from '~/components/button';
import { requireAuth } from '~/services/clerk-auth.server';
import type { Route } from './+types/events-page';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader, serializeCookieHeader  } from '@supabase/ssr';
import { getServerEnv } from '~/env.server';
import type { Database } from '~/supabase/database';


type EventPageEvent ={
  id: string;
  name: string;
  date: string;
  status: string;
}





export async function loader(args: Route.LoaderArgs) {
  await requireAuth(args);
  // Create a single supabase client for interacting with your database
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();;
  const supabase =  createClient<Database>(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  )

  const { data, error } = await supabase
    .from('events')
    .select('*')
  
    console.log("events", data);
  if (error) {
    console.error("Error fetching events:", error);

  }



  const events = data 
  ?  data.map((event) => {

      return {
        id: event.id,
        name: event.name,
        date: event.start_date,
        status: event.status,
      } as EventPageEvent
    })
  : [] as EventPageEvent[];

 





  return {events, error};
}





export default function EventsPage({loaderData} : Route.ComponentProps) {
  const navigate = useNavigate();

  const { events } = loaderData;

  const onEventClick = (eventId: string) => navigate(`/events/${eventId}`);


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">
            Events
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all events by event date.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            New Event
          </button>
        </div>
      </div>
      <EventsTable />
      <pre className="mt-6">
        <code className="text-sm text-gray-500">
          {JSON.stringify(events, null, 2)}
        </code>
      </pre>
    </div>
  )
}


const columns: ColumnDef<EventPageEvent>[] = [
  {
    id: 'id',
    header: () => <span>ID</span>,
    cell: ({ row }) => {
      const id = row.getValue('id');
      return (
        <a href={`/events/${id}`} className="text-blue-600 hover:underline">
          {id}
        </a>
      );
    },
  },
   
    {
      id: 'name',
      header: () => <span>Name</span>,
    },
    {
      id: 'date',
      header: () => <span>Date</span>,
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'status',
      header: () => <span>Status</span>,
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof statusConfig;
        const statusConfig = {
          planning: { color: 'bg-gray-100 text-gray-800' },
          ordering: { color: 'bg-green-100 text-green-800' },
          pickup: { color: 'bg-blue-100 text-blue-800' },
          finished: { color: 'bg-purple-100 text-purple-800' }
        };
        return <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color}`}>
          {status.replace('_', ' ').split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </div>;
      },
    },
  ]



function EventsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const {events} = useLoaderData<typeof loader>();

  const columnHelper = createColumnHelper<EventPageEvent>()






  const table = useReactTable({
    datas:events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  
  })

  // const statusConfig = {
  //   planning: { color: 'bg-gray-100 text-gray-800' },
  //   open_orders: { color: 'bg-green-100 text-green-800' },
  //   open_pickups: { color: 'bg-blue-100 text-blue-800' },
  //   finished: { color: 'bg-purple-100 text-purple-800' }
  // };


  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHeader key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHeader>
                    )
                  })}
                </TableRow>
              ))}
            </TableHead>
            {/* <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    href={`/events/${row.original.id}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <Button
              outline
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label='Previous Page'
            >
              <svg className="stroke-current" data-slot="icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous
            </Button>
            <Button
              outline
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <svg className="stroke-current" data-slot="icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>

          </div>
        </div>
      </div>
    </div>
  )
}








function PageHeader() {
  return (

    <div
      className="flex items-center justify-between border-b border-gray-200 pb-5"
    >
      <div className="flex items-center gap-2">
        <CalendarDateRangeIcon className="w-6 h-6 text-indigo-600" />
        <h1 className="text-3xl font-semibold text-gray-900">
          Events
        </h1>
      </div>
      <button
        type="button"
        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Create New Event
      </button>
    </div>
  )
}


function EventsSectionHeader() {
  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-base font-semibold text-gray-900">Job Postings</h3>
      <div className="mt-3 sm:mt-0 sm:ml-4">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create New Event
        </button>
      </div>
    </div>
  )
}




