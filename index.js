import express from "express"
import { OrdersRoutes } from "./routes/orders.routes.js";
import { AnalyticsRoutes } from "./routes/analytics.routes.js";
const app = express();

const PORT = 3000;
app.use(express.json());

app.use("/orders",OrdersRoutes)
app.use("/analytics",AnalyticsRoutes)


app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
    
})