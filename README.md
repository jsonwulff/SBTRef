# SST-2022

```
make run-ganache
truffle migrate
npm run build
```

## Prerequisites

In order to build, deploy, test the smart contracts, and run the front-end, you need to have the following:

- [NodeJS](https://nodejs.org/en/download/).
- Truffle.
- Ganache.

## Installation and usages

### Smart contracts

In order to install the dependencies to build, deploy and test the smart contracts, run the following command from the root of the project:

```bash
npm install
```

In order to deploy the smart contracts locally, run the following command from the root of the project:

```bash
truffle migrate
```

Running the smart contract tests is done by running the following command from the root of the project:

```bash
truffle test
```

### Front end

In order to install the dependencies to build and run the front end application, run the following command from the `client` of the project:

```bash
npm install
```

In order to run the front end application, run the following command from the root folder of the project:

```bash
npm run build
```

This should automatically open a browser window and load the front end application. If not you can try to manually enter `localhost:3000` in the browser address bar.


## Folder & file structure

- `contracts`: Contains the app's Solidity contracts (.sol files).
- `migrations`: The files in this folder will orchestrate the deployment process.
- `test`: Folder for automated tests of contracts (either in Solidity or JavaScript).
- `truffle-config.js`: A configuration file for your project's settings.
- `client`: Folder for the front-end Aeact app.

## Todo

- [ ] Add player stats on front page (dashboard) showing totaler number of cards etc.