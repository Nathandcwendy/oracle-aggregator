import { DataTable } from "@/components/ui/data-table";
import Image from "next/image";
import { Payment, columns } from "./columns";
import { getData } from "@/lib/prepareData";
import * as React from "react"
import { Divide } from "lucide-react";
import Card from "@/components/ui/card";


type AggregatorData = AggregatorPairData[]

type AggregatorPairData = {
  pair: string,
  providerData: ProviderData[]
  average: string,
  pairData: PairData
}


type PairData = {
  pair: string,
  address?: string,
  category: string,
  decimal?: string,
  sub_category?:string|null
}

type ProviderData = {
    provider: "pyth"|"chainlink",
    decimal: string|number,
    value: string|number,
}

async function delay(ms: number): Promise<null> {
  return new Promise((res) => {setTimeout(res, ms)})
}

export const dynamic = "force-dynamic"

export default async function Home() {
  const data = await getData();
  return (
    <main className="w-full lg:ps-64">
    <div className="p-2 py-4 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-x-6 gap-y-6 p-6 md:p-2 justify-items-center">
      {data.map((item, index) => (typeof item != "string" ? <Card key={index} data={item} /> : "item"))}
      </div>
    {/* <DataTable columns={columns} data={data} /> */}
    
    </div>
  </main>
  
  );
}
