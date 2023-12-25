const router = require("express").Router();
const supplier = require("../../controllers/supplier/supplier.controller.js");
const authAdmin = require("../../lib/auth.admin.js");

router.post("/create",authAdmin, supplier.create);
router.get("/", authAdmin, supplier.getSupplierAll);
router.get("/:id", authAdmin, supplier.getSupplierById);
router.put("/:id", authAdmin, supplier.updateSupplier);
router.delete("/:id", authAdmin, supplier.deleteSupplier);

router.put("/iden/:id", authAdmin, supplier.updateImgIden);
router.put("/bank/:id", authAdmin, supplier.updateImgBank);


//ดึงสินค้าจากซัพพายเออร์มาดู
router.get("/ShowProduct/:id" , supplier.ShowProduct);

module.exports = router;
