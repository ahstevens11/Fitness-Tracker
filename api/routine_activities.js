const express = require("express");
const routineActivityRouter = express.Router();
const { requireUser } = require("./utils");

module.exports = routineActivityRouter