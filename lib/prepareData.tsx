import avaliableData from "@/db/commonDb.json"
import { aggregatorInstance, getManyAggregates } from "./aggregator"

const aggregator = aggregatorInstance()

const pairsDataArr = avaliableData.pyth_evm_stable

// type AggregatorData = AggregatorPairData[]

// type AggregatorPairData = {
//   pair: string,
//   providerData: ProviderData[]
//   average: string,
//   pairData: PairData
// }


// type PairData = {
//   pair: string,
//   address?: string,
//   category: string,
//   decimal?: string,
//   sub_category?:string|null
// }

// type ProviderData = {
//     provider: "pyth"|"chainlink",
//     decimal: string|number,
//     value: string|number,
// }

export const getData  = async () => {
 const data = await getManyAggregates(pairsDataArr, aggregator)
 return data
}
