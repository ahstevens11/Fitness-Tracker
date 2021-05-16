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
// 404 handler
server.get('*', (req, res) => {
    res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
  });

server.use((error, req, res, next) => {
    console.error('SERVER ERROR: ', error);
    if(res.statusCode < 400) res.status(500);
    res.send({error: error.message, name: error.name, message: error.message, table: error.table});
  });  

server.listen(PORT, () => {
    client.connect()
    console.log(`App is up on port`, PORT)
})