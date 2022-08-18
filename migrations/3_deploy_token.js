// Import the HelloWorld contract...
const addressToEnv = require('./helpers/addressToEnv');
const Reg = artifacts.require('TCGReg');
const Token = artifacts.require('TCGTok');

module.exports = async (deployer, network, accounts) => {
  const reg = await Reg.deployed();
  await deployer.deploy(Token, reg.address).then(() => {
    reg.setTokenContract(Token.address);
    addressToEnv(Reg.address, 'REGISTRY_ADDRESS', 'w+');
    addressToEnv(Token.address, 'TOKEN_ADDRESS', 'a');
  });
};
