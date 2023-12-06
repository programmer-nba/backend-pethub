const router = require("express").Router();
const shop = require("../../controllers/shop/shop.controller.js");
const authAdmin = require("../../lib/auth.admin.js");


router.post("/create",authAdmin, shop.create);
router.get("/", authAdmin, shop.getShopAll);
router.get("/:id", authAdmin, shop.getShopById);
router.put("/:id", authAdmin, shop.updateShop);
router.delete("/:id", authAdmin, shop.deleteShop);

module.exports = router;
