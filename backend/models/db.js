const mongoose = require("mongoose")

async function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Successfully connected to mongodb");
    })
    .catch((err)=>{
        console.error(`Error while connecting to db : ${err}`)
    })
}

module.exports=connectDB;