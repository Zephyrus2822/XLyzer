// routes/chart.js
const express = require("express");
const router = express.Router();
const Chart = require("../models/Chart");

router.post("/save", async (req, res) => {
  try {
    const { userId, filename, xAxis, yAxis, graphType, sheetData } = req.body;

    if (!userId || !filename || !sheetData) {
      return res.status(400).json({ message: "Missing required fields" });
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
    res.status(200).json({ message: "Chart saved", chart });
  } catch (err) {
    console.error("Chart save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
