const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const order = require("../../models/order/order.model");
const {Admins, validateAdmin} = require("../../models/user/admin.model");
const {PreOrderProducts} = require("../../models/product/preorder.model");
const req = require("express/lib/request");

// exports.create = async(req,res) =>{
//     try{
//         var getID = await order.find().sort({order_id: -1}).limit(1)
//         console.log(getID)
//         var genOrderID = (parseInt(chkOrderID[0].order_id))+1
//         let dataVendor = {
//             order_id : genOrderID,
//             name : "warunyoooo",
//             productdetails : "111111"
//           }
//           const createorder= new order(dataVendor);
//           const createTypeData = await createorder.save();
//           return res.status(200).send({message:"สร้างสำเร็จ",data:createTypeData})
//      }catch(err){
//          res.status(500).send("ไม่สามารถเซฟได้")
//      }
//      }
//เรียกสินค้าจากหน้าพรีออเดอร์มาดู
exports.postPreorder = async(req,res) =>{
    const productId = req.body.productId

        try{
            // const preorders = await PreOrderProducts.find({status: productId})
            console.log(preorders)
            res.status(200).send(preorders) 
            if(!preorders){
                res.send("ไม่เจอ")
                
            }
            console.log(preorders)
            res.send({
                
            })
            
        
        }catch(error){
            console.log(error)
         res.status(500).send("ไม่สามารถเซฟได้")
        }
    }

    // exports.addProducts = async(req,res) =>{
    //     try{
    //     //   let data = {
    //     //     order_id: "2",
    //     //     orderItem: "['asd':'sssssssssss']",
    //     //     name: "Not Not",
    //     //     status: "Single",
    //     //     timestamps: Date.now()

    //     //   }
    //     //   const createOrder = new order(data);
    //     //   const createOrderData = await createOrder.save()
    //     var getID = req.body.data_id;
    //     var getPreproduct = await PreOrderProducts.find({_id:"655c77c30490f895afc057d9"});
         
    //     //    console.log("Status : ", getPreproduct[0].status)
    //     //  console.log("Status : ", getPreproduct[0].status.length)
    //      var indexLast = getPreproduct[0].status.length - 1;
    //      var chk_status = getPreproduct[0].status[indexLast].name;
    //       console.log(chk_status)
    //     const teatid = await PreOrderProducts.find({id: req.body._id})
    //     if(teatid.length > 0) {
    //         console.log("มีการสร้างไอดีนี้ไปแล้ว")
    //         return res.status(200).send({message: "มีการสร้างไอดีนี้ไปแล้ว"})
    //     }
    //     console.log("teatid", teatid )
    //     if(chk_status == "รอตรวจสอบ"){

    //     }else if (chk_status == "ยืนยันการสั่งชื้อ") {
            
    //         let data = {
    //                 shop_id: req.body._id,
    //                 invoice: getPreproduct[0].invoice,
    //                 employee_name: getPreproduct[0].employee_name,
    //                 product_detail:product_detailproduct_detail,
    //                 timestamps: Date.now()
        
    //               }
    //                const createOrder = new order(data);
    //                const createOrderData = await createOrder.save()
    //     }
    //     console.log(getPreproduct[0].invoice)
    //     return res.status(200).send({message:"Create Data Successfully", data: getID })
    //     }catch(error){
    //         console.log(error)
    //      res.status(500).send("ไม่สามารถเซฟได้")
    //     }
    // }


    exports.addProducts = async(req,res) =>{
        var chkOrderID = await order.find()
        try{
        var getPreproduct = await PreOrderProducts.find({_id:req.body._id});
         
           console.log("Status : ", getPreproduct)
        //  console.log("Status : ", getPreproduct[0].status.length)
         var indexLast = getPreproduct[0].status.length - 1;
         var chk_status = getPreproduct[0].status[indexLast].name;
          console.log(chk_status)
        const teatid = await PreOrderProducts.find({id: req.body._id})
        // if(teatid.length > 0) {
        //     console.log("มีการสร้างไอดีนี้ไปแล้ว")
        //     return res.status(200).send({message: "มีการสร้างไอดีนี้ไปแล้ว"})
        // }
        // console.log("teatid", teatid )

        console.log(chk_status)
                if (chk_status == "ยืนยันการสั่งซื้อ") {
                            
                            let data = {
                                    shop_id: req.body._id,
                                    invoice: req.body.invoice,
                                    employee_name: req.body.employee_name,
                                    product_detail:req.body.product_detail,
                                    timestamps: Date.now()
                        
                                  }
                                   const createOrder = new order(data);
                                   const createOrderData = await createOrder.save()

                                   return res.status(200).send({message:" สำเร็จ"})

            }
                
                        return res.status(500).send({message:"รายการนี้ยังไม่ได้ยืนยันการสั่งซื้อ"})


                
                //  const createOrder = new order(data);
                //  const createOrderData = await createOrder.save()
            }catch (error){
                console.error(error)
             res.status(500).send(error.message)

            }
        }


exports.AddPreorder = async (req,res) =>{

    try{
        // const data =  {
        //     shop_id ,
        //     invoice,
        //     employee_name ,
        //     product_name,
        //     product_detail,
        //     status,
        // } 

        const data = {
            shop_id:req.body.shop_id,
            invoice:req.body.invoice,
            employee_name:req.body.employee_name,
            product_name:req.body.product_name,
            product_detail: req.body.product_detail ,
            status:req.body.status ,
    }

        const preorder = await PreOrderProducts.create(data)
        return res.send(preorder)



    }catch(error){
        console.log(error)
        res.send("เพิ่มพรีออเดอร์สินค้าไม่ผ่าน")
    }
}