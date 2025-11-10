const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Dynamic SVG NFT Unit Tests", function () {
          let dynamicSvgNft, deployer, mockV3Aggregator

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "dynamicsvg"])

              const dynamicSvgNftDeployment = await deployments.get("DynamicSvgNft")
              dynamicSvgNft = await ethers.getContractAt(
                  "DynamicSvgNft",
                  dynamicSvgNftDeployment.address,
              )

              const mockV3AggregatorDeployment = await deployments.get("MockV3Aggregator")
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  mockV3AggregatorDeployment.address,
              )
          })

          describe("mintNft", () => {
              it("mints NFT and increments counter", async function () {
                  const highValue = ethers.utils.parseEther("1")
                  await dynamicSvgNft.mintNft(highValue)
                  const tokenCounter = await dynamicSvgNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "1")
              })

              it("shifts the token uri to low when price < highvalue", async function () {
                  const highValue = ethers.utils.parseEther("100000000")
                  await dynamicSvgNft.mintNft(highValue)
                  const tokenURI = await dynamicSvgNft.tokenURI(0)
                  assert(tokenURI.includes("data:application/json;base64,"))
              })
          })
      })
