const express = require("express");
const router  = express.Router();
const Sale=require("../models/Sale.js");
const { protect } =require("../middleware/auth");
router.use(protect);

router.get("/", async (req, res) => {
    try {
      const { from, to } = req.query;
      const filter = { user: req.user._id };
   
     
      if (from || to) {
        filter.date = {};
        if (from) filter.date.$gte = new Date(from);
        if (to) {
          const toDate = new Date(to);
          toDate.setHours(23, 59, 59, 999); 
          filter.date.$lte = toDate;
        }
      }
   
      const sales = await Sale.find(filter).sort({ date: -1 });
      res.json(sales);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/summary", async (req, res) => {
    try {
      const userId = req.user._id;
      const now    = new Date();
   
      
      const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
      const todayEnd   = new Date(now); todayEnd.setHours(23,59,59,999);
   
      
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      weekStart.setHours(0,0,0,0);
   
    
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
   
     
      const sumRevenue = async (start, end) => {
        const result = await Sale.aggregate([
          { $match: { user: userId, date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: "$grandTotal" } } },
        ]);
        return result[0]?.total || 0;
      };
   
      
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const start = new Date(d); start.setHours(0,0,0,0);
        const end   = new Date(d); end.setHours(23,59,59,999);
        const total = await sumRevenue(start, end);
        last7Days.push({
          date:  d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
          total,
        });
      }
   
     
      const bestSellers = await Sale.aggregate([
        { $match: { user: userId, date: { $gte: monthStart } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.name", totalQty: { $sum: "$items.quantity" }, totalRevenue: { $sum: "$items.total" } } },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
      ]);
   
      res.json({
        today:       await sumRevenue(todayStart, todayEnd),
        thisWeek:    await sumRevenue(weekStart, todayEnd),
        thisMonth:   await sumRevenue(monthStart, todayEnd),
        last7Days,
        bestSellers,
      });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/", async (req, res) => {
    const { items, date, note } = req.body;
    try {
      
      const processedItems = items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      }));
      const grandTotal = processedItems.reduce((sum, i) => sum + i.total, 0);
   
      const sale = await Sale.create({
        user: req.user._id,
        items: processedItems,
        grandTotal,
        date: date ? new Date(date) : new Date(),
        note,
      });
      res.status(201).json(sale);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/:id", async (req, res) => {
    try {
      await Sale.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports=router;