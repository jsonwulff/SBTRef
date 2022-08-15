import Web3 from "web3"

const web3 = new Web3('http://localhost:8545')

// const provider = () => {
//   if (typeof web3 !== 'undefined') {
//     return web3.currentProvider 
//   } else {
//     console.log("You need to install MetaMask for this app to work!")
//   }
// }

export const eth = web3.eth;