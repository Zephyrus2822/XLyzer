// routes/chart.js
const express = require("express");
const router = express.Router();
const Chart = require("../models/Chart");

router.post("/save", async (req, res) => {
  try {
    const { userId, filename, xAxis, yAxis, graphType, sheetData } = req.body;

    // Log incoming body
    console.log("📥 Incoming chart POST data:", req.body);

    if (!userId || !filename || !sheetData || !xAxis || !yAxis || !graphType) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const chart = new Chart({
      user: userId,
      filename,
      xAxis,
      yAxis,
      graphType,
      sheetData
    });

    await chart.save();
    console.log("✅ Chart saved:", chart);

    res.status(200).json({ message: "Chart saved", chart });
  } catch (err) {
    console.error("❌ Chart save error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const charts = await Chart.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ charts });
  } catch (err) {
    console.error("❌ Error fetching chart history:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
