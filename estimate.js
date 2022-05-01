require("dotenv").config()
const axios = require("axios")
const API_URL = process.env.RINKEBY
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const BARK_URL = process.env.BARK_URL
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)


const tx = {
    from: PUBLIC_KEY,
    to: "0xeD0DBd03A85D4C041C7B731cC36edC43c97d423c",
    nonce: 0,
    // gas: 300000,
    // 'maxPriorityFeePerGas': 1999999987,
    value: 0,
    input: "0xa0712d680000000000000000000000000000000000000000000000000000000000000003",
  }

const run = async () => {
    gas = await web3.eth.estimateGas(tx)
    console.log(gas)
}

try {
    run()
}
catch (e) {
  
}
