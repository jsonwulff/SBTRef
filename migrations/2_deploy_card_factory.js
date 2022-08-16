const fs = require('fs');
const CardFactory = artifacts.require('CardFactory');

module.exports = (deployer) => {
  // Deploy it!
  deployer.deploy(CardFactory).then(() => {
    fs.writeFileSync(
      './client/.env',
      'REACT_APP_CONTRACT_ADDRESS=' + CardFactory.address,
      {
        flag: 'w+',
      }
    );
  });
};
