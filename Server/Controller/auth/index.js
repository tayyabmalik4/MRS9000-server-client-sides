const express = require("express");
const router = express();
const authController = require("./auth");
const roles = require("../../constants/roles");





router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;