import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"Category"
    },
    price:{
        type:Number
    },
    discountPercentage:{
        type:Number
    },
    rating:{
        type:Number
    },
    stock:{
        type:Number
    },
    brand:{
        type:String
    },
    warrantyInformation:{
        type:String
    },
    shippingInformation:{
        type:String
    },
    thumbnail:{
        type:String
    }
    
})

export const Products = mongoose.model("product",productSchema);