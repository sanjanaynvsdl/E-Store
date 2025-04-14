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

//to update order_status and assing rider
router.put('/orders/:id/status', authMiddleware, requireRole(['admin']), adminController.updateOrderStatus);
router.put('/orders/:id/assign-rider', authMiddleware, requireRole(['admin']), adminController.assignRider);

// Get all riders
router.get('/riders', authMiddleware, requireRole(['admin']), adminController.getAllRiders);



module.exports=router;