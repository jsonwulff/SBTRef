// Import the HelloWorld contract...
const CardFactory = artifacts.require('CardFactory');

module.exports = (deployer) => {
  // Deploy it!
  deployer.deploy(CardFactory);
};
