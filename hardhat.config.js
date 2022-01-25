require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: '0.8.11',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
      /* gas: 2100000,
      gasPrice: 8000000000 */
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
