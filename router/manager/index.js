const router = require("express").Router();
const authManager = require("../../lib/auth.manager")
const authAdmin = require("../../lib/auth.admin")
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
router.get("/getPreorderByIdManager/:id",authManager,manager.getPreorderByIdManager)
router.put("/candelPreorderManager/:id",authManager,manager.candelPreorderManager)

//เพิ่มสินค้าเข้าคลังสินค้า
router.post("/ImportStockShopManager/:id",authManager,manager.ImportStockShopManager)
router.put("/updateProductManager/:id",authManager,manager.updateProductManager)
router.get("/ProductShopManager/:id",authManager,manager.ProductShopManager)
router.put("/editProductManager/:id",authManager,manager.editProductManager)


module.exports = router; 