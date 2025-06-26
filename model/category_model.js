import mongoose from "mongoose";

const cateSchema = new mongoose.Schema({
    slug:{
        type:String,
        required:true,
        unique:true
    },
    url:{
        type:String
    },
    name:{
        type:String
    } 

});
export const Category = mongoose.model("Category",cateSchema);