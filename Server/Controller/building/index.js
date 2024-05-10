const express = require("express");
const router = express();
const auth = require("../../middlewares/auth/auth")
const buildingController = require("./building");
const roles = require("../../constants/roles");
const multer = require('../../utils/multer.js')


router.use(auth.authenticate)

router.post('/',multer.single('file'),buildingController.addBuilding)
router.get('/get',buildingController.getAllBuilding)
router.patch('/:id',multer.single('file'), buildingController.updateBuildingById)
router.delete('/:id',buildingController.deleteBuildingById)


module.exports = router;