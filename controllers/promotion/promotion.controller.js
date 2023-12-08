const {Promotion}= require ("../../models/promotion/promotion.model")
const {ProductShall} =require("../../models/product/product.shall.model")
const {PackProducts} = require("../../models/product/productpack.model")
const {preorder_shopping}= require("../../models/ิbuy_product/buyproduct.model")
const dayjs = require("dayjs");


  exports.PromotionPercen = async (req, res) => {
    try {
        const id = req.params.id;
      const { name, description, discountPercentage, startDate, endDate } = req.body;
       const  product = await ProductShall.findOne({ product_id:id });
        console.log(product)
      const newPromotion = new Promotion({
        product_id:product.product_id,
        name:req.body.name ,
        description:req.body.description ,
        discountPercentage:req.body.discountPercentage,
        startDate: startDate || new Date(),
        endDate: endDate || new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      });
  
      // บันทึกข้อมูลโปรโมชั่นลด 10% ลงในฐานข้อมูล
      await newPromotion.save();
  
      if (newPromotion) {
        return res.status(200).send({
          status: true,
          message: "บันทึก โปรโมชั่นสำเร็จ",
          data: newPromotion,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
        error: error.message,
      });
    }
  };
  