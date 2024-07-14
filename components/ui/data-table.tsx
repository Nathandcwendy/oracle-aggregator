"use client"

import * as React from "react"

import { Button } from "@/components/ui/button" 

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { PriceFeed, PriceServiceConnection } from "@pythnetwork/price-service-client"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
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
    initialState: {
      pagination: {
        pageSize: 25
      }
    }
  })

  // const [feedData, setFeedData] = React.useState<TData[]|PriceFeed[]>(data)
  
// React.useEffect(() => {
//   async function getDataAndSetWebsocket() {
//     const connection = new PriceServiceConnection("https://hermes.pyth.network");

//     const priceIds = [
//       "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD price id
//       "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
//     ];

//     const priceFeeds = await connection.getLatestPriceFeeds(priceIds);
//     if (priceFeeds) {
//       setFeedData(priceFeeds);
//       console.log(priceFeeds)
//     }
      
//     // connection.subscribePriceFeedUpdates(priceIds, (priceFeed) => {
//     //   // It will include signed price updates if the binary option was provided to the connection constructor.
//     //   console.log(priceFeed)
//     //   console.log(
//     //     `Received an update for ${priceFeed.id}: ${priceFeed.getPriceNoOlderThan(
//     //       60
//     //     )}`
//     //   );
//     // })
//     // setTimeout(() => {
//     //   connection.closeWebSocket();
//     // }, 6000);
//   };
//   getDataAndSetWebsocket()
// }, [])

  return (
    <div>
    <div className="rounded-lglg border w-full border-none bg-bgSecondaryLight dark:bg-bgSecondaryDark relative overflow-hidden [&>div]:no-scrollbar">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-bgSecondaryLight dark:border-borderSecondaryDark">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={header.id == "name" ?  `border-r last:border-none dark:border-borderPrimaryDark sticky left-0 border-borderSecondaryLight bg-bgSecondaryLight dark:bg-bgSecondaryDark` : `border-r last:border-none border-borderSecondaryLight dark:border-borderSecondaryDark bg-bgSecondaryLight dark:bg-bgSecondaryDark`}>
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
                className="border-borderSecondaryLight dark:border-borderSecondaryDark"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cell.column.id == "name" ? `border-r border-borderSecondaryLight dark:border-borderSecondaryDark last:border-none sticky left-0 bg-bgSecondaryLight dark:bg-bgSecondaryDark p-0` : `border-r border-borderSecondaryLight dark:border-borderSecondaryDark last:border-none bg-bgSecondaryLight dark:bg-bgSecondaryDark`}>
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
