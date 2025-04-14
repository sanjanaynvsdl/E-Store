const express = require('express');
const router = express.Router();
const {authMiddleware, requireRole}=require('../middlewares/authMiddleware');
const riderController = require("../controllers/riderController");


router.get("/profile", authMiddleware, requireRole(['rider']), riderController.getProfile);
router.get("/orders", authMiddleware, requireRole(['rider']), riderController.getAssignedOrders);
router.get('/orders/:id', authMiddleware, requireRole(['rider']), riderController.getOrderById);
router.put("/orders/:id/status", authMiddleware, requireRole(['rider']), riderController.updateOrderStatus);


module.exports=router;