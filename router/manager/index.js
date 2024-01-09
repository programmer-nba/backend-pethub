const router = require("express").Router();
const authManager = require("../../lib/auth.manager")
const authAdmin = require("../../lib/auth.manager")
const manager = require("../../controllers/manager/manager.controller");
const { route } = require("..");


router.post("/create",authManager,manager.create);
router.get("/fildManagerAll",authManager,manager.fildManagerAll)
router.get("/fildManagerOne/:id",authManager,manager.fildManagerOne)
router.put("/updateManager/:id",authManager,manager.updateManager)
router.delete("/deleteManager/:id",authManager,manager.deleteManager)

module.exports = router; 