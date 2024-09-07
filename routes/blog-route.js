import express from "express";
import { addblog, deletebyid, getallblogs, getbyid, getuserbyid, update } from "../controllers/blog-controller";
const blogrouter=express.Router()
blogrouter.get("/",getallblogs)
blogrouter.post("/add",addblog)
blogrouter.put("/update/:id",update);
blogrouter.get("/:id",getbyid)
blogrouter.delete("/:id",deletebyid)

blogrouter.get("/user/:id",getuserbyid)

export default blogrouter;