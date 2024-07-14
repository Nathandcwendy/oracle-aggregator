const { Client } = require("@bandprotocol/bandchain.js");

// BandChain's Proof-of-Authority REST endpoint
const endpoint = "https://laozi-testnet6.bandchain.org/grpc-web";
const client = new Client(endpoint);

const minCount = 10;
const askCount = 10;

// This example demonstrates how to query price data from
// Band's standard dataset
async function exampleGetReferenceData() {
  const rate = await client.getReferenceData(
    ["BTC/USD", "BTC/ETH"],
    minCount,
    askCount
  );
  return rate;
}

(async () => {
  console.log(await exampleGetReferenceData());
})();
