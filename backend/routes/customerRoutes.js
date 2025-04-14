const express = require('express');
const {authMiddleware, requireRole} = require("../middlewares/authMiddleware");
const customerController = require("../controllers/customerContoller");


const router = express.Router();


//products listed once customer login's
router.get("/products", authMiddleware,requireRole(['customer']), customerController.getAllProducts);
router.get("/products/:id", authMiddleware, requireRole(['customer']), customerController.getProductById);


//update route -> to add address and ph no. before ordering
router.put("/profile", authMiddleware,requireRole(['customer']) , customerController.updateCustomerDetails);


//orders
router.post("/orders", authMiddleware, requireRole(['customer']), customerController.createOrder);
router.get("/orders", authMiddleware, requireRole(['customer']), customerController.getAllOrders);
router.get("/orders/:id", authMiddleware, requireRole(['customer']), customerController.getOrderById);

module.exports=router;