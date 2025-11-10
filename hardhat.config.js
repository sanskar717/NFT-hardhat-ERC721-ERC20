// import "@nomicfoundation/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@nomicfoundation/hardhat-verify"
import "hardhat-deploy"
import "solidity-coverage"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import dotenv from "dotenv"
dotenv.config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

export default {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            url: "http://127.0.0.1:8545", // 👈 This is the missing piece
            chainId: 31337,
            blockConfirmations: 1,
        },
        sepolia: {
            chainId: 11155111,
            blockConfirmations: 6,
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`],
        },
    },

    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
    },
    solidity: {
        compilers: [
            { version: "0.8.20" },
            { version: "0.8.7" },
            { version: "0.6.6" },

            // add other versions if needed
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 300000, // 300 seconds max for running tests
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}
