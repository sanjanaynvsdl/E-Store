const mongoose = require('mongoose');

//Users Collection {admin, customer role-based access}
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  },

  //update this data on order checkout, 
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    }
  },
  phone: {
    type: String,
    trim: true
  }
}, { timestamps: true });


const approvedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
  role: {
      type: String,
    enum: ['admin', 'customer'],
    required: true
}
},  { timestamps: true });


//Riders Collection
const riderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Rider = mongoose.model('Rider', riderSchema);
const ApprovedEmail = mongoose.model('ApprovedEmail', approvedEmailSchema);

module.exports = {
    User,
    ApprovedEmail,
    Rider
};

