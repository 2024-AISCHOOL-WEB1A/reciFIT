const express = require("express");
const router = express.Router();
const authRouter = require("./api/auth.js");

// api routers
router.use("/auth", authRouter);

module.exports = router;
