import { body } from "express-validator";
import express from "express";
import { login, logout, signup, verified1 } from "../controller/user_controller.js";
 
const router = express.Router();

router.post("/",body("name","Name is required").notEmpty(),
body("email","Email is required").notEmpty(),body("email","Invalid Email").isEmail(),
body("password","Password is required").notEmpty(),
body("password","Minimum 8 and Maximum 12 letters is required").isLength({min:7,max:12}),
body("contact","Contact is required").notEmpty(),
body("contact","Only digits are allowed").isNumeric(),
body("contact","Invalid Mobile number(Length is 10)").isLength({min:10,max:10})
,signup);
router.post("/verification",verified1)

router.post("/login",login);
router.get("/logout",logout);

export default router;
