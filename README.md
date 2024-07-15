This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## About The Project

This project was done in accordance with the completion of [Solana Talent Olympics Summer 2024: Oracle Aggregator Project](https://earn.superteam.fun/listings/hackathon/oracle-aggregator-st-talent-olympics/).

## Project Structure

- [**app**](app)
  - [**aside**](app/aside)
  - [**pair**](app/pair)
    - [**\[slug\]**](app/pair/[slug])
- [**components**](components)
  - [**ui**](components/ui)
- [**context**](context)
- [**db**](db)
- [**helpers**](helpers)
- [**lib**](lib)
- [**public**](public)

The folder structure mimicks a typical next js app router folder structure with a few modifications.

### db

| File           | Description                                                                                                                                                 | Use                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| chainlink.json | Data scraped from [chainlink website](https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1) used as mock data to get data feeds | To get the associated address for any currency pair or category of data.     |
| pyth-id.json   | Data scraped from [pyth core website](https://pyth.network/developers/price-feed-ids) used as mock data to get data feeds                                   | To get the associated address for any currency pair or category of data.     |
| commonDb.json  | Data feed pairs that were found in both **chainlink.json** and **pyth-id.json**.                                                                            | This enables only data that is validated/provided by both oracles to be used |

### helpers

This contains helper functions that were used to scrape/collect mock data that enabled easy access to data feeds along with some testing functions used during development.

### lib

Contains the two main files **aggregator.tsx** and **prepareData.tsx** that request for the data feed and prepare the data for the view (frontend).

## Aggregator Function

```tsx
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
    this.#chainlinkData = chainlinkData;
  }
  #getPyth = (
    pairString: string
  ): [null, null, string] | [PriceServiceConnection, string[], null] => {
    const pythPriceIds = [];
    const getPairAddress = (pairString: string) => {
      const pairData = this.#pythData.pyth_evm_stable.all.find(
        (i: PairData) => i.pair == pairString
      );
      if (pairData) {
        return pairData.address;
      } else {
        return null;
      }
    };
    const address = getPairAddress(pairString);
    if (address) {
      pythPriceIds.push(address);
    }
    if (pythPriceIds.length > 0) {
      return [this.#pythConnection, pythPriceIds, null];
    } else {
      return [null, null, "invalid pair"];
    }
  };
  #getChainlink = (
    pairString: string
  ): [null, null, string] | [any, string, null] => {
    const pair = this.#chainlinkData.all.find(
      (i: PairData) => i.pair == pairString
    );
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
  #getAverage = (x: string | number, y: string | number): string =>
    ((Number(x) + Number(y)) / 2).toFixed(5);
  aggregate = async (pairData: PairData) => {
    const promisesArr = [];
    const pairString = pairData.pair;
    const [pythConnection, pythPriceIds, err] = this.#getPyth(pairString);
    if (!err && pythConnection != null) {
      promisesArr.push(pythConnection.getLatestPriceFeeds(pythPriceIds));
    } else {
      return "an error occured, please reload";
    }
    const [chainlinkMethod, chainlinkDecimal, errChainlink] =
      this.#getChainlink(pairString);
    if (!errChainlink && chainlinkMethod) {
      promisesArr.push(chainlinkMethod.call());
    } else {
      return "an error occured, please reload";
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
            price: pythPrice,
          },
          {
            provider: "chainlink",
            decimal: chainlinkDecimal,
            value: chainlinkValue.answer,
            price: chainlinkPrice,
          },
        ],
        average,
        pairData,
        lastUpdated: Date.now(),
      };
    } else {
      return "invalid pair";
    }
  };
}
```

This `class` houses the mechanism that fetches and aggregates the data feeds. Lets try to digest it.

- `#aggregatorV3InterfaceABI` is an array representing the ABI (Application Binary Interface) of a smart contract for interacting with a Chainlink data feed. This allows for interaction with the Chainlink AggregatorV3Interface, which provides methods to retrieve data such as price feeds. You can read more about ABI [here](https://www.quicknode.com/guides/ethereum-development/smart-contracts/what-is-an-abi).
- `#pythConnection` holds the `PriceServiceConnection` which is an interface for connecting with a pyth oracle node.
- `#web3` serves as an interface to connect to a **eth_sepolia** network node. It is also used to connect to the chainlink smart contract and access the data feeds.
- `#pythData` is the pyth core mock database scraped from [pyth core website](https://pyth.network/developers/price-feed-ids) used to get data feeds.
- `#chainlinkData` is the chainlink mock database scraped from [chainlink website](https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1) used to get data feeds.
- `#getPyth` is a function that fetches the pyth oracle data feed on the **pyth_evm_stable** network. It takes a currency pair or data accessor (e.g btc/usd) as a parameter and returns the pyth oracle data feed for that currency pair.
- `getChainlink` is a function that fetches the chainlink oracle data feed on the **eth_sepolia** network. It takes a currency pair or data accessor (e.g btc/usd) as a parameter and returns the chainlink oracle data feed for that currency pair.
- `getAverage` computes the average to two values given as parameters and returns the computed value.
- `aggregate` calculates the aggregate of the given data pair/accessor. It uses the pyth and chainlink data feeds, caluclates their average and returns the value.
