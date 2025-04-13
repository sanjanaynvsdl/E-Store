require("dotenv").config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./models/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const riderRoutes = require("./routes/riderRoutes");


const app=express();

//middlewares
app.use(cors());
app.use(express.json());

//databse connection
connectDB();


//routes
app.get("/", (req,res)=>{
    res.json({
        message:"Gtg!"
    })
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/rider", riderRoutes);


app.listen(3000,()=>{
    console.log("Server is listening to port 3000")
});




