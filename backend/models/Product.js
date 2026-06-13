const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:     { type: String, required: true },      
  category: {
    type: String,
    enum: ["Food & Snacks", "Beverages", "Dairy", "Personal Care",
           "Household", "Stationery", "Tobacco", "Other"],
    default: "Other",
  },
  price:    { type: Number, required: true },        
  unit:     { type: String, default: "kg" },     
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);