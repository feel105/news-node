const express = require("express");
const authRouting = express.Router();
const authController = require("../controller/authController");

authRouting
  .post("/login", authController.login)
  .post("/signUp", authController.signUp);

module.exports = authRouting;
