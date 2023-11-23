const Joi = require("joi");
const mongoose = require("mongoose");


const ProductItemSchema = new mongoose.Schema({
    quantity :{
        type : Number,
        require : true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    employee_name :{
        type : Number,
        ref:'1111'
        },
    status:{
    type :String,
    default :true,

},
   

    
})

const OrderItem = mongoose.model("OrderItem", ProductItemSchema);

module.exports = OrderItem;
