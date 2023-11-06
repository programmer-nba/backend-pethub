const router = require("express").Router();
const category = require("../../controllers/product/category.controller.js");
const authAdmin = require("../../lib/auth.admin.js");

router.post("/create",authAdmin , category.create);
router.get("/list",authAdmin, category.getCategoryAll);
router.get("/:id",authAdmin, category.getCategoryById);
router.put("/:id",authAdmin, category.updateCategory);
router.delete("/:id",authAdmin, category.deleteCategory);

module.exports = router; 