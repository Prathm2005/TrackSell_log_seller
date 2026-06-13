const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const User=require("../models/User.js");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });


router.post("/register",async(req,res)=>{
    const {name,shopname,email,password}=req.body;
    try {
        const exists=await User.findOne({email});
        if (exists) return res.status(400).json({ message: "Email already registered" });
        const user=await User.create({name,shopname,email,password});
        res.status(201).json({ _id: user._id, name: user.name, shopname: user.shopname, email: user.email, 
        token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });
 
    res.json({ _id: user._id, name: user.name, shopname: user.shopname, email: user.email, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports=router;