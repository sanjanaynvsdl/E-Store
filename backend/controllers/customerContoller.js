const { Product, Order } = require('../models/commerceModel');
const { User } = require('../models/usersModel');

// to get all products
const getAllProducts = async (req, res) => {

  try {
    const products = await Product.find();
    
    return res.status(200).json({ 
        message:"Successfully fetched all products!",
        products:products 
    });

  } catch (error) {

    console.error("Internal server error while fetching products : ", error);

    return res.status(500).json({ 
        message: "Internal server error!",
        error:error.message 
    });
  }
};


// get a single product by ID
const getProductById = async (req, res) => {

  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ 
            message: "Product not found" 
        });
    }
    return res.status(200).json({ 
        message:"Successfully fetched product details!",
        product:product 
    });

  } catch (error) {
    console.error("Internal server error in fetching product:", error);

    return res.status(500).json({ 
        message: "Internal server error!",
        error:error.message 
    });
  }
};

// Update customer details (address, phone)
const updateCustomerDetails = async (req, res) => {
  try {

    const { address, phone } = req.body;
    const customerId = req.user.id;

    const user = await User.findByIdAndUpdate(
      customerId,
      { address, phone },
      { new: true }
    );

    return res.status(200).json({ 
        message: "Profile updated", 
        user 
    });

  } catch (error) {
    console.error("Internal server error in Profile update : ", error);

    return res.status(500).json({ 
        message: "Internal server error!",
        error:error.message
    });
  }
};

// Create an order
const createOrder = async (req, res) => {

  try {
    const { items } = req.body; // each item: { product_id, size, color, price }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const total_price = items.reduce((acc, item) => acc + item.price, 0);
    const newOrder = await Order.create({
      user_id: req.user.id,
      items,
      total_price,
      status: 'Paid' 
    });

    return res.status(201).json({ 
        message: "Order placed successfully", 
        order: newOrder 
    });

  } catch (error) {
    console.error("Internal server error in Order creation : ", error);

    return res.status(500).json({ 
        message: "Internal server error!",
        error:error.message,
     });
  }
};

// get all orders of customer, (past-orders!)
const getAllOrders = async (req, res) => {

  try {

    const customerId = req.user.id;

    const orders = await Order.find({ user_id: customerId }).populate("items.product_id");

    return res.status(200).json({ 
        message:"Successfully fetched all orders of customer!",
        orders:orders 
    });

  } catch (error) {
    console.error("Internal server error in fetching user orders : ", error);
    return res.status(500).json({ 
        message: "Internal server error!",
        error:error.message,
     });
  }
};

// get single order by ID
const getOrderById = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user_id: customerId }).populate("items.product_id");

    if (!order) {
        return res.status(404).json({ 
            message: "Order not found" 
        });
    }

    return res.status(200).json({
        message:"Successfully fetched order details!",
        order: order 
    });

  } catch (error) {
    console.error("Internal server error in fetching order details : ", error);

    return res.status(500).json({ 
        message: "Internal server error!",
        error:error.message,
     });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  updateCustomerDetails,
  createOrder,
  getAllOrders,
  getOrderById
};
