const mongoose = require('mongoose');

// Product Collection
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Fan', 'AC'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  imagesByColor: [
    {
      color: {
        type: String,
        required: true,
        trim: true
      },
      imageUrl: {
        type: String,
        required: true,
        trim: true
      }
    }
  ],
  sizes: [String],
  colors: [String],
  variants: [
    {
      size: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });


// Order Collection
const orderSchema = new mongoose.Schema({
    user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
  items: [
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        required: true
    },
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}
],
total_price: {
    type: Number,
    required: true
},
status: {
    type: String,
    enum: ['Paid', 'Shipped', 'Delivered', 'Undelivered'],
    default: 'Paid'
},
rider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider'
},
},  { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Product,
  Order
};
