const express = require("express");
const router = express();
const auth = require("../../middlewares/auth/auth")
const machineController = require("./machine");
const roles = require("../../constants/roles");
const multer = require('../../utils/multer.js')


router.use(auth.authenticate)

router.post('/',multer.single('file'),machineController.addMachine)
router.post('/get',machineController.getAllMachine)
router.patch('/:id',multer.single('file'), machineController.updateMachineById)
router.delete('/:id',machineController.deleteMachineById)


module.exports = router;