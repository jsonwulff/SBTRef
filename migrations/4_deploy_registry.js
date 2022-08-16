// Import the HelloWorld contract...
const Token = artifacts.require("TCGTok");
const Reg = artifacts.require("TCGReg");


module.exports = async (deployer, network, accounts) => {
  // Deploy it!
    const ins = await Token.deployed()
    console.log(ins.address)
    await deployer.deploy(Reg, ins.address)

}