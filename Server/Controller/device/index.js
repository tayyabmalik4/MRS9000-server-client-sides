const express = require("express");
const router = express();
const auth = require("../../middlewares/auth/auth")
const deviceController = require("./device");
const roles = require("../../constants/roles");
const multer = require('../../utils/multer.js')


router.use(auth.authenticate)

router.post('/',multer.single('file'),deviceController.addDevice)
router.post('/get',deviceController.getAllDevice)
router.patch('/:id',multer.single('file'), deviceController.updateDeviceById)
router.delete('/:id',deviceController.deleteDeviceById)


module.exports = router;