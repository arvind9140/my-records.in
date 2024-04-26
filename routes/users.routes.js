import { Router } from "express";

import { getUserData, refreshAccessToken, sendOtp, verifyOtp } from "../controllers/userControllers/user.controllers.js";
import { errorHandler } from "../utils/apiError.js";
import {  loginUser, logoutUser } from "../controllers/userControllers/login.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { contactUs } from "../controllers/contact/contact.js";


const router = Router();

router.route("/refresh-token").post(refreshAccessToken, errorHandler)

router.route("/sendOtp").post(sendOtp,errorHandler);
router.route("/verify/createuser").post(verifyOtp,  errorHandler);
router.route("/login").post(loginUser,  errorHandler);
router.route("/logout").post(verifyJWT ,logoutUser, errorHandler);
router.route("/getuser-data/:id").get(verifyJWT, getUserData,errorHandler);
router.route("/send-contact").post(contactUs);















export default router