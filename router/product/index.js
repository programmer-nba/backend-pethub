const router = require("express").Router();
const product = require("../../controllers/product/product.controller.js");
const authAdmin = require("../../lib/auth.admin.js");

//สร้างสิ้นค้าที่เป็นเเพ็คเเละแบบเดียว
router.post("/create",authAdmin , product.create);
router.post("/createpack",authAdmin , product.createPack);
router.get("/chackpack",authAdmin , product.ChackPackAll);
router.get("/ChackPackById/:id",authAdmin , product.ChackPackById);
router.get("/chackPackByProduct/:id",product.ChackPackProductPack)
router.put("/editPackProduct/:id",product.UpdateProduckPack)
router.delete("/deletePackproduct/:id",product.deleteProductPack )
router.get("/getProductAlldozen/all" ,authAdmin,product.getProductAlldozen)
router.get("/getProductAllenvelope/all",authAdmin,product.getProductAllenvelope)
router.get("/getProductAllcrate/all",authAdmin,product.crateProductAll)

router.get("/",authAdmin, product.getProductAll);
router.get("/:id",authAdmin, product.getProductById);
router.put("/:id",authAdmin, product.updateProduct);
router.delete("/:id",authAdmin, product.deleteProduct);

module.exports = router; 