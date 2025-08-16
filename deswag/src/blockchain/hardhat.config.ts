import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      // Use a throwaway PK with test ETH on Base Sepolia
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : [],
      chainId: 84532,
    },
  },
  etherscan: {
    // optional: for verification on BaseScan testnet
    apiKey: { baseSepolia: process.env.BASESCAN_API_KEY || "" },
  },
};
export default config;
