const { ApprovedEmail, Rider, User } = require('../models/usersModel');
const { Product, Order } = require('../models/commerceModel');


//  to add an approved email to DB (admin/customer)
const approvedEmail = async (req, res) => {

  try {

    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ 
        message: "Email and role are required." 
      });
    }

    const exists = await ApprovedEmail.findOne({ email });

    if (exists) {
      return res.status(409).json({ message: "Email already approved." });
    }

    const approved = await ApprovedEmail.create({ email, role });

    return res.status(201).json({ 
        message: "Email approved successfully!", 
        approved 
    });

  } catch (error) {

    console.error("Internal server error in adding approved email:", error);

    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


// Create a product
const createProducts = async (req, res) => {

  try {
    const productData = req.body;
    const product = await Product.create(productData);

    return res.status(201).json({ 
        message: "Product created successfully!", 
        product:product 
    });

  } catch (error) {
    console.error("Internal server error in creating product:", error);

    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


// Create a rider 
const createRiders = async (req, res) => {

  try {

    const { name, email } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const existing = await Rider.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Rider already exists." });
    }

    const rider = await Rider.create({
      name,
      email,
      orderCount: 0 
    });

    return res.status(201).json({ 
        message: "Rider added successfully!", 
        rider:rider 
    });

  } catch (error) {
    console.error("Internal server error in creating rider:", error);

    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


// get all orders
const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("user_id", "name email")
      .populate("items.product_id");

    return res.status(200).json({ 
        message: "All orders fetched successfully!", 
        orders:orders 
    });

  } catch (error) {
    console.error("Internal server error in fetching orders:", error);

    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


// get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user_id", "name email address")
      .populate("items.product_id")
      .populate("rider_id", "name email orderCount");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ 
        message: "Order fetched successfully!", 
        order: order 
    });

  } catch (error) {

    console.error("Internal server error in fetching order:", error);

    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


// Update order status only
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Assign rider to an order
const assignRider = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { rider_id } = req.body;

    if (!rider_id) {
      return res.status(400).json({ message: "Rider ID is required" });
    }

    const rider = await Rider.findById(rider_id);
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { rider_id },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order count of rider
    rider.orderCount = (rider.orderCount || 0) + 1;
    await rider.save();
    
    return res.status(200).json({
      message: "Rider assigned to order successfully",
      order
    });
  } catch (error) {
    console.error("Error assigning rider to order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// get all riders so, the admin can assign orders
const getAllRiders = async (req, res) => {

  try {

    const riders = await Rider.find();

    return res.status(200).json({ 
        message: "Riders fetched successfully!", 
        riders:riders 
    });

  } catch (error) {

    console.error("Internal server error in fetching riders:", error);
    return res.status(500).json({ 
        message: "Internal server error!", 
        error: error.message 
    });
  }
};


module.exports = {
  approvedEmail,
  createProducts,
  createRiders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  assignRider,
  getAllRiders
};
