const express = require("express");
const router = express.Router();

const authRouter = require("./api/auth");
const userRouter = require("./api/users/users");
const userIngredientsRouter = require("./api/users/usersIngredients");
const recipeRouter = require("./api/recipes");

// api routers
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/users/ingredients", userIngredientsRouter);
router.use("/recipes", recipeRouter);

module.exports = router;
