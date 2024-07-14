import { PriceServiceConnection } from "@pythnetwork/price-service-client";

// Get the Stable Hermes service URL from https://docs.pyth.network/price-feeds/api-instances-and-providers/hermes
const connection = new PriceServiceConnection("https://hermes.pyth.network");
 
const priceIds = [
  // "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD price id
  // "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
  "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43"
];
 
// Get the latest values of the price feeds as JSON objects.
export async function getPrices() {
  const currentPrices = await connection.getLatestPriceFeeds(priceIds);
  console.log("hello world")
  return currentPrices
}
