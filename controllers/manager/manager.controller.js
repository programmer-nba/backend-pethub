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
const dayjs = require("dayjs");


exports.create = async (req, res) => {
    try {
      const {error} = validateManager(req.body);
      if (error) {
        return res
          .status(400)
          .send({status: false, message: error.details[0].message});
      }
      const user = await Manager.findOne({
        manager_username: req.body.manager_username,
      });
      if (user) {
        return res.status(400).send({
          status: false,
          message: "มีชื่อผู้ใช้งานนี้ในระบบเเล้ว",
        });
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.manager_password, salt);
        await new Manager({
          ...req.body,
          manager_password: hashPassword,
        }).save();
        return res.status(200).send({message: "สร้างข้อมูลสำเร็จ", status: true});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };
exports.fildManagerAll = async (req, res) => {
 
    try {
      const manager = await Manager.find();
      console.log("..............test...........")
      if (manager) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลผู้จัดการสำเร็จ",
          data: manager,
        });
      } else {
        return res.status(404).send({message: "ไม่พบผู้จัดการ", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
exports.fildManagerOne = async (req, res) => {
    try {
      const id = req.params.id
      const manager = await Manager.findById(id);
      if (manager) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลผู้จัดการสำเร็จ",
          data: manager,
        });
      } else {
        return res.status(404).send({message: "ไม่พบผู้จัดการ", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.updateManager = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({
          message: "ส่งข้อมูลผิดพลาด",
        });
      }
      const id = req.params.id;
      if (!req.body.manager_password) {
        const manager = await Manager.findByIdAndUpdate(id, req.body);
        if (manager) {
          if (manager) {
            return res
              .status(200)
              .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
          } else {
            return res
              .status(500)
              .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
          }
        }
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.manager_password, salt);
        const manager = await Manager.findByIdAndUpdate(id, {
          ...req.body,
          manager_password: hashPassword,
        });
        if (manager) {
          return res
            .status(200)
            .send({message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true});
        } else {
          return res
            .status(500)
            .send({message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false});
        }
      }
    } catch (error) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.deleteManager = async (req, res) => {
    try {
      const id = req.params.id;
      const manager = await Manager.findByIdAndDelete(id);
      if (!manager) {
        return res
          .status(404)
          .send({status: false, message: "ไม่พบข้อมูลผู้จัดการ"});
      } else {
        return res
          .status(200)
          .send({status: true, message: "ลบข้อมูลผู้จัดการสำเร็จ"});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };
  exports.getProductAllManager = async (req, res) => {
    try {
      const product = await Products.find();
      if (product) {
        return res
          .status(200)
          .send({message: "ดึงข้อมูลสินค้าสำเร็จ", status: true, data: product});
      } else {
        return res
          .status(500)
          .send({message: "ดึงข้อมูลสินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };
  exports.preorderManager = async (req, res) => {
    console.log(req.body);
    try {
      const { product_detail } = req.body;
      const { product_id, product_amount } = product_detail[0];
      console.log(product_detail)
      
      // ทำตรวจสอบจำนวนสินค้าที่มีอยู่ โดยใช้ตรวจสอบจากฐานข้อมูลเช่นกัน
      const availableProduct = await Products.findOne({ _id: product_id });
      if (!availableProduct || product_amount > availableProduct.quantity) {
        return res.status(400).send({
          status: false,
          message: "สินค้าไม่พอสำหรับการสั่งชื้อ",
        });
      }
      
      const status = {
        name: "รอตรวจสอบ",
        timestamps: dayjs(Date.now()).format(""),
      };
      
      const invoice = await invoiceNumber();
      const preordernumber = await orderNumber();
  
      const order_product = await new PreOrderProducts({
        ...req.body,
        invoice: invoice,
        ordernumber: preordernumber,
        status: status,
        timestamps: dayjs(Date.now()).format(""),
      }).save();
      
      if (order_product) {
        return res.status(200).send({
          status: true,
          message: "สั่งซื้อสินค้าทำเสร็จ",
          data: order_product,
        });
      } else {
        return res.status(500).send({
          message: order_product,
          status: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด222",
        status: false,
        error: error.message,
      });
    }
  };
  exports.getPreorderAllManager = async (req, res) => {
    try {
      const preorder_list = await PreOrderProducts.find();
      if (preorder_list) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
          data: preorder_list,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.getPreorderByIdManager = async (req, res) => {
    try {
      const shopId = req.params.id;
      const preorderList = await PreOrderProducts.find({ shop_id: shopId });
  
      if (preorderList && preorderList.length > 0) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
          data: preorderList,
        });
      } else {
        return res.status(404).send({
          message: "ไม่พบข้อมูลรายการสั่งซื้อสำหรับ shop_id ที่ระบุ",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาดในการดึงข้อมูล",
        status: false,
      });
    }
  }
  exports.candelPreorderManager = async (req, res) => {
    try {
      const id = req.params.id;
      const updateStatus = await PreOrderProducts.findOne({_id: id});
      console.log(updateStatus);
      if (updateStatus) {
        updateStatus.status.push({
          name: "ยกเลิกการสั่งซื้อ",
          timestamps: dayjs(Date.now()).format(""),
        });
        updateStatus.save();
        return res.status(200).send({
          status: true,
          message: "ยกเลิกการสั่งซื้อสำเร็จ",
          data: updateStatus,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.ImportStockShopManager = async (req, res) => {
    try {
      const orderId = req.params.id;
      const preorders = await PreOrderProducts.findOne({ordernumber: orderId});
  
      if (!preorders) {
        return res.send({status: false, message: "ไม่พบรหัสออเดอร์นี้"});
      }
      if (preorders.processed === "true") {
        return res.send({
          status: false,
          message: "รหัสสินค้านี้ไม่สามารถใช้ซ้ำได้",
        });
        // บันทึกข้อมูลว่า ordernumber นี้ถูกใช้แล้ว
      } else if (
        preorders.status.length > 0 &&
        preorders.status[preorders.status.length - 1].name === "ยืนยันการสั่งซื้อ" //ห้ามลืมดูชื่อที่ต้องการใช้งานน
      ) {
        for (let item of preorders.product_detail) {
          const product_shop = await ProductShops.findOne({
            product_id: item.product_id,
            shop_id: preorders.shop_id,
          });
          const product = await Products.findOne({_id: item.product_id});
      
          if (!product_shop) {
            console.log("สินค้ายังไม่มีในระบบ (เพิ่มสินค้า)");
            const new_product = {
              product_id: item.product_id,
              shop_id: preorders.shop_id,
              logo:product.logo,
              name: product.name,
              category:product.category,
              barcode: product.barcode,
              ProductAmount: item.product_amount,
              price_cost: product.price_cost,
              retailprice:product.retailprice,
              wholesaleprice:product.wholesaleprice,
              memberretailprice:product.memberretailprice,
              memberwholesaleprice:product.memberwholesaleprice,
            };
            await new ProductShops(new_product).save();
            console.log(new_product)
          } else {
            console.log("สินค้ามีในระบบแล้ว (เพิ่มจำนวนสินค้า)");
            const updatedAmount =
              item.product_amount + product_shop.ProductAmount;
  
            product_shop.ProductAmount = updatedAmount;
            product_shop.save();
  
            const products = await Products.findOne({
              _id: item.product_id,
            });
            //ลบจำนวนสินค้า
            products.quantity -= item.product_amount;
            await products.save();
            if (!updatedAmount) {
              return res
                .status(403)
                .send({status: false, message: "มีบางอย่างผิดพลาด"});
            }
          }
        }
        await PreOrderProducts.updateOne(
          {ordernumber: orderId},
          {processed: true}
        );
        
        return res
          .status(200)
          .send({status: true, message: "บันทึกข้อมูลสำเร็จ"});
      } else {
        // ถ้าไม่มีคำว่า 'ยืนยันการสั่งซื้อ' ใน status array ให้ return ค่าออกมา
        return res.send({
          status: false,
          message: "ไม่สามารถบันทึกข้อมูลได้ เนื่องจากยังไม่ยืนยันการสั่งซื้อ",
        });
      }
    } catch (error) {
      res.status(500).send({message: error.message, status: false});
    }
  };
  exports.updateProductManager = async (req,res) =>{
    try {
      const product = await ProductShops.findByIdAndUpdate(req.params.id, req.body);
      if (product) {
        return res
          .status(200)
          .send({message: "แก้ไขข้อมูลสินค้าสำเร็จ", status: true});
      } else {
        return res
          .status(500)
          .send({message: "แก้ไขข้อมูลสินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
  
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  }
  exports.ProductShopManager = async (req, res) => {
    try {
      const id = req.params.id;
      const preorder_list = await PreOrderProducts.findOne({ ordernumber: id });
      if (preorder_list) {
        // ตัวอย่างการแสดงข้อมูล product_detail เฉพาะ
        const product_detail = preorder_list.product_detail;
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
          product_detail,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  };
  exports.editProductManager = async (req, res) => {
    // console.log("จำนวนสินค้าตัวเดิม", req.body);
    try {
      const ordernumber = req.params.id // เปลี่ยน id เป็น ordernumber
      const productCount = await PreOrderProducts.findOne({ "ordernumber": ordernumber });
      if (!productCount) {
        return res.status(400).send({ message: "กรุณากรอก ordernumber ก่อน", status: false });
      }
      const productDetails = req.body.product_detail;
      console.log("จำนวนสินค้าที่ต้องการอัพเดดใหม่:", productDetails);
      const productIds = productDetails.map(product => product.product_id);
  
      for (let product of productDetails) {
        const result = await PreOrderProducts.updateMany(
          { "ordernumber": ordernumber, "product_detail.product_id": product.product_id },
          { $set: { "product_detail.$.product_amount": product.product_amount } }
        );
        if (result.nModified === 0) {
          return res.status(404).send({
            message: "ไม่พบข้อมูลสินค้าที่ต้องการแก้ไขหรือข้อมูลสินค้านั้นอาจจะไม่ถูกอัปเดต",
            status: false
          });
        }
      }
      return res.status(200).send({ message: "แก้ไขข้อมูลสินค้าสำเร็จ", status: true });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: "มีบางอย่างผิดพลาด", errorDetails: err });
    }
  };
  exports.ProductbackManager = async (req, res) => {
    try {
      const ordernumber = req.params.id;
      const productDetailsToRemove = req.body.product_detail;
      // ตรวจสอบว่ามีรายละเอียดสินค้าที่ต้องการลบหรือไม่
      if (!productDetailsToRemove || !productDetailsToRemove.length) {
        return res.status(400).send({
          message: "กรุณาระบุรายละเอียดสินค้าที่ต้องการส่งคืน",
          status: false,
        });
      }
      const preorder = await PreOrderProducts.findOne({ ordernumber: ordernumber });
      if (!preorder) {
        return res.status(500).send({
          message: "ไม่พบข้อมูลสินค้าจากการส่งกลับ",
          status: false,
        });
      }
      const productdetail =  preorder.product_detail
      const findreturn = productdetail.filter((item)=> item.product_id == req.body.product_detail[0].product_id)
      console.log(preorder)
      //บันทึกข้อมูลส่งสินค้ากลับ
      const returnProductInfo = new ReturnProduct({
        product_id: findreturn[0].product_id, 
        product_name: findreturn[0].product_name,
        product_amount: req.body.product_detail[0].product_amount, 
        product_logo: findreturn[0].product_logo,
        barcode:findreturn[0].barcode
      });
      const add = await returnProductInfo.save(); 
      // //ลบจำนวนที่หาย
      const dataedit ={
        product_id: findreturn[0].product_id, 
        product_name: findreturn[0].product_name,
        product_amount: findreturn[0].product_amount -req.body.product_detail[0].product_amount, 
        product_logo: findreturn[0].product_logo,
        barcode:findreturn[0].barcode
      }
      const filerpreorder = preorder.product_detail.filter((item)=> item.product_id != req.body.product_detail[0].product_id)
      if(findreturn[0].product_amount -req.body.product_detail[0].product_amount>0)
      {
        filerpreorder.push(dataedit)
      }
      await PreOrderProducts.updateOne(
        { ordernumber: ordernumber },
        { product_detail: filerpreorder}
      );
      return res.status(200).send({
        status: true,
        message: "ลบสินค้าสำเร็จ",
        data:filerpreorder
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: error.message,
        status: false,
      });
    }
  };
  exports.getStockManager = async (req, res) => {
    try {
      const id = req.params.id;
  
      const mystock = await ProductShops.find({shop_id:id}); //{shop_id:id} เอาใส่ไว้ใน() findOne
  
      return res.send(mystock);
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.getPreorderStoreAllMager = async (req, res) => {
    try {
      const shop_id = req.params.id; 
  
      if (!shop_id) {
        return res.status(400).send({
          message: "กรุณาระบุ shop_id",
          status: false,
        });
      }
  
      const preorder_list = await PreOrderProductShell.find({ shop_id: shop_id });
  
      if (preorder_list) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
          data: preorder_list,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  };
  exports.confirmMabager = async (req, res) => {
    try {
      const id = req.params.id;
      const updateStatus = await PreOrderProductShell.findOne({_id: id});
      console.log(updateStatus);
      if (updateStatus) {
        updateStatus.status.push({
          name: "ยืนยันการสั่งซื้อ",
          timestamps: dayjs(Date.now()).format(""),
        });
        updateStatus.save();
        return res.status(200).send({
          status: true,
          message: "ยืนยันการสั่งซื้อสำเร็จ",
          data: updateStatus,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.cancelMabager = async (req, res) => {
    try {
      const id = req.params.id;
      const updateStatus = await PreOrderProductShell.findOne({_id: id});
      console.log(updateStatus);
      if (updateStatus) {
        updateStatus.status.push({
          name: "ยืนยันการยกเลิกสั่งซื้อ",
          timestamps: dayjs(Date.now()).format(""),
        });
        updateStatus.save();
        return res.status(200).send({
          status: true,
          message: "ยืนยันการยกเลิกสั่งซื้อสำเร็จ",
          data: updateStatus,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.ShippingManager= async (req, res) => {
    try {
      const id = req.params.id;
      const updateStatus = await PreOrderProductShell.findOne({_id: id});
      console.log(updateStatus);
      if (updateStatus) {
        updateStatus.status.push({
          name: "สถาณะกำลังจัดส่งสินค้า",
          timestamps: dayjs(Date.now()).format(""),
        });
        updateStatus.save();
        return res.status(200).send({
          status: true,
          message: "ยืนยันการจัดส่งสินค้า",
          data: updateStatus,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.fildAllProductReturnManager = async (req, res) => {
    try {
      const employee = await ReturnProduct.find();
      if (employee) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
          data: employee,
        });
      } else {
        return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.fildOneProductReturnManager = async (req, res) => {
    try {
      const id = req.params.id
      const employee = await ReturnProduct.findById(id);
      if (employee) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการส่งคืนสินค้าสำเร็จ",
          data: employee,
        });
      } else {
        return res.status(404).send({message: "ไม่พบรายการส่งคืนสินค้า", status: false});
      }
    } catch (err) {
      res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.DetailsStockManager = async (req, res) => {
    try {
      const id = req.params.id;
  
      const mystock = await ProductShops.find({ shop_id: id }); //{shop_id:id} เอาใส่ไว้ใน() findOne
  
      return res.send(mystock);
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.ShowProductAllManager = async (req, res) => {
    try {
      const shop_id = req.params.id;
      console.log(shop_id)
      const product = await ProductShall.find({shop_id:shop_id});
      if (product) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลสินค้าสำเร็จ",
          data: product,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.getCategoryAllManager = async (req, res) => {
    try {
      const category = await Categorys.find();
      if (category) {
        return res
          .status(200)
          .send({message: "ดึงประเภทสินค้าสำเร็จ", status: true, data: category});
      } else {
        return res
          .status(500)
          .send({message: "ดึงประเภทสินค้าไม่สำเร็จ", status: false});
      }
    } catch (err) {
      return res.status(500).send({status: false, message: "มีบางอย่างผิดพลาด"});
    }
  };
  exports.preorderProductShallManager = async (req, res) => {
    console.log(req.body)
     try {
       const { product_detail } = req.body;
       const { product_id, product_amount } = product_detail[0];
       // ทำตรวจสอบจำนวนสินค้าที่มีอยู่ โดยใช้ตรวจสอบจากฐานข้อมูลเช่นกัน
       const availableProduct = await ProductShops.findOne({ product_id });
       if (!availableProduct || product_amount > availableProduct.ProductAmount) {
         return res.status(400).send({
           status: false,
           message: "สินค้าไม่พอสำหรับการสั่งชื้อ",
         });
       }
       // ถ้าจำนวนพอเพียง ก็ทำการสร้างคำสั่งซื้อ
       const status = {
         name: "รอตรวจสอบ",
         timestamps: dayjs(Date.now()).format(""),
       };
       const ordernumbershell = await orderNumberShell();
       const invoice = await invoiceShellNumber();
       const order_product = await new PreOrderProductShell({
         ...req.body,
         invoice: invoice,
         ordernumbershell: ordernumbershell,
         status: status,
         timestamps: dayjs(Date.now()).format(""),
       }).save();
   
       if (order_product) {
         return res.status(200).send({
           status: true,
           message: "สั่งซื้อสินค้าทำเสร็จ",
           data: order_product,
         });
       } else {
         return res.status(500).send({
           message: order_product,
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
  exports.getPreorderStoreAllManager = async (req, res) => {
    try {
      const shop_id = req.params.id; 
  
      if (!shop_id) {
        return res.status(400).send({
          message: "กรุณาระบุ shop_id",
          status: false,
        });
      }
  
      const preorder_list = await PreOrderProductShell.find({ shop_id: shop_id });
  
      if (preorder_list) {
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
          data: preorder_list,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  };
  exports.PreorderCancelManager = async (req, res) => {
    try {
      const id = req.params.id;
      const updateStatus = await PreOrderProductShell.findOne({_id: id});
      console.log(updateStatus);
      if (updateStatus) {
        updateStatus.status.push({
          name: "ยกเลิกการสั่งซื้อ",
          timestamps: dayjs(Date.now()).format(""),
        });
        updateStatus.save();
        return res.status(200).send({
          status: true,
          message: "ยกเลิกการสั่งซื้อสำเร็จ",
          data: updateStatus,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({message: "มีบางอย่างผิดพลาด", status: false});
    }
  };
  exports.PreorderManagerShall = async (req, res) => {
    try {
      const orderId = req.params.id;
      const preorders = await PreOrderProductShell.findOne({
        ordernumbershell: orderId,
      });
  
      if (!preorders) {
        return res.send({ status: false, message: "ไม่พบรหัสออเดอร์นี้" });
      }
  
      if (preorders.processed === "true") {
        return res.send({
          status: false,
          message: "รหัสสินค้านี้ไม่สามารถใช้ซ้ำได้",
        });
      } else if (
        preorders.status.length > 0 &&
        preorders.status[preorders.status.length - 1].name === "ยืนยันการสั่งซื้อ"
      ) {
        for (let item of preorders.product_detail) {
          const pack = await PackProducts.findOne({ product_id: item.product_id });
          let amount = 0;
  
          if (!pack) {
            amount = item.product_amount * 1;
          } else {
            amount = item.product_amount * pack.amount;
          }
          const productInfo = await Products.findOne({ _id: item.product_id });
          const category = productInfo ? productInfo.category : null;
          const product_shall = await ProductShall.findOne({
            product_id: item.product_id,
            shop_id: preorders.shop_id,
          });
  
          if (!product_shall) {
            console.log("สินค้ายังไม่มีในระบบ (เพิ่มสินค้า)");
  
            const new_product = {
              product_id: item.product_id,
              shop_id: preorders.shop_id,
              logo:item.product_logo,
              name: item.product_name,
              category:category,
              barcode: item.barcode,
              ProductAmount: amount,
              price_cost: productInfo.price_cost,
              retailprice:productInfo.retailprice,
              wholesaleprice:productInfo.wholesaleprice,
              memberretailprice:productInfo.memberretailprice,
              memberwholesaleprice:productInfo.memberwholesaleprice,
            };
  
            await new ProductShall(new_product).save();
            console.log(new_product)
          } else {
            console.log("สินค้ามีในระบบแล้ว (เพิ่มจำนวนสินค้า)");
  
            const updatedAmount = product_shall.ProductAmount + amount;
            product_shall.ProductAmount = updatedAmount;
            await product_shall.save();
  
            //ค้นหา
            const product_shop = await ProductShops.findOne({
              product_id: item.product_id,
            });
            //ลบจำนวนสินค้า
            product_shop.ProductAmount -= amount;
            await product_shop.save();
  
            if (!updatedAmount) {
              return res
                .status(403)
                .send({ status: false, message: "มีบางอย่างผิดพลาด" });
            }
          }
        }
  
        await PreOrderProductShell.updateOne(
          { ordernumbershell: orderId },
          { processed: true }
        );
  
        return res
          .status(200)
          .send({ status: true, message: "บันทึกข้อมูลสำเร็จ" });
      } else {
        return res.send({
          status: false,
          message: "ไม่สามารถบันทึกข้อมูลได้ เนื่องจากยังไม่ยืนยันการสั่งซื้อ",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message, status: false });
    }
  };
  exports.DetailsProductManager = async (req, res) => {
    try {
      const id = req.params.id;
      const preorder_list = await PreOrderProductShell.findOne({ ordernumbershell: id });
      if (preorder_list) {
        // ตัวอย่างการแสดงข้อมูล product_detail เฉพาะ
        const product_detail = preorder_list.product_detail;
        return res.status(200).send({
          status: true,
          message: "ดึงข้อมูลรายการสั่งซื้อสำเร็จ",
          product_detail,
        });
      } else {
        return res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      }
    } catch (error) {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  };




  


  async function invoiceNumber(date) {
    const order = await PreOrderProducts.find();
    let invoice_number = null;
    if (order.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + num;
        check = await PreOrderProducts.find({invoice: data});
        if (check.length === 0) {
          invoice_number =
            `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      invoice_number =
        `PETHUB${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + "1";
    }
    return invoice_number;
  }
  //ค้นหาเเละสร้างเลข ordernumber คือเลขนำเข้าสินค้า
  async function orderNumber(date) {
    const order = await PreOrderProducts.find();
    let order_number = null;
    if (order.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `ORDER${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
        check = await PreOrderProducts.find({ordernumber: data});
        if (check.length === 0) {
          order_number =
            `ORDER${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      order_number =
        `ORDER${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
    }
    return order_number;
  }
  async function orderNumberShell(date) {
    const order = await PreOrderProductShell.find();
    let store_number = null;
    if (order.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `STORE${dayjs(date).format("YYYYMMDD")}`.padEnd(11, "0") + num;
        check = await PreOrderProductShell.find({ordernumbershell: data});
        if (check.length === 0) {
          store_number =
            `STORE${dayjs(date).format("YYYYMMDD")}`.padEnd(11, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      store_number =
        `STORE${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
    }
    return store_number;
  }
  async function invoiceShellNumber(date) {
    const order = await PreOrderProductShell.find();
    let invoice_shell = null;
    if (order.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `STORE${dayjs(date).format("YYYYMMDD")}`.padEnd(14, "0") + num;
        check = await PreOrderProductShell.find({invoice: data});
        if (check.length === 0) {
          invoice_shell =
            `STORE${dayjs(date).format("YYYYMMDD")}`.padEnd(14, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      invoice_shell =
        `STORE${dayjs(date).format("YYYYMMDD")}`.padEnd(15, "0") + "1";
    }
    return invoice_shell;
  }
