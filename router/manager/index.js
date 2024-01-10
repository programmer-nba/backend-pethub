const router = require("express").Router();
const authManager = require("../../lib/auth.manager")
const authAdmin = require("../../lib/auth.manager")
const manager = require("../../controllers/manager/manager.controller");

//สร้างเมเนเจอร์
router.post("/create",authAdmin,manager.create);
router.get("/fildManagerAll",authAdmin,manager.fildManagerAll)
router.get("/fildManagerOne/:id",authAdmin,manager.fildManagerOne)
router.put("/updateManager/:id",authAdmin,manager.updateManager)
router.delete("/deleteManager/:id",authAdmin,manager.deleteManager)

//พรีออเดอร์
router.post("/preorderManager" ,authManager,manager.preorderManager)
router.get("/getPreorderAllManager",authManager,manager.getPreorderAllManager)

module.exports = router; 