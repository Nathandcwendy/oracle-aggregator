import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { Web3 } from "web3";
import pythData from "@/db/pyth-id.json";
import chainlinkData from "@/db/chainlink.json";

export type PairData = {
  pair: string,
  address?: string,
  category: "fx"|"crypto"|"equity"|"commodities"|"rates"|string,
  decimal?: string,
  sub_category?:string|null,
}

class Aggregator {
  #aggregatorV3InterfaceABI = [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "description",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
      name: "getRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "version",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];
  #pythConnection;
  #web3;
  #pythData;
  #chainlinkData;
  constructor(pythData: any, chainlinkData: any) {
    this.#pythConnection = new PriceServiceConnection(
      "https://hermes.pyth.network"
    );
    this.#web3 = new Web3("https://rpc.ankr.com/eth_sepolia");
    this.#pythData = pythData;
    this.#chainlinkData = chainlinkData
    }
  #getPyth = (pairString: string): [null, null, string]|[PriceServiceConnection, string[], null] => {
    const pythPriceIds = [];
    const getPairAddress = (pairString: string) => {
      const pairData = this.#pythData.pyth_evm_stable.all.find((i:PairData) => i.pair == pairString)
      if (pairData) {
        return pairData.address
      } else {
        return null
      }
    }
    const address = getPairAddress(pairString)
    if (address) {
      pythPriceIds.push(address);
    }
    if (pythPriceIds.length > 0) {
      return [this.#pythConnection, pythPriceIds, null];
    } else {
      return [null, null, "invalid pair"];
    }
  };
  #getChainlink = (pairString: string):[null, null, string]|[any, string, null] => {
    const pair = this.#chainlinkData.all.find((i: PairData) => i.pair == pairString);
    if (!pair) {
      return [null, null, "invalid pair"];
    }
    const addr = pair.address;
    const priceFeed = new this.#web3.eth.Contract(
      this.#aggregatorV3InterfaceABI,
      addr
    );
    return [priceFeed.methods.latestRoundData(), pair.decimal, null];
  };
  #getAverage = (x:string|number, y:string|number): string => ((Number(x) + Number(y)) / 2).toFixed(5);
  aggregate = async (pairData: PairData) => {
    const promisesArr = [];
    const pairString = pairData.pair
    const [pythConnection, pythPriceIds, err] = this.#getPyth(pairString);
    if (!err && pythConnection != null) {
      promisesArr.push(pythConnection.getLatestPriceFeeds(pythPriceIds));
    } else {
      return "an error occured, please reload"
    }
    const [chainlinkMethod, chainlinkDecimal, errChainlink] =
      this.#getChainlink(pairString);
    if (!errChainlink && chainlinkMethod) {
      promisesArr.push(chainlinkMethod.call());
    } else {
      return "an error occured, please reload"
    }
    if (promisesArr.length > 1) {
      const [pythValue, chainlinkValue] = await Promise.all(promisesArr);
      const pythPrice =
        Number(pythValue[0].price.price) *
        10 ** Number(pythValue[0].price.expo);
      const chainlinkPrice =
        Number(chainlinkValue.answer) * 10 ** -Number(chainlinkDecimal);
      const average = this.#getAverage(pythPrice, chainlinkPrice);
      return {
        pair: pairString,
        providerData: [
          {
            provider: "pyth",
            decimal: pythValue[0].price.expo,
            value: pythValue[0].price.price,
            price: pythPrice
          },
          {
            provider: "chainlink",
            decimal: chainlinkDecimal,
            value: chainlinkValue.answer,
            price: chainlinkPrice
          },
        ],
        average,
        pairData,
        lastUpdated: Date.now()
      };
    } else {
      return "invalid pair";
    }
  };
}

export const getManyAggregates = async (pairArr: PairData[], aggregator: Aggregator) => {
  let result = [];
  for (const [, value] of pairArr.entries()) {
    const res = await aggregator.aggregate(value);
    result.push(res)
  }
  return result;
};

export const aggregatorInstance = () => {
  return new Aggregator(pythData, chainlinkData)
}