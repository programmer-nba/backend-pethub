const router = require("express").Router();
const cashier = require("../../controllers/cashier/cashier.controller");
const auth = require("../../lib/auth");
const authAdmin= require("../../lib/auth.admin");
const product = require("../../controllers/product/product.shop.controller")
const ProductShops = require("../../controllers/product/product.shop.controller");
const authCashier = require("../../lib/auth.cashier")



router.post("/", authAdmin, cashier.create);
router.get("/getcashier/:id", authAdmin, cashier.findOneCashier);
router.get("/getAllcashier/:id" ,authAdmin ,cashier.findAllCashiire)
router.get("/showcashierall",authAdmin, cashier.getCashierAll);
router.put("/edit/:id", authCashier, cashier.updateCashier);
router.delete("/delete/:id",authAdmin, cashier.deleteCashier );
router.get("/getCategoryAllChs",authCashier, cashier.getCategoryAllChs)

router.post("/ProductReturn/:id",authCashier,cashier.ProductReturn)
router.get("/chk/ShowDetailsProduct/:id",authCashier,cashier.getDetailsProduct)
router.get("/chk/TypeMember", authCashier,cashier.findAllTypemember)
router.put("/UpdateProductAmount/:id",cashier.UpdateProductAmount)

router.get("/fildAllProducShalltReturn",authCashier,cashier.fildAllProducShalltReturn)
router.get("/fildOne/ProducShalltReturn/:id",authCashier,cashier.fildOneProducShalltReturn)
module.exports = router; 