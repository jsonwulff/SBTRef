// Import the HelloWorld contract...
const Token = artifacts.require("TCGTok");

module.exports = (deployer, network, accounts) => {
  // Deploy it!
  deployer.deploy(Token).then(()=>{
    Token.deployed().then(ins=>{
      let ps = accounts.map(acc => {
        ins.safeMint(acc, "");
      });
    });
  });
}