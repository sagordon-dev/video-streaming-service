const express = require("express")

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

const PORT = process.env.PORT;

// Application entry point.

async function main() {
    console.log("Hello world!");

    const app = express();

    // Add route handlers here ...

    app.listen(PORT, () => {
        console.log("Microservices online.");
    });
}

main()
    .catch(err => {
        console.error("Microservices failed to start.");
        console.error(err && err.stack || err);
    });