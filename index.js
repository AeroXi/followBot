const whaleAddress = require("./watch_address")
const logWhaleAddress = whaleAddress.map(address => `0x000000000000000000000000${address.slice(2)}`)

require("dotenv").config()
const axios = require("axios")
const API_URL = process.env.MAINNET
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const BARK_URL =  process.env.BARK_URL
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)
const BN = web3.utils.BN
let contractHistory = []
let maxPriceWei = web3.utils.toWei('0.01', 'ether'); 
maxPriceWei = web3.utils.toBN(maxPriceWei)


async function bark(title, message) {
  await axios.get(`${BARK_URL}${title}/${message}`)
}

async function mintNFT(contractAddress, inputData, value) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    // 'maxPriorityFeePerGas': 1999999987,
    value: value,
    input: inputData,
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log("The hash of your transaction is: ", hash)
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log("Promise failed:", err)
    })
}

const zeroTopic =
  "0x0000000000000000000000000000000000000000000000000000000000000000"
const filter = {
  topics: [null, zeroTopic, logWhaleAddress],
}

const handleTX = async (tx) => {
  if (
    web3.utils.toBN(tx.value).lte(maxPriceWei) &&  // value <= maxPrice
    contractHistory.includes(tx.to) === false &&
    whaleAddress.includes(tx.from) 
  ) {
    contractHistory.push(tx.to)
    try {
      await mintNFT(tx.to, tx.input, tx.value)
    }
    catch (error) {
      console.log(error)
      await bark("bot error", error)
    }
    console.log(`contract: ${tx.to} input: ${tx.input} whale: ${tx.from}`)
    await bark("bot minted", `contract: ${tx.to} input: ${tx.input} whale: ${tx.from}`)
  }
}

// TODO: Add whatever logic you want to run upon mint events.
const doSomethingWithTxn = (txn) => {
  web3.eth.getTransaction(txn.transactionHash).then(handleTX).catch(console.log)
}

// Open the websocket and listen for events!
web3.eth.subscribe("logs", filter).on("data", doSomethingWithTxn)
