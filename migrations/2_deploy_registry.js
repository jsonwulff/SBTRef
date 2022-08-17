const Reg = artifacts.require('TCGReg');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Reg);
};
