import { Products } from "../model/products_model_";

export const savainBulk = async(request,response,next)=>{
try {

    let data = await Products.create(request.body);
} catch (error) {
    console.log(error);

    
}
}