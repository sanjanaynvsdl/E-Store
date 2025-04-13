const express = require('express');
const authController = require("../controllers/authController")

const router = express.Router();
router.post("/user/signin", authController.userSignIn);
router.post("/rider/signin", authController.riderSignIn);




module.exports=router;