// Import the HelloWorld contract...
const Token = artifacts.require("TCGTok");

module.exports = async (deployer, network, accounts) => {
  // Deploy it!
  // Instance of token
  await deployer.deploy(Token)
  let ins = await Token.deployed()
  // List of promises of minting
  let ps = accounts.map(acc => {
      ins.safeMint(acc, "");
    });
  await Promise.all(ps)
}