//create the server
const express=require("express")
const app=express();
const clientRoutes=require("./routes/client.routes")

//middleware
app.use(express.json());
app.use("/api/client",clientRoutes)

module.exports=app;