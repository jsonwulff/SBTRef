const fs = require('fs');

/// @dev Helper function to write contract addresses to .env file
/// @param address - Address of the contract
/// @param name - Name of the contract (suffix of the REACT_APP_ .env variable)
/// @param writeOption - 'w+' used for the first contract in the deployment or, 'a' for the rest
module.exports = (address, name, writeOption) => {
  fs.writeFileSync(
    './client/.env',
    `REACT_APP_${name.toUpperCase()}=${address}\n`,
    {
      flag: writeOption,
    }
  );
};
