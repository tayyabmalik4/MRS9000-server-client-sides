const express = require("express");
const router = express();
const auth = require("../../middlewares/auth/auth")
const meterController = require("./meter");
const roles = require("../../constants/roles");


router.use(auth.authenticate)

router.post("/",meterController.getMeter)

module.exports = router;