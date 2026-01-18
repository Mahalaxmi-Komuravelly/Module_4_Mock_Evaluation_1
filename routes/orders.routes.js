import express from "express"
import fs from "fs"
export const OrdersRoutes = express.Router();

function readData(){
    const data = fs.readFileSync("./db.json","utf-8")
    return JSON.parse(data)
}

function writeData(data){
    fs.writeFileSync("./db.json",JSON.stringify(data,null,2))
}
OrdersRoutes.post("/",(req,res)=>{
    const data = readData();
    if(!data){
        return res.status(500).json({message:"Data Unavailable"})
    }
    const {productId,quantity} = req.body || {};
    const product = data.products.find((p)=>p.id === productId)
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }
    if(product.stock === 0){
        return res.status(400).json({message:"Insufficient stock"})
    }
    if(quantity > product.stock){
        return res.status(400).json({message:"Order quantity is more than available stock"})
    }
    const totalAmount = product.price * quantity
    const order = {
        id:data.orders.length+1,
        productId,
        quantity,
        totalAmount,
        status:"placed",
        createdAt:new Date().toISOString().slice(0,10)
    }
    product.stock-=quantity;
    data.orders.push(order);
    writeData(data);
    res.status(201).json({message:"Order created",order})
})
