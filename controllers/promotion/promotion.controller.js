const {productpethubs}= require ("../../models/promotion/promotion.model")
const {ProductShall} =require("../../models/product/product.shall.model")
const {PackProducts} = require("../../models/product/productpack.model")
const dayjs = require("dayjs");

exports.createPromotionId = async (req, res) => {
    try {
    
        const product_id = req.params.product_id;
        const productpomotion = await ProductShall.findOne({product_id:product_id});
        const packpromotion = await PackProducts.findOne({product_id:product_id})
        // console.log("productpomotion:", packpromotion);
        // console.log("productpomotion:", productpomotion);
        if (productpomotion) {
          const amount = req.body.amount;
          const price_cost = req.body.price_cost; // เพิ่มบรรทัดนี้
          // const total_price = (price_cost * amount).toFixed(2);; // ใช้ price_cost ที่ระบุจาก request body
          const promotion = {
            product_id: productpomotion.product_id,
            logo:packpromotion.logo,
            name: packpromotion.name,
            name_product:packpromotion.name_pack,
            barcode: packpromotion.barcode,
            price_cost:req.body.price_cost,
            percent_timestamp:dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            amount: amount,
          };
    
        //   บันทึกข้อมูลลงใน MongoDB
          const order_product = await new productpethubs(promotion).save();
    
          if (order_product) {
            return res.status(200).send({
              status: true,
              message: "เพิ่มสิ้นค้าสำเร็จ",
              data: order_product,
            });
          } else {
            return res.status(500).send({
              message: "มีบางอย่างผิดพลาดในการบันทึกข้อมูล",
              status: false,
            });
          }
        } else {
          return res.status(404).send({
            message: "ไม่พบสินค้าที่ตรงกับ product_id ที่ระบุ",
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