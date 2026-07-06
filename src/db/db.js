const mongoose =require("mongoose")

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is connected to the Db sucessfully");
}

module.exports=connectDB;