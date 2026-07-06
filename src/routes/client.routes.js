const express=require("express")
const router=express.Router();
const clientControllers =require("../controllers/client.controllers")


//Creating the APIS

router.post("/register",clientControllers.registerClient);
router.get("/clientsId",clientControllers.getallclients);
router.post("/check",clientControllers.checkRateLimit);


module.exports=router;