import console, { log } from "console";
import express from "express"
import fs from "fs"
export const OrdersRoutes = express.Router();

function readData() {
    try {
        const data = fs.readFileSync("./db.json", "utf-8")
        return JSON.parse(data)
    } catch (error) {
        console.log("Error while reading the file", error)
    }
}

function writeData(data) {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2))
}

// create order
OrdersRoutes.post("/", (req, res) => {
    const data = readData();
    if (!data) {
        return res.status(500).json({ message: "Data Unavailable" })
    }
    const { productId, quantity } = req.body || {};
    const product = data.products.find((p) => p.id === productId)
    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }
    if (product.stock === 0) {
        return res.status(400).json({ message: "Insufficient stock" })
    }
    if (quantity > product.stock) {
        return res.status(400).json({ message: "Order quantity is more than available stock" })
    }
    const totalAmount = product.price * quantity
    const order = {
        id: data.orders.length + 1,
        productId,
        quantity,
        totalAmount,
        status: "placed",
        createdAt: new Date().toISOString().slice(0, 10)
    }
    product.stock -= quantity;
    data.orders.push(order);
    writeData(data);
    res.status(201).json({ message: "Order created", order })
})

// Get all orders

OrdersRoutes.get("/", (req, res) => {
    const data = readData();
    if (!data) {
        return res.status(500).json({ message: "Data Unavailable" })
    }
    res.status(200).json({message:"All Orders List",orders:data.orders})
})

// Delete

OrdersRoutes.delete("/:orderId",(req,res)=>{
    const data = readData();
    if (!data) {
        return res.status(500).json({ message: "Data Unavailable" })
    }
    const currentDate = new Date().toISOString().slice(0, 10);
    const id = Number(req.params.orderId);
    const order = data.orders.find((o)=>o.id === id);
    if(order.status === "cancelled"){
        return res.status(400).json({message:"Order is already cancelled"})
    }
    if(order.createdAt === currentDate){
        order.status="cancelled"
        
    }
    
    const product = data.products.find((p) => p.id === order.productId)
    if (!product) {
        return res.status(404).json({ message: "Product not found" })
    }
    product.stock += order.quantity
    writeData(data)
    return res.status(200).json({message:"Order status changed to cancelled",order})

})
