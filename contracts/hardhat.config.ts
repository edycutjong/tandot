import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Use a placeholder private key if none is found to allow hardhat commands to run.
// For testnet deployments, you will need to add YOUR_PRIVATE_KEY to .env.local
const privateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    botChainMainnet: {
      url: process.env.BOT_CHAIN_RPC_URL || "https://rpc.botchain.ai",
      accounts: [privateKey],
      chainId: 677
    },
    botChainTestnet: {
      url: process.env.BOT_CHAIN_TESTNET_RPC_URL || "https://rpc.bohr.life",
      accounts: [privateKey],
      chainId: 968
    }
  },
  etherscan: {
    apiKey: {
      botChainMainnet: process.env.BOTSCAN_API_KEY || "abc",
      botChainTestnet: process.env.BOTSCAN_API_KEY || "abc",
    },
    customChains: [
      {
        network: "botChainTestnet",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life"
        }
      }
    ]
  },
};

export default config;
