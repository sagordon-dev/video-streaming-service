const express = require("express");
const fs = require("fs");
const amqp = require('amqplib');

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

if (!process.env.RABBIT) {
    throw new Error("Please specify the name of the RabbitMQ host using environment variable RABBIT");
}

const PORT = process.env.PORT;
const RABBIT = process.env.RABBIT;

async function main() {
    const messagingConnection = await amqp.connect(RABBIT);
    const messageChannel = await messagingConnection.createChannel();

    function sendViewedMessage(messageChannel, videoPath) {
        const msg = { videoPath: videoPath };
        const jsonMsg = JSON.stringify(msg);
        messageChannel.publish("", "viewed", Buffer.from(jsonMsg));
    }

    const app = express();

    app.get("/video", async (req, res) => {
        const videoPath = "./videos/SampleVideo_1280x720_1mb.mp4";
        const stats = await fs.promises.stat(videoPath);

        res.writeHead(200, {
            "Content-Length": stats.size,
            "Content-Type": "video/mp4",
        });
    
        fs.createReadStream(videoPath).pipe(res);

        sendViewedMessage(messageChannel, videoPath);
    });

    app.listen(PORT, () => {
        console.log("Microservice online.");
    });
}

main()
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });
