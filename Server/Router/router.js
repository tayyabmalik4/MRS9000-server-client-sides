

const express = require("express");
const routes = require("../constants/routes");
const controllers = require("../Controller/index");
const router = express();



router.use(routes.AUTH, controllers.auth);
router.use(routes.BUILDING , controllers.building)
router.use(routes.DEPARTMENT , controllers.department)
router.use(routes.MACHINE , controllers.machine)
router.use(routes.DEVICE , controllers.device)
router.use(routes.METER , controllers.meter)


module.exports = router;