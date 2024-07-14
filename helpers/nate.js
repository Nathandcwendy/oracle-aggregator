const { PriceServiceConnection } = require("@pythnetwork/price-service-client");
const { Web3 } = require("web3");
const pythData = require("../db/pyth-id.json");
const chainlinkData = require("../db/chainlink.json");

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
  constructor() {
    this.#pythConnection = new PriceServiceConnection(
      "https://hermes.pyth.network"
    );
    this.#web3 = new Web3("https://rpc.ankr.com/eth_sepolia");
  }
  #getPyth = (pairString) => {
    const pythPriceIds = [];
    if (pythData.pyth_evm_stable.crypto[pairString]) {
      pythPriceIds.push(pythData.pyth_evm_stable.crypto[pairString]);
    }
    if (pythPriceIds.length > 0) {
      return [this.#pythConnection, pythPriceIds, null];
    } else {
      return [null, null, "invalid pair"];
    }
  };
  #getChainlink = (pairString) => {
    const pair = chainlinkData.crypto.find((i) => i.pair == pairString);
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
  #getAverage = (x, y) => ((Number(x) + Number(y)) / 2).toFixed(5);
  aggregate = async (pairString) => {
    const promisesArr = [];
    const [pythConnection, pythPriceIds, err] = this.#getPyth(pairString);
    if (!err && pythConnection != null) {
      promisesArr.push(pythConnection.getLatestPriceFeeds(pythPriceIds));
    }
    const [chainlinkMethod, chainlinkDecimal, errChainlink] =
      this.#getChainlink(pairString);
    if (!errChainlink && chainlinkMethod) {
      promisesArr.push(chainlinkMethod.call());
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
        data: [
          {
            provider: "pyth",
            decimal: pythValue[0].price.expo,
            value: pythValue[0].price.price,
          },
          {
            provider: "chainlink",
            decimal: chainlinkDecimal,
            value: chainlinkValue.answer,
          },
        ],
        average,
      };
    } else {
      return "invalid pair";
    }
  };
}

let aggregator = new Aggregator();

const getManyAggregates = async (pairArr, aggregator) => {
  let result = [];
  for (const [key, value] of pairArr.entries()) {
    const res = await aggregator.aggregate(value);
    result.push(res);
  }
  return result;
};

getManyAggregates(["btc/usd", "eth/usd", "link/usd"], aggregator).then((res) =>
  console.log(res)
);
