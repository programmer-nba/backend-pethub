const bcrypt = require("bcrypt");
const {Manager,validateManager} = require("../../models/user/manager.model")
const {Products,validateproduct} = require("../../models/product/product.model.js")
const {
  PreOrderProductShell,
} = require("../../models/product/preordershell.model.js");
const {Categorys,validatecategory} = require("../../models/product/category.model.js")
const {PreOrderProducts} = require("../../models/product/preorder.model");
const {ProductShops,validateProduct} = require("../../models/product/product.shop.model.js")
const {ReturnProduct} = require("../../models/product/return.product.model.js")
const {ProductShall,validateProductShall} =require("../../models/product/product.shall.model.js")
const {PackProducts} = require("../../models/product/productpack.model.js")
const {ReturnProductShall} = require("../../models/product/return.product.shell.model.js")
const {Member,validatemember} = require("../../models/user/member.model.js")
const {typeMember} =require("../../models/user/type.model.js")
const {Promotion} = require("../../models/promotion/promotion.model.js")
const {preorder_shopping} = require("../../models/ิbuy_product/buyproduct.model.js")
const {Shops,validateShop} =require("../../models/shop/shop.model.js")
const dayjs = require("dayjs");

