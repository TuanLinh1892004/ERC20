require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const ETHERSCAN_API_KEY   = process.env.ETHERSCAN_API_KEY;
const INFURA_API_KEY      = process.env.INFURA_API_KEY;
const PRIVATE_KEY         = process.env.PRIVATE_KEY;
const MNEMONIC            = process.env.MNEMONIC;
const BSCSCAN_API_KEY     = process.env.BSCSCAN_API_KEY;

module.exports = {
  solidity: "0.8.24",
  networks: {
    bscTestnet: {
      url: "https://bsc-testnet-rpc.publicnode.com",
      gasPrice: 20000000000,
      chainId: 97,
      accounts: {mnemonic: MNEMONIC},
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
    },
  },
};
