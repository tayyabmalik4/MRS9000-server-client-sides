const express = require("express");
const router = express();
const auth = require("../../middlewares/auth/auth")
const machineController = require("./machine");
const roles = require("../../constants/roles");


router.use(auth.authenticate)

// Machine Routes
router.post('/',machineController.addMachine)
router.post('/get',machineController.getAllMachine)

module.exports = router;