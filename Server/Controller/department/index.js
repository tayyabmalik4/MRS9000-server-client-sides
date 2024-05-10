const express = require("express");
const router = express();
const auth = require("../../middlewares/auth/auth")
const departmentController = require("./department");
const roles = require("../../constants/roles");
const multer = require('../../utils/multer.js')


router.use(auth.authenticate)

router.post('/',multer.single('file'),departmentController.addDepartment)
router.post('/get',departmentController.getAllDepartment)
router.patch('/:id',multer.single('file'), departmentController.updateDepartmentById)
router.delete('/:id',departmentController.deleteDepartmentById)


module.exports = router;