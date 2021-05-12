// create the express server here
require('dotenv').config()
const { PORT = 3000 } = process.env;
const express = require("express");
const server = express();
const cors = require("cors");
server.use(cors());
const morgan = require("morgan");
server.use(morgan("dev"));
const bodyParser = require("body-parser");
server.use(bodyParser.json());
const client = require("./db/client.js");
const apiRouter = require("./api");
server.use("/api", apiRouter)

//need to a 404 and a 500 error

server.listen(PORT, () => {
    client.connect()
    console.log(`App is up on port`, PORT)
})