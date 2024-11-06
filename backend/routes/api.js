const express = require("express");
const router = express.Router();

const authRouter = require("./api/auth");
const userIngredientsRouter = require("./api/users/usersIngredients");

// api routers
router.use("/auth", authRouter);
router.use("/users/ingredients", userIngredientsRouter);

module.exports = router;
