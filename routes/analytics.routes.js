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
AnalyticsRoutes.get("/cancelled-orders",(req,res)=>{
    const data = readData();
    if (!data) {
        return res.status(500).json({ message: "Data Unavailable" })
    }
    const cancelledOrders = data.orders.filter((o)=>o.status === "cancelled");
    if(cancelledOrders.length===0){
        return res.status(400).json({message:"There are no cancelled orders"})
    }
    else{
    res.status(200).json({message:"All cancelled orders",cancelledOrders})

    }
})