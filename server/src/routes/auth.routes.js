const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller")

/* POST  /api/auth/register */
authRouter.post("/register", authController.userRegistrationController);

/* POST  /api/auth/login */
authRouter.post("/login", authController.userLoginController);

module.exports = authRouter