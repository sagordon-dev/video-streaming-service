const express = require("express");
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

if (!process.env.PORT || !process.env.STORAGE_ACCOUNT_NAME || !process.env.STORAGE_ACCESS_KEY) {
    throw new Error("Missing required environment variables: PORT, STORAGE_ACCOUNT_NAME, or STORAGE_ACCESS_KEY.");
}

const PORT = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

console.log(`Serving videos from Azure storage account ${STORAGE_ACCOUNT_NAME}.`);

function createBlobService() {
    const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCESS_KEY);
    return new BlobServiceClient(
        `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        sharedKeyCredential
    );
}

const app = express();

app.get("/video", async (req, res) => {
    const videoPath = req.query.path;
    console.log(`Streaming video from path ${videoPath}.`);

    const blobService = createBlobService();
    const containerClient = blobService.getContainerClient("videos");
    const blobClient = containerClient.getBlobClient(videoPath);

    const properties = await blobClient.getProperties();

    res.writeHead(200, {
        "Content-Length": properties.contentLength,
        "Content-Type": "video/mp4",
    });

    const response = await blobClient.download();
    response.readableStreamBody.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Microservice online`);
});