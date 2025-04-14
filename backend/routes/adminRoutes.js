const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminContoller');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');


// routes to add intial data to DB, 
// used this routes to add data from postman easily

router.post('/add-approved-email', adminController.approvedEmail);
router.post('/products', adminController.createProducts);
router.post('/riders', adminController.createRiders);


router.get('/orders', authMiddleware, requireRole(['admin']), adminController.getAllOrders);
router.get('/orders/:id', authMiddleware, requireRole(['admin']), adminController.getOrderById);

//update order status and assign a rider
router.put('/orders/:id', authMiddleware, requireRole(['admin']), adminController.updateOrderStatus);
router.get('/riders', authMiddleware, requireRole(['admin']), adminController.getAllRiders);



module.exports=router;