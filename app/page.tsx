import { DataTable } from "@/components/ui/data-table";
import Image from "next/image";
import { Payment, columns } from "./columns";
import { getData } from "@/lib/prepareData";
import * as React from "react"
import { Divide } from "lucide-react";

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
      {data.map((item, index) => (<div key={index}>
        {typeof item == "string" ? <span>{item}</span> : <>
        <h1>
          {item.pair}
          </h1>
        <h1>
          {item.average}
          </h1>
        <h1>
          {item.pairData.category}
          </h1>
        <h1>
          {item.providerData[0].provider}: {item.providerData[0].price}
          </h1>
        <h1>
          {item.providerData[1].provider}: {Number(item.providerData[1].price)}
          </h1>

          </>}
      </div>))}
    {/* <DataTable columns={columns} data={data} /> */}
    </div>
  </main>
  );
}
