const express=require("express")
const router = express.Router();
const Product=require("../models/Product.js")
const { protect } =require("../middleware/auth");

router.use(protect);

router.get("/",async(req,res)=>{
    try {
        const products=await Product.find({user:req.user._id}).sort({name:1});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const { name, category, price, unit } = req.body;
    try {
      const product = await Product.create({ user: req.user._id, name, category, price, unit });
      res.status(201).json(product);
    } catch (err) { res.status(500).json({ message: err.message }); }
});


router.put("/:id", async (req, res) => {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
      );
      if (!product) return res.status(404).json({ message: "Not found" });
      res.json(product);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/:id", async (req, res) => {
    try {
      await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports=router;