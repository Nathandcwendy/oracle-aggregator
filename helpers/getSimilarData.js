// const pythData = require("./db/pyth-id.json");
// const chainlinkData = require("./db/chainlink.json");
// const fs = require("fs");

// function getSimilarData() {
//   let arr = [];
//   let pyth = pythData["off-chain"].all;
//   let chainlink = chainlinkData.all;
//   for (const [pythKey, pythValue] of pyth.entries()) {
//     for (const [chainlinkKey, chainlinkValue] of chainlink.entries()) {
//       let obj = {};
//       if (chainlinkValue.pair == pythValue.pair) {
//         obj.pair = chainlinkValue.pair;
//         obj.category = chainlinkValue.category;
//         obj.subCategory = chainlinkValue.sub_category ?? null;
//         arr.push(obj);
//       }
//     }
//   }
//   return arr;
// }

// fs.writeFileSync("commonDb.json", JSON.stringify(getSimilarData()));

// let arr = [];
// for (const [key, value] of Object.entries({
//   "us10y": "0xe13490529898ba044274027323a175105d89bc43c2474315c76a051ba02d76f8",
//   "us1m": "0x49e9e8574bd7fcbd294e4a94057c7ed7fac1402f5960470cd8a12ee63df186e3",
//   "us2y": "0xff1196f6b85d274dcc2608b6974f2781b9757ecd25ecc9f08a44ae13071b2ebf",
//   "us30y": "0xf3030274adc132e3a31d43dd7f56ac82ae9d673aa0c15a0ce15455a9d00434e6",
//   "us3m": "0x32f2d7d2c0cc235012cbc5e92270f4f1e01b1dbc913f80733dcd88016440ac2f",
//   "us5y": "0x00d1e4ef2cef8626de09035298b4763cac85567b03ae6534098c7914992339cd",
//   "us6m": "0x7092f3445078c8bc4220e2c6e8b238d6691afa3a9f485bcc644d1f725c85f5ea",
//   "us7y": "0x2f32dfc72942edb002af80986a1e3d6d405193ef59e3d5ee5f7986c0d6655b1e",
// })) {
//   let obj = {};
//   obj.pair = key;
//   obj.address = value;
//   obj.category = "rates";
//   // obj.sub_category = "us";
//   arr.push(obj);
// }
// fs.writeFileSync(`off-chain.json`, JSON.stringify(arr));

// pythData["off-chain"].crypto.

// let container = {};
// function getArrFromObj(pythKey, pythData) {
//   let arr = [];
//   for (const [key, value] of Object.entries({
//     "us10y": "0xe13490529898ba044274027323a175105d89bc43c2474315c76a051ba02d76f8",
//     "us1m": "0x49e9e8574bd7fcbd294e4a94057c7ed7fac1402f5960470cd8a12ee63df186e3",
//     "us2y": "0xff1196f6b85d274dcc2608b6974f2781b9757ecd25ecc9f08a44ae13071b2ebf",
//     "us30y": "0xf3030274adc132e3a31d43dd7f56ac82ae9d673aa0c15a0ce15455a9d00434e6",
//     "us3m": "0x32f2d7d2c0cc235012cbc5e92270f4f1e01b1dbc913f80733dcd88016440ac2f",
//     "us5y": "0x00d1e4ef2cef8626de09035298b4763cac85567b03ae6534098c7914992339cd",
//     "us6m": "0x7092f3445078c8bc4220e2c6e8b238d6691afa3a9f485bcc644d1f725c85f5ea",
//     "us7y": "0x2f32dfc72942edb002af80986a1e3d6d405193ef59e3d5ee5f7986c0d6655b1e"
//   })) {
//     let obj = {};
//     obj.pair = key;
//     obj.address = value;
//     obj.category = "rates";
//     // obj.sub_category = "us";
//     arr.push(obj);
//   }
//     fs.writeFileSync(`off-chain.json`, JSON.stringify(arr));

//   // container[pythKey] = arr;
// }

// for (const [key, value] of Object.entries(pythData)) {
//   getArrFromObj(key, value);
//   fs.writeFileSync(`${key}.json`, JSON.stringify(container[key]));
// }

// let arr = [];
// function getArrFromObj(pythKey, pythData) {
//   for (const [key, value] of Object.entries(pythData)) {
//     let obj = {};
//     obj.pair = key;
//     obj.address = value;
//     obj.category = "equity";
//     obj.sub_category = pythKey;
//     arr.push(obj);
//   }
// }

// for (const [key, value] of Object.entries(pythData["pyth_evm_beta"].equity)) {
//   getArrFromObj(key, value);
// }
// fs.writeFileSync(`pyth_evm_beta.json`, JSON.stringify(arr));

// getArrFromObj(pythData);
