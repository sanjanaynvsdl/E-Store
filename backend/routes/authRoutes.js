const express = require('express');

const router = express.Router();

// router.post("/signin", authController.signin);
router.get("/", (req,res)=>{
    res.send("cool_auth routes are working!!")
});


module.exports=router;