const router = require("express").Router();
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");
const Product = require("../../controllers/product/product.controller");
const Category = require("../../controllers/product/category.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const order = require("../../controllers/order/order.controller")
const authCashier = require("../../lib/auth.cashier");
router.post("/", auth, ProductShops.create);
router.get("/", auth, Product.getProductAll);
router.get("/category", auth, Category.getCategoryAll);
router.get("/shop-id/:id", auth, ProductShops.findByShopId);
//admin
router.get("/admin/shop-id/:id", authAdmin, ProductShops.findByShopId);



//เพิ่มเข้าสต๊อกสินค้า

//ยกเลิก
router.put("/preorder/employee/cancel/:id", auth, ProductShops.candelPreorderEmyee);
//พนักงานพรีออเดอร์สินค้า
router.post("/employee/stock/:id", auth, ProductShops.ImportStockShop);
router.get("/employee/stock", auth, ProductShops.getStock);
router.get("/employee/checkEmpStock/:id", auth, ProductShops.checkEmpStock);
router.get("/admin/checkStock/:id", authAdmin, ProductShops.checkEmpStockAdmin);
// router.get("/employee/stocksmall/:id", auth,  ProductShops.getStockById);ยังไมาได้ใช้

//พนักงานพรีออเดอร์สินค้าเเละเพิ่มสินค้าแบบเป็นเเพ็คเข้า stock
router.post("/employee/PreorderEmpShall/:id", authCashier, ProductShops.PreorderEmpShall); 
router.get("/employee/chkProductShall", ProductShops.getStockShall);
router.get("/employee/checkProductShall/:id", authCashier , ProductShops.checkProductShall);
router.put("/employee/checkProductShall/:id", ProductShops.updatePrice);
router.put("/employee/editupdateProduct/:id", ProductShops.updateProduct);
router.put("/cashier/addpromotion/:id", authCashier , ProductShops.updatePromotion)



//router.post("/preorder", auth, order.AddPreorder);//test

//การพรีออเดอร์มา
router.post("/preorder", auth, ProductShops.preorderProduct);
router.get("/preorder", auth, ProductShops.getPreorderAll);
//การพรีออกเดอร์จาก shall มาขอที่ stock
router.post("/preorder/packproduct", authCashier, ProductShops.preorderProductShall);
router.get("/preorder/packproduct", authCashier , ProductShops.getPreorderStoreAll)
router.get("/preorder/packproductone/:id", authCashier , ProductShops.getPreorderStoreAId);
//preorder พรีออเดอร์ไปที่จาก shall ไป shop
router.get("preorder/shalltostock",auth , ProductShops.addProductsShall);
//คำสั่งเปลี่ยนสถาณะออเดอร์ของพนักงาน shell ต่อ พนักงานสต๊อก
router.put("/preorder/confirmstatusshall/:id", auth , ProductShops.confirmShallPreorder)
router.put("/preorder/cancelstatusshall/:id", auth , ProductShops.cancelShallPreorder)
router.put("/preorder/statusshall/:id", auth , ProductShops.statusshall)

//เเอดมินดึงออเดอร์สินค้ามาดู
router.get("/preordershall/admin", authAdmin, ProductShops.getPreorderShallAll)
router.get("/preordershall/adminById/:id", authAdmin, ProductShops.getPreorderAdminById)
router.get("/preorder/admin", authAdmin, ProductShops.getPreorderAll);
router.get("/preorder/:id",auth, ProductShops.getPreorderEmpById)

//preorder พรีออเดอร์ไปที่ shop 
router.get("preorder/admin", authAdmin, ProductShops.addProducts)
router.get("/preorder/:id", auth, ProductShops.getPreorderById);
router.get("/preorder/admin/:id", authAdmin, ProductShops.getPreorderById);



//confrim
router.put("/preorder/admin/confirm/:id", authAdmin, ProductShops.confirmPreorder);
//cancel
router.put("/preorder/admin/cancel/:id", authAdmin, ProductShops.cancelPreorder);
//คำสั่งเปลี่ยนสถานะเป็น นำเข้าสต๊อกสิน
router.put("/preorder/admin/statusaddPreorder/:id", authAdmin, ProductShops.statusaddPreorder);
//สถาณะการสั่งชื้อสินค้า
router.put("/preorder/admin/addStatus/:id", authAdmin, ProductShops.statusPreorder);





module.exports = router;