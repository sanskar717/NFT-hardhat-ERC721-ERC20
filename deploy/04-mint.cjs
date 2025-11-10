const { ethers, network, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config.cjs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // Basic NFT
    const basicNftDeployment = await deployments.get("BasicNft")
    const basicNft = await ethers.getContractAt("BasicNft", basicNftDeployment.address)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`)

    // Random IPFS NFT
    const randomIpfsNftDeployment = await deployments.get("RandomIpsfNft")
    const randomIpfsNft = await ethers.getContractAt(
        "RandomIpsfNft",
        randomIpfsNftDeployment.address,
    )
    const mintFee = await randomIpfsNft.getmintFee()

    await new Promise(async (resolve, reject) => {
        const timeout = setTimeout(
            () => reject(new Error("Timeout: NFT Mint event did not fire")),
            300000,
        )
        randomIpfsNft.once("NftMinted", async function () {
            clearTimeout(timeout)
            resolve()
        })
        const randomipfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
        await randomipfsNftMintTx.wait(1)

        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2MockDeployment = await deployments.get("VRFCoordinatorV2Mock")
            const vrfCoordinatorV2Mock = await ethers.getContractAt(
                "VRFCoordinatorV2Mock",
                vrfCoordinatorV2MockDeployment.address,
            )
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })
    console.log(`Random IPFS NFT index 0 TokenURI: ${await randomIpfsNft.tokenURI(0)}`)

    // Dynamic SVG NFT
    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNftDeployment = await deployments.get("DynamicSvgNft")
    const dynamicSvgNft = await ethers.getContractAt(
        "DynamicSvgNft",
        dynamicSvgNftDeployment.address,
    )
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString())
    await dynamicSvgNftMintTx.wait(1)
    console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)
}

module.exports.tags = ["all", "mint"]
