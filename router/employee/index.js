const router = require("express").Router();
const employee = require("../../controllers/employee/employee.controller");
const auth = require("../../lib/auth");
const authAdmin= require("../../lib/auth.admin");
const product = require("../../controllers/product/product.shop.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");


router.get("/shop/:id", authAdmin, employee.findByShopId);

router.post("/", authAdmin, employee.create);

router.get("/", authAdmin, employee.fildAll);
router.get("/:id", authAdmin, employee.findOne);

router.delete("/:id", authAdmin, employee.deleteEmployee);
router.put("/:id", auth, employee.update);
router.put("/cancel/:id", auth, employee.calcelEmployee);
router.put("/confirm/:id", auth, employee.confirmEmployee);
 
//ส่งคืนสินค้า
router.post("/returnProduct/:id",auth,employee.Productback)
router.get("/show/getProductPack",auth, employee.fildAllProductPack)
router.put("/confirmProductReturn/:id",auth, employee.confirmProductReturn)

//ดูรายการส่งคืนสินค้า
router.get("/find/returnProduct",auth, employee.fildAllProductReturn)
router.get("/findOne/returnProduct/:id",auth, employee.fildOneProductReturn)

module.exports = router;