const { Rider } = require('../models/usersModel');
const { Order } = require('../models/commerceModel');


// get-rider profile
const getProfile = async (req, res) => {
  try {
    const riderId = req.user.id;

    const rider = await Rider.findById(riderId);

    if (!rider) {
      return res.status(404).json({ 
            message: "Rider not found" 
        });
    }

    return res.status(200).json({
      message: "Rider profile fetched successfully",
      profile: {
        name: rider.name,
        email: rider.email,
        orderCount: rider.orderCount
      }
    });

  } catch (error) {
    
    console.error("Internal server error in fetching rider profile:", error);
    return res.status(500).json({ 
        message: "Internal server error!",
        error: error.message 
    });
  }
};


// get all assigned orders for the ride
const getAssignedOrders = async (req, res) => {
  try {
    const riderId = req.user.id;

    const orders = await Order.find({ rider_id: riderId })
      .populate("user_id", "name address phone")
      .populate("items.product_id");

    return res.status(200).json({
      message: "Assigned orders fetched successfully",
      orders
    });

  } catch (error) {
    console.error("Internal server error in fetching rider orders : ", error);

    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


// update order_staus, 
const updateOrderStatus = async (req, res) => {
  try {
    const riderId = req.user.id;
    const orderId = req.params.id;
    const { status } = req.body;

    if (!['Delivered', 'Undelivered'].includes(status)) {
      return res.status(400).json({ 
            message: "Invalid status" 
        });
    }

    const order = await Order.findOne({ _id: orderId, rider_id: riderId });

    if (!order) {
      return res.status(404).json({ 
            message: "Order not found or not assigned to you" 
        });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: `Order status updated to ${status}`,
      order
    });

  } catch (error) {
    console.error("Internal server error in updating order status:", error);

    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


module.exports = {
  getProfile,
  getAssignedOrders,
  updateOrderStatus
};
