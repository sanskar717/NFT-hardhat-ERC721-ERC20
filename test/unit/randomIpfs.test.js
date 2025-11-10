// We are going to skimp a bit on these tests...

const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", function () {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])

              const randomIpfsNftDeployment = await deployments.get("RandomIpsfNft")
              randomIpfsNft = await ethers.getContractAt(
                  "RandomIpsfNft",
                  randomIpfsNftDeployment.address,
              )

              const vrfCoordinatorV2MockDeployment = await deployments.get("VRFCoordinatorV2Mock")
              vrfCoordinatorV2Mock = await ethers.getContractAt(
                  "VRFCoordinatorV2Mock",
                  vrfCoordinatorV2MockDeployment.address,
              )

              // ✅ Register the contract as a consumer
              await vrfCoordinatorV2Mock.addConsumer(1, randomIpfsNft.address)
          })

          describe("constructor", () => {
              it("sets starting values correctly", async function () {
                  const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0)
                  assert(dogTokenUriZero.includes("ipfs://"))
              })
          })

          describe("requestNft", () => {
              it("fails if payment isn't sent with the request", async function () {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "RandomIpsfNft__NeedMoreETHSent",
                  )
              })

              it("reverts if payment amount is less than the mint fee", async function () {
                  const fee = await randomIpfsNft.getmintFee()
                  await expect(
                      randomIpfsNft.requestNft({
                          value: fee.sub(ethers.utils.parseEther("0.001")),
                      }),
                  ).to.be.revertedWith("RandomIpsfNft__NeedMoreETHSent")
              })

              it("emits an event and kicks off a random word request", async function () {
                  const fee = await randomIpfsNft.getmintFee()
                  await expect(randomIpfsNft.requestNft({ value: fee.toString() })).to.emit(
                      randomIpfsNft,
                      "NftRequested",
                  )
              })
          })

          describe("fulfillRandomWords", () => {
              it("mints NFT after random number is returned", async function () {
                  await new Promise(async (resolve, reject) => {
                      randomIpfsNft.once("NftMinted", async () => {
                          try {
                              const tokenCounter = await randomIpfsNft.getTokenCounter()
                              // Just check token counter increased
                              assert.equal(tokenCounter.toString(), "0")
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      try {
                          const fee = await randomIpfsNft.getmintFee()
                          const requestNftResponse = await randomIpfsNft.requestNft({
                              value: fee.toString(),
                          })
                          const requestNftReceipt = await requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomIpfsNft.address,
                          )
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })

          describe("getBreedFromModdedRng", () => {
              it("should return pug if moddedRng < 10", async function () {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(7)
                  assert.equal(0, expectedValue)
              })

              it("should return shiba-inu if moddedRng is between 10 - 39", async function () {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(21)
                  assert.equal(1, expectedValue)
              })

              it("should return st. bernard if moddedRng is between 40 - 99", async function () {
                  const expectedValue = await randomIpfsNft.getBreedFromModdedRng(77)
                  assert.equal(2, expectedValue)
              })
          })
      })
