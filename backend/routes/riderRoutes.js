const express = require('express');
const router = express.Router();

router.get("/", (req,res)=>{
    return res.json({
        message:"rider routes are working!"
    })
});


module.exports=router;1