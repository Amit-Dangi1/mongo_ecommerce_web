import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import UserRouter from "./routes/user_routes.js";

const app = express();

mongoose.connect(process.env.DB_URL).then(()=>{
   app.use(bodyParser.json())
   app.use(bodyParser.urlencoded({extended:true}));
   app.use("/user",UserRouter);
   app.use(cors());
   
   
   app.listen(process.env.PORT,()=>{
   console.log("Server Started...");
})
}).catch(err=>{
    console.log(err);
    
});
