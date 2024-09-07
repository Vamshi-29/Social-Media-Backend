import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes";
import blogrouter from "./routes/blog-route";
const app=express()
app.use(express.json())
app.use("/api/user",router)
app.use("/api/blog",blogrouter)
mongoose.
connect(
"mongodb+srv://vamshicode7:9f0Eb4ERffNrZXRm@project2.xfxhb.mongodb.net/Blog_app"
)
.then(()=>app.listen(5000))
.then(()=>
    console.log("Connected to DB port : 5000")
)
.catch((err)=>console.log(err))

app.use("/api",function(req,res){

})

