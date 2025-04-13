const express = require('express');
const router = express.Router();

router.get("/", (req,res)=>{
    return res.json({
        message:"orders routes are working!"
    })
});


module.exports=router;