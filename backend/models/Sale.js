const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:      { type: String, required: true },  
  quantity:  { type: Number, required: true },
  price:     { type: Number, required: true },  
  total:     { type: Number, required: true },   
});

const saleSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:     [saleItemSchema],                   
  grandTotal:{ type: Number, required: true },   
  date:      { type: Date, default: Date.now },  
  note:      { type: String, default: "" },     
}, { timestamps: true });

module.exports = mongoose.model("Sale", saleSchema);