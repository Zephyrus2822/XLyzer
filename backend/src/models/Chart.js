const mongoose = require("mongoose");

const chartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: String,
  xAxis: String,
  yAxis: String,
  graphType: String,
  sheetData: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chart", chartSchema);
