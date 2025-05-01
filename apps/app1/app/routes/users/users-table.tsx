import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table"
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Link } from "react-router";

type UserRow = {
  id: string;
  fname: string;
  lname: string;
  status: string;
  // email: string;
}

type UserHasDoc = {
  id: string;
  fname: string;
  lname: string;
  lastSign: number | null;
  clerkId: string;
  students: number;
}

const hasDocsColumns: ColumnDef<UserHasDoc>[] = [
  {
    accessorKey: 'fname',
    header: 'First Name',
    cell: ({ row }) =>
      <Link to={`/users/${row.original.id}`}>{row.original.fname}</Link>
  },
  {
    accessorKey: 'lname',
    header: 'Last Name',
    cell: ({ row }) =>
      <Link to={`/users/${row.original.id}`}>{row.original.lname}</Link>

  },
  {
    accessorKey: 'students',
    header: ({ column }) => {
      const sort = () => column.toggleSorting(column.getIsSorted() === "asc")
      const direction = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => sort()}
        >
          Students
          <span>
            <ArrowRight className={cn("ml-2 h-4 w-4",
              direction === "asc" && "-rotate-90",
              direction === "desc" && "rotate-90",
            )}
            />
          </span>
        </Button>
      )
    }
  },
  {
    accessorKey: 'lastSign',
    header: 'Last Sign In',
  },

]

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
      <Link to={`/users/${row.original.id}`}>{row.original.fname}</Link>
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
      <Link to={`/users/${row.original.id}`}>{row.original.lname}</Link>
  },

]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


export function UserDataTable({

  data,
}: { data: UserRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
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
    </div>
  )
}


function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export function UsersMissingDocsTable({
  usersMissingDocs
}: {
  usersMissingDocs: UserRow[]
}) {

  return <DataTable columns={columns} data={usersMissingDocs} />
}

export function UsersHasDocsTable({
  usersHasDocs
}: {
  usersHasDocs: UserHasDoc[]
}) {

  return <DataTable columns={hasDocsColumns} data={usersHasDocs} />
}




type EventPageEvent ={
  id: string;
  name: string;
  date: string;
  status: string;
}


function TestTable() {
  const data = [
    {
      id: "1",
      name: "Event 1",
      date: "2023-10-01",
      status: "upcoming"
    },
    {
      id: "2",
      name: "Event 2",
      date: "2023-10-02",
      status: "upcoming"
    },
    {
      id: "3",
      name: "Event 3",
      date: "2023-10-03",
      status: "upcoming"
    },
  ]

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ]


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
   
    getSortedRowModel: getSortedRowModel(),
  })

  return <DataTable columns={columns} data={data} />
}