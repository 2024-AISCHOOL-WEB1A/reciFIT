const express = require("express");
const router = express.Router();

const authRouter = require("./api/auth");
const userRouter = require("./api/users/users");
const userIngredientsRouter = require("./api/users/usersIngredients");
const recipeRouter = require("./api/recipes");
const receiptRouter = require("./api/receipts");
const environmentScoreRouter = require("./api/environmentScore");

// api routers
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/users/ingredients", userIngredientsRouter);
router.use("/recipes", recipeRouter);
router.use("/receipts", receiptRouter);
router.use("/environment-score", environmentScoreRouter);

module.exports = router;
