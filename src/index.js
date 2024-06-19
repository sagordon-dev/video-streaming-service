const express = require('express');
const fs = require("fs");

if (!process.env.PORT) {
    throw new Error("Please specify the port number for tthe HTTP server with the environment variable PORT.");
}

const PORT = process.env.PORT;

const app = express();

const port = 3000;

app.get('/video', async (req, res) => {
    const videoPath = "videos/SampleVideo_1280x720_1mb.mp4";
    const stats = await fs.promises.stat(videoPath);

    res.writeHead(200, {
        "Content-Length": stats.size,
        "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
});

app.listen(port, () => {
    console.log(`Microservices listening on ${PORT}, point your browser at http://localhost:${PORT}/video`);
});