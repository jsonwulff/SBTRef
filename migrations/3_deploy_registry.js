const addressToEnv = require('./helpers/addressToEnv');
const Token = artifacts.require('TCGTok');
const Reg = artifacts.require('TCGReg');

module.exports = async (deployer, network, accounts) => {
  const ins = await Token.deployed();
  await deployer.deploy(Reg, ins.address).then(() => {
    addressToEnv(ins.address, 'TOKEN_ADDRESS', 'w+');
    addressToEnv(Reg.address, 'REGISTRY_ADDRESS', 'a');
  });
};
