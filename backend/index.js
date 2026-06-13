const express= require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const Auth=require("./routes/auth.js");
const Product=require("./routes/products.js");
const Sale=require("./routes/sales.js");
dotenv.config();
connectDB();

const app=express();
app.use(express.json());
app.use(cors({
    origin: "*",
  credentials: false,
}));

app.use("/api/auth",Auth);
app.use("/api/product",Product);
app.use("/api/sale",Sale);

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
    
})
