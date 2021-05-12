const express = require("express");
const healthRouter = express.Router();
healthRouter.get("/", async (req, res, next) => {
  try {
    res.send({
      message: "All is well!",
    });
  } catch (error) {
    next(error);
  }
});
module.exports = healthRouter;