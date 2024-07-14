"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string,
    name: string,
    symbol: string,
    img_url?: string,
    price: string,
    "1h"?: string,
    "24h"?: string,
    "7d"?: string,
    mc_long?: string,
    mc_short: string,
    vol_24h_fiat?: string,
    vol_24h_crypto?: string,
    supply?: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: ({column}) => <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">Id <ArrowUpDown className="ml-2 h-4 w-4" /></button>,
    cell: ({row}) => {
      return <div className="text-center font-medium">{row.getValue("id")}</div>
    }
  },
  {
    accessorKey: "name",
    header: ({column}) => <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center">Name <ArrowUpDown className="ml-2 h-4 w-4" /></button>,
    cell: ({row}) => {
      return <button className="font-medium flex gap-2 items-center justify-start pl-2 pr-6">
        <img src={row.original.img_url} alt={`${row.getValue("name")} icon`} className="w-4 h-4"/>
        <span>{row.getValue("name")}</span>
        </button>
    }
  },
  {
    accessorKey: "symbol",
    header: () => <div className="text-center">Symbol</div>,
    cell: ({row}) => {
      return <div className="text-center font-medium">{row.getValue("symbol")}</div>
    }
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    // cell: ({ row }) => {
    //   const price = parseFloat(row.getValue("price"))
    //   const formatted = new Intl.NumberFormat("en-US", {
    //     style: "currency",
    //     currency: "USD",
    //   }).format(price)
 
    //   return <div className="text-center font-medium">{formatted}</div>
    // },
    cell: ({ row }) => { 
      return <div className="text-center font-medium">{row.getValue("price")}</div>
    },
  },
  {
    accessorKey: "mc_short",
    header: () => <div className="text-center">Market Cap</div>,
    cell: ({row}) => {
      return <div className="text-center font-medium">{row.getValue("mc_short")}</div>
    }
  },
  {
    accessorKey: "supply",
    header: () => <div className="text-center">Supply</div>,
    cell: ({row}) => {
      return <div className="text-center font-medium">{row.getValue("supply")}</div>
    }
  },
  {
    accessorKey: "vol_24h_fiat",
    header: () => <div className="text-center">{`Volume(24 Hour)`}</div>,
    cell: ({row}) => {
      return <div className="text-center font-medium">{row.getValue("vol_24h_fiat")}</div>
    }
  },

]
