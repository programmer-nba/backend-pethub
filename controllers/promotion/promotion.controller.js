const {Promotion}= require ("../../models/promotion/promotion.model")
const {ProductShall} =require("../../models/product/product.shall.model")
const {PackProducts} = require("../../models/product/productpack.model")
const {preorder_shopping}= require("../../models/ิbuy_product/buyproduct.model")
const {PromotionFree,validatePromotionFree} = require("../../models/promotion/promotionbyfree")
const dayjs = require("dayjs");


  exports.PromotionPercen = async (req, res) => {
    try {
        const id = req.params.id;
       const { name, description, discountPercentage, startDate, endDate } = req.body;
        const newPromotion = new Promotion({
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
  
  exports.PromotionfildAll = async (req, res) => {
    try {
      const promotion = await Promotion.find();
      if (promotion) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลโปรโมชั่นสำเร็จ",
          data: promotion,
        });
      } else {
        return res.status(404).send({message: "ไม่พบข้อมูลโปรโมชั่น", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };

 exports.PromotionfindId = async (req,res) =>{
    try {
      const id = req.params.id;
      const promotion = await Promotion.findOne({_id : id });
      console.log(promotion)
      if (promotion) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลโปรโมชั่นสำเร็จ",
          data: promotion,
        });
      } else {
        return res.status(404).send({ message: "ไม่พบข้อมูลโปรดมชั่น", status: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  }

  
  exports.Promotionbyfree = async (req, res) => {
    try {
      const { error } = validatePromotionFree(req.body);
      if (error) {
        return res.status(400).send({ status: false, message: error.details[0].message });
      }
  
      const { name, description, startDate, endDate, buyQty, freeQty } = req.body;
      const newPromotion = new PromotionFree({
        name: name,
        description: description,
        startDate: startDate || new Date(),
        endDate: endDate || new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        buyQty: buyQty,
        freeQty: freeQty,
      });
  
      // บันทึกข้อมูลโปรโมชั่นลงในฐานข้อมูล
      await newPromotion.save();
  
      return res.status(200).send({
        status: true,
        message: "บันทึกโปรโมชั่นสำเร็จ",
        data: newPromotion,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
        error: error.message,
      });
    }
  };