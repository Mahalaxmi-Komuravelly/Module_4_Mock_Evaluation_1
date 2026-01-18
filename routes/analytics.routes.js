import express from "express"
import { readData,writeData } from "./orders.routes.js";
export const AnalyticsRoutes = express.Router();

AnalyticsRoutes.get("/allorders",(req,res)=>{
    const data = readData();
    if (!data) {
        return res.status(500).json({ message: "Data Unavailable" })
    }
    let count = 0
    data.orders.forEach((order)=>{
        count++
    })
    res.status(200).json({message:"All orders list and count of orders",count,orders:data.orders})
})