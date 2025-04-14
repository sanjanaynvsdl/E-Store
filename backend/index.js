require("dotenv").config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./models/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const riderRoutes = require("./routes/riderRoutes");


const app=express();

console.log("got the request!");
//middlewares
app.use(cors());
app.use(express.json());

//databse connection
connectDB();


app.get("/", (req,res)=>{
    res.json({
        message:"Gtg!"
    })
});

//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/rider", riderRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`)
});




