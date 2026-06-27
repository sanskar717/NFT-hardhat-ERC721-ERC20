# NFT Collection — ERC721 & ERC20 on Ethereum

A comprehensive NFT project implementing **three different NFT types** on Ethereum using Hardhat, Chainlink VRF, and IPFS. Covers basic minting, randomized traits via on-chain randomness, and dynamic SVGs that react to live price feeds.

---

## 📦 Three NFT Types

### 1. BasicNft (`BasicNft.sol`)
Simple ERC721 token with IPFS metadata. Standard minting with token URI stored on IPFS via Pinata.

### 2. RandomIpfsNft (`RandomIpfsNft.sol`)
- Uses **Chainlink VRF v2** for verifiable on-chain randomness
- Minting triggers a VRF request — NFT is revealed only after randomness is fulfilled
- Random outcome determines which dog breed you get: Pug, Shiba Inu, or St. Bernard
- Each breed has different rarity weighting
- Images stored on **IPFS via Pinata**

### 3. DynamicSvgNft (`DynamicSvgNft.sol`)
- Fully **on-chain SVG** — no IPFS dependency
- Uses **Chainlink ETH/USD Price Feed** to determine NFT state
- SVG switches between `happy` and `frown` based on ETH price vs a user-defined threshold
- Metadata generated and stored entirely on-chain as base64-encoded JSON

---

## 🛠️ Tech Stack

- **Solidity** — Smart contract development
- **Hardhat** — Development, testing, deployment
- **Chainlink VRF v2** — Verifiable randomness for NFT traits
- **Chainlink Price Feeds** — ETH/USD oracle for dynamic SVG
- **IPFS / Pinata** — Decentralized image & metadata storage
- **JavaScript** — Deployment & utility scripts

---

## 📁 Project Structure

```
├── contracts/
│   ├── BasicNft.sol              # Simple ERC721
│   ├── DynamicSvgNft.sol         # On-chain SVG + price feed
│   └── RandomIpfsNft.sol         # Chainlink VRF randomized NFT
├── deploy/
│   ├── 00-deploy-mocks.cjs       # Local mock contracts
│   ├── 01-deploy-basic-nft.cjs   # Deploy BasicNft
│   ├── 02-deploy-random-ipfs-nft.cjs  # Deploy RandomIpfsNft
│   ├── 03-deploy-dynamic-svg-NFT.cjs  # Deploy DynamicSvgNft
│   └── 04-mint.cjs               # Minting script
├── images/
│   ├── dynamicNft/
│   │   ├── happy.svg             # Happy state SVG
│   │   └── frown.svg             # Frown state SVG
│   └── randomNft/
│       ├── pug.png
│       ├── shiba-inu.png
│       └── st-bernard.png
├── test/unit/                    # Unit tests
├── utils/
│   ├── uploadToPinata.cjs        # IPFS upload utility
│   └── verify.cjs                # Etherscan verification
├── hardhat.config.js
└── helper-hardhat-config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- yarn
- MetaMask wallet
- Sepolia ETH (from [faucet](https://sepoliafaucet.com/))

### Installation

```bash
git clone https://github.com/sanskar717/NFT-hardhat-ERC721-ERC20.git
cd NFT-hardhat-ERC721-ERC20
yarn install
```

### Environment Setup

Create a `.env` file:

```env
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
VRF_SUBSCRIPTION_ID=your_chainlink_vrf_subscription_id
```

### Deploy

```bash
# Deploy all contracts to Sepolia
yarn hardhat deploy --network sepolia

# Deploy specific contract
yarn hardhat deploy --network sepolia --tags basicnft
yarn hardhat deploy --network sepolia --tags randomipfs
yarn hardhat deploy --network sepolia --tags dynamicsvg

# Mint NFTs
yarn hardhat deploy --network sepolia --tags mint
```

### Run Tests

```bash
yarn hardhat test
```

### Upload Images to IPFS

```bash
node utils/uploadToPinata.cjs
```

---

## 🔗 Key Concepts Demonstrated

- **ERC721 standard** implementation from scratch
- **Chainlink VRF v2** integration for provably fair randomness
- **Chainlink Price Feeds** for real-time oracle data
- **On-chain SVG generation** — fully decentralized metadata
- **IPFS + Pinata** for decentralized off-chain storage
- **Hardhat** deployment pipeline with mocks for local testing
- **Etherscan** contract verification

---

## 📄 License

MIT
