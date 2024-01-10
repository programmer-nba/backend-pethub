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
router.get("/getProductAllManager",authManager,manager.getProductAllManager)
router.post("/preorderManager" ,authManager,manager.preorderManager)
router.get("/getPreorderAllManager",authManager,manager.getPreorderAllManager)
router.get("/getPreorderByIdManager/:id",authManager,manager.getPreorderByIdManager)
router.put("/candelPreorderManager/:id",authManager,manager.candelPreorderManager)

//เพิ่มสินค้าเข้าคลังสินค้า
router.post("/ImportStockShopManager/:id",authManager,manager.ImportStockShopManager)
router.put("/updateProductManager/:id",authManager,manager.updateProductManager)
router.get("/ProductShopManager/:id",authManager,manager.ProductShopManager)
router.put("/editProductManager/:id",authManager,manager.editProductManager)
router.post("/ProductbackManager/:id",authManager,manager.ProductbackManager)
router.get("/getStockManager/:id",authManager,manager.getStockManager)

//อนุมัติการสั่งชื้อสินค้าเเละดูออเดอร์จาก sall
router.get("/getPreorderStoreAllMager/:id",authManager,manager.getPreorderStoreAllMager)
router.put("/confirmMabager/:id",authManager,manager.confirmMabager)
router.put("/cancelMabager/:id",authManager,manager.cancelMabager)
router.put("/ShippingManager/:id",authManager,manager.ShippingManager)

//ส่งคืนสินค้า
router.get("/fildAllProductReturnManager",authManager,manager.fildAllProductReturnManager)
router.get("/fildOneProductReturnManager/:id",authManager,manager.fildOneProductReturnManager)

//ดูสินค้าจาก shop
router.get("/DetailsStockManager/:id",authManager,manager.DetailsStockManager)
router.get("/ShowProductAllManager/:id",authManager,manager.ShowProductAllManager)
router.get("/getCategoryAllManager",authManager,manager.getCategoryAllManager)

//พรีออเดอร์สินค้าจาก shall โดยเมเนเจอร์
router.post("/preorderProductShallManager",authManager,manager.preorderProductShallManager)
router.get("/getPreorderStoreAllManager/:id",authManager,manager.getPreorderStoreAllManager)
router.put("/PreorderCancelManager/:id",authManager,manager.PreorderCancelManager)

//เพิ่มสินค้าเข้าคลังโดย manager
router.post("/InsertManagerShall/:id",authManager,manager.PreorderManagerShall)
router.get("/DetailsProductManager/:id",authManager,manager.DetailsProductManager)

module.exports = router; 