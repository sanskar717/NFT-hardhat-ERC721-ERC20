const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []

    console.log("Uploading to IPFS!")

    const pinataApikey = process.env.PINATA_API_KEY
    const pinataApiSecret = process.env.PINATA_API_SECRET

    if (!pinataApikey || !pinataApiSecret) {
        console.log("⚠️  Pinata API keys not found")
        return { responses: [], files }
    }

    const pinata = new pinataSDK(pinataApikey, pinataApiSecret)

    for (let fileIndex in files) {
        const filename = files[fileIndex]
        const filepath = `${fullImagesPath}/${filename}`
        const readableStreamForFile = fs.createReadStream(filepath)

        const options = {
            pinataMetadata: {
                name: filename,
            },
        }

        try {
            console.log(`Uploading ${filename}...`)
            const response = await pinata.pinFileToIPFS(readableStreamForFile, options)
            responses.push(response)
            console.log(`✅ ${filename} uploaded`)
        } catch (error) {
            console.log(`❌ Error: ${error.message}`)
        }
    }

    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    const pinataApikey = process.env.PINATA_API_KEY
    const pinataApiSecret = process.env.PINATA_API_SECRET

    if (!pinataApikey || !pinataApiSecret) {
        console.log("⚠️  Pinata keys missing")
        return null
    }

    const pinata = new pinataSDK(pinataApikey, pinataApiSecret)

    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(`❌ Error:`, error.message)
        return null
    }
}

module.exports = { storeImages, storeTokenUriMetadata }
