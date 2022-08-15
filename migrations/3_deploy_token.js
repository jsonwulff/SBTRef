// Import the HelloWorld contract...
const Token = artifacts.require("TCGTok");

module.exports = (deployer) => {
  // Deploy it!
  deployer.deploy(Token);
}