// const pinataSDK = require("@pinata/sdk")
// const path = require("path")
// const fs = require("fs")
// const { error } = require("console")
// require("dotenv").config()

// async function storeImages(imagesFilePath) {
//     const fullImagesPath = path.resolve(imagesFilePath)
//     const files = fs.readdirSync(fullImagesPath)
//     let responses = []

//     console.log("Uploading to IPFS!")

//     const pinataApikey = process.env.PINATA_API_KEY
//     const pinataApiSecret = process.env.PINATA_API_SECRET

//     // Check if credentials exist
//     if (!pinataApikey || !pinataApiSecret) {
//         console.log("⚠️  Pinata API keys not found in .env file")
//         console.log("Skipping Pinata upload. Make sure to add:")
//         console.log("  PINATA_API_KEY=your_key")
//         console.log("  PINATA_API_SECRET=your_secret")
//         return { responses: [], files }
//     }

//     // Initialize Pinata INSIDE the function with credentials
//     const pinata = new pinataSDK(pinataApikey, pinataApiSecret)

//     for (let fileIndex in files) {
//         const filename = files[fileIndex]
//         const filepath = `${fullImagesPath}/${filename}`
//         const readableStreamForFile = fs.createReadStream(filepath)

//         const options = {
//             pinataMetadata: {
//                 name: filename,
//             },
//         }

//         try {
//             console.log(`Uploading ${filename}...`)
//             const response = await pinata.pinFileToIPFS(readableStreamForFile, options)
//             responses.push(response)
//             console.log(`✅ ${filename} uploaded - Hash: ${response.IpfsHash}`)
//         } catch (error) {
//             console.log(`❌ Error uploading ${filename}:`, error.message)
//         }
//     }

//     console.log(`\n📊 Total uploaded: ${responses.length}/${files.length} files`)
//     return { responses, files }
// }

// async function storeTokenUriMetadata(metadata) {
//     try {
//         const response = await pinata.pinJSONToIPFS(metadata)
//         return response
//     } catch (error) {
//         console.log(error)
//     }
//     return null
// }

// module.exports = { storeImages, storeTokenUriMetadata}

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
