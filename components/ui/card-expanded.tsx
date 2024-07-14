"use client"

import React from 'react'
import moment from 'moment'
import { Alata } from "next/font/google";
import { PairData } from '@/lib/aggregator';
import Link from 'next/link';
// import {images} from "@/db/commonDb.json"

const alata = Alata({weight: "400", subsets: ["latin"]});

type Data = {
  pair: string;
  providerData: {
      provider: string;
      decimal: any;
      value: any;
      price: number;
  }[];
  average: string;
  pairData: PairData;
  lastUpdated: number;
}


 const images = {
  "aud/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/aud.png",
  "eur/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/eur.png",
  "gbp/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/gbp.png",
  "xau/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/xau.png",
  "btc/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/btc.png",
  "dai/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/dai.png",
  "eth/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/eth.png",
  "link/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/link.png",
  "susde/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/snx.png",
  "usdc/usd": "https://raw.githubusercontent.com/bandprotocol/band-resources/main/tokens/usdc.png",
  "default": "https://avatars.githubusercontent.com/u/107022154?v=4"
}

const categoryBindings = {
  "fx": "Forex",
  "crypto": "Cryptocurrency",
  "equity": "Equity",
  "commodities": "Commodities",
  "metals": "Metals"
}

const getCategory = (category: string) => {
if (Object.keys(categoryBindings).includes(category)) {
  /* tslint:disable-next-line */
  // @ts-ignore
  return categoryBindings[category]
} else {
  return category
}
}

const getImage = (pairString: string) => {
  // @ts-ignore
  let img_url = images[pairString]
  if (img_url) {
    return img_url
  } else {
    return images.default
  }
}

const getUrl = (pairString: string) => {
  const splitPair = pairString.split("/")
  if (splitPair.length > 1) {
    return splitPair.join("_")
  }
}

const getPrice = (value: string|number) => {
  if (typeof value == "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
     currency: "USD",
     maximumFractionDigits: 4
      }).format(value)
  }
  const float = parseFloat(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
   currency: "USD",
   maximumFractionDigits: 4
    }).format(float)
}

const CardExpanded = ({data }: {data: Data}) => {
  const [lastUpdated, setLastUpdated] = React.useState(moment().from(data.lastUpdated, true))

React.useEffect(() => {
  const interval = setInterval(() => {setLastUpdated(moment().from(data.lastUpdated, true)); console.log("interval has run")}, 60000)
  return () => clearInterval(interval)
}, [])

  return (
    <Link className='min-w-full' href={`/pair/${getUrl(data.pair)}`}>
    <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-bgSecondaryDark dark:border-neutral-700 dark:shadow-neutral-700/70 font-medium">
  <div className="p-3 xs:p-4 md:p-5 flex flex-col justify-normal  items-start gap-2">
    <h3 className="text-lg xs:text-xl font-bold text-gray-800 dark:text-white uppercase flex gap-1 xs:gap-2 sm:gap-3 items-center">
      <img className='w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full' src={getImage(data.pair)}></img>
      <span>
      {data.pair}
      </span>
    </h3>
    <p className={`${alata.className} xs:mt-2 text-xl tracking-widest`}>
      {getPrice(data.average)}
      {/* ${data.average} */}
    </p>
    <div className='mt-1 flex flex-col'>
      <span>Category:</span>
    <p className="mt-2 gap-1 hidden xs:flex">
      <span className='p-px px-3 rounded-xl bg-bgTertiaryLight dark:bg-bgPrimaryDark'>
      {getCategory(data.pairData.category)}
      </span>
    </p>
    </div>
    {data.pairData.sub_category && <div className='mt-1 flex flex-col'>
      <span>Category:</span>
    <p className="mt-2 gap-1 hidden xs:flex">
      <span className='p-px px-3 rounded-xl bg-bgTertiaryLight dark:bg-bgPrimaryDark'>
      {getCategory(data.pairData.sub_category)}
      </span>
    </p>
    </div>}
    <div className='mt-1 flex flex-col'>
      <span>Providers:</span>
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {data.providerData.map((item , index) => (<span className='p-px px-3 rounded-xl bg-bgTertiaryLight dark:bg-bgPrimaryDark' key={index}>{item.provider}</span>))}
    </div>
    </div>
    <div className='mt-1 flex flex-col'>
      <span>Provider Information:</span>
    <div className="mt-2 flex flex-wrap items-center gap-3">
      {data.providerData.map((item , index) => (
        <div className='p-px px-3 rounded-xl bg-bgTertiaryLight dark:bg-bgPrimaryDark flex flex-col gap-2'>
          <h2>{item.provider}</h2>
          <span className={`${alata.className} tracking-widest text-lg`}>{getPrice(item.price)}</span>
          <span>Network: {item.provider == "pyth" ? "pyth_evm_stable" : "eth_sepolia"}</span>
        </div>
      ))}
    </div>
    </div>
  </div>
  <div className="bg-gray-100 border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-bgPrimaryDark dark:border-neutral-700">
    <p className="mt-1 text-sm">
      Last updated {lastUpdated} ago
    </p>
  </div>
</div>
    </Link>
  )
}

export default CardExpanded