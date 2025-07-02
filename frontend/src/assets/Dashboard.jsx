import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Chatbot from "./Chatbot";
// import * as echarts from "echarts";
import "echarts-gl";
import ReactECharts from "echarts-for-react";
import * as XLSX from "xlsx";
import {
  LineChart,
  Sigma,
  Clock,
  BarChart,
  PieChart,
  Download,
  FileInput,
  Type,
  X,
  Check,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const TABS = {
  data: { icon: FileInput, label: "Data" },
  visualize: { icon: LineChart, label: "Visualize" },
};

const GRAPH_TYPES = {
  line: { icon: LineChart, label: "Line" },
  bar: { icon: BarChart, label: "Bar" },
  pie: { icon: PieChart, label: "Pie" },
  scatter3d: { icon: Sigma, label: "3D Scatter" },
  column3d: { icon: BarChart, label: "3D Column" },
};

export default function Dashboard() {
  const [fileUploaded, setFileUploaded] = useState(
    () => sessionStorage.getItem("fileUploaded") === "true"
  );
  const [activeTab, setActiveTab] = useState("visualize");
  const [graphType, setGraphType] = useState(
    () => sessionStorage.getItem("graphType") || "line"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [sheetData, setSheetData] = useState(() => {
    const saved = sessionStorage.getItem("sheetData");
    return saved ? JSON.parse(saved) : [];
  });
  const [columns, setColumns] = useState(() => {
    const saved = sessionStorage.getItem("columns");
    return saved ? JSON.parse(saved) : [];
  });
  const [xAxis, setXAxis] = useState(
    () => sessionStorage.getItem("xAxis") || ""
  );
  const [yAxis, setYAxis] = useState(
    () => sessionStorage.getItem("yAxis") || ""
  );
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const themeColors = {
    axisLine: "#A0AEC0",
    axisLabel: "#CBD5E0",
    gridColor: "#4A5568",
    tooltipBg: "#2D3748",
    legendText: "#E2E8F0",
    seriesColors: ["#667EEA", "#63B3ED", "#F6AD55", "#F56565", "#9F7AEA"],
  };

  const saveChart = async () => {
    if (!user._id || !sheetData.length || !xAxis || !yAxis || !graphType) {
      alert("Missing chart data or user info.");
      return;
    }

    try {
      const payload = {
        userId: user._id,
        sheetData,
        xAxis,
        yAxis,
        graphType,
        filename: `${graphType}-chart-${Date.now()}`,
      };

      await axios.post("http://localhost:5001/api/chart/save", payload);
      alert("✅ Chart saved successfully.");
    } catch (err) {
      console.error("Failed to save chart:", err);
      alert("❌ Error saving chart.");
    }
  };

  // Sync to sessionStorage
  useEffect(
    () => sessionStorage.setItem("sheetData", JSON.stringify(sheetData)),
    [sheetData]
  );
  useEffect(
    () => sessionStorage.setItem("columns", JSON.stringify(columns)),
    [columns]
  );
  useEffect(() => sessionStorage.setItem("xAxis", xAxis), [xAxis]);
  useEffect(() => sessionStorage.setItem("yAxis", yAxis), [yAxis]);
  useEffect(() => sessionStorage.setItem("graphType", graphType), [graphType]);
  useEffect(
    () => sessionStorage.setItem("fileUploaded", fileUploaded),
    [fileUploaded]
  );

  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setIsProcessing(true);
    setError(null);
    setFileUploaded(false);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setSheetData(data);
        if (data.length > 0) {
          setColumns(Object.keys(data[0]));
        }
        setFileUploaded(true);
      } catch (err) {
        setError("Failed to process file. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading file");
      setIsProcessing(false);
    };
    reader.readAsBinaryString(selected);
  };

  const exportChart = async (format) => {
    const chartContainer = document.getElementById("chart-wrapper");
    if (!chartContainer) return;

    const { toPng, toPdf } = await import("html-to-image");
    const blobFn = format === "png" ? toPng : toPdf;
    blobFn(chartContainer).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `xlyzer-chart.${format}`;
      link.href = dataUrl;
      link.click();
    });
  };

  const resetSession = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const render3DChart = () => {
    if (!xAxis || !yAxis || sheetData.length === 0) return null;

    const getOption = () => {
      switch (graphType) {
        case "scatter3d":
          return {
            tooltip: {
              formatter: function (params) {
                return `(${params.value[0]}, ${params.value[1]}, ${params.value[2]})`;
              },
              backgroundColor: "#2D3748",
              borderColor: "#A0AEC0",
              textStyle: { color: "#E2E8F0" },
            },
            xAxis3D: {
              type: "category",
              data: sheetData.map((d) => d[xAxis]),
              axisLabel: { color: "#CBD5E0" },
              axisLine: { lineStyle: { color: "#A0AEC0" } },
            },
            yAxis3D: {
              type: "category",
              data: sheetData.map((d) => d[yAxis]),
              axisLabel: { color: "#CBD5E0" },
              axisLine: { lineStyle: { color: "#A0AEC0" } },
            },
            zAxis3D: {
              type: "value",
              axisLabel: { color: "#CBD5E0" },
              axisLine: { lineStyle: { color: "#A0AEC0" } },
            },
            grid3D: {
              boxWidth: 100,
              boxDepth: 100,
              viewControl: {
                projection: "perspective",
                autoRotate: true,
                autoRotateSpeed: 10,
                distance: 150,
              },
              light: {
                main: {
                  intensity: 1.5,
                  shadow: true,
                },
                ambient: {
                  intensity: 0.5,
                },
              },
            },
            series: [
              {
                type: "scatter3D",
                symbolSize: 12,
                data: sheetData.map((d) => [d[xAxis], d[yAxis], d[yAxis]]),
                itemStyle: {
                  color: "#63B3ED", // brighter blue
                  opacity: 0.9,
                  borderWidth: 1,
                  borderColor: "#EDF2F7",
                },
                emphasis: {
                  itemStyle: {
                    color: "#F6AD55",
                    opacity: 1,
                    borderColor: "#FFFFFF",
                    borderWidth: 2,
                  },
                },
              },
            ],
          };

        case "column3d":
          return {
            tooltip: {},
            xAxis3D: { type: "category", data: sheetData.map((d) => d[xAxis]) },
            yAxis3D: { type: "category", data: [yAxis] },
            zAxis3D: { type: "value" },
            grid3D: {
              boxWidth: 100,
              boxDepth: 80,
              viewControl: { projection: "perspective" },
              axisLine: { lineStyle: { color: themeColors.axisLine } },
              axisPointer: { lineStyle: { color: themeColors.gridColor } },
              light: {
                main: { intensity: 1.2, shadow: true },
                ambient: { intensity: 0.5 },
              },
            },
            series: [
              {
                type: "bar3D",
                data: sheetData.map((d) => [d[xAxis], d[yAxis], d[yAxis]]),
                shading: "lambert",
                label: {
                  show: true,
                  textStyle: { color: "#fff", fontSize: 12 },
                },
                itemStyle: {
                  color: (params) =>
                    themeColors.seriesColors[
                      params.dataIndex % themeColors.seriesColors.length
                    ],
                  opacity: 0.95,
                },
              },
            ],
          };

        default:
          return {};
      }
    };

    return (
      <ReactECharts
        option={getOption()}
        style={{ height: "100%", width: "100%" }}
      />
    );
  };

  const renderChart = () => {
    if (!xAxis || !yAxis || sheetData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-indigo-300/70">
          <LineChart className="h-12 w-12 mb-4" />
          <p>Select X and Y axes to visualize your data</p>
        </div>
      );
    }

    if (graphType === "scatter3d" || graphType === "column3d") {
      return render3DChart();
    }

    switch (graphType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={sheetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis
                dataKey={xAxis}
                stroke="#A0AEC0"
                tick={{ fill: "#A0AEC0", fontSize: 12 }}
              />
              <YAxis
                stroke="#A0AEC0"
                tick={{ fill: "#A0AEC0", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A202C",
                  borderColor: "#4C51BF",
                  borderRadius: "0.25rem",
                  color: "#E2E8F0",
                }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />

              <Legend />
              <Line
                type="monotone"
                dataKey={yAxis}
                stroke="#667EEA"
                strokeWidth={2}
                dot={{ fill: "#4C51BF" }}
                activeDot={{ r: 6, fill: "#667EEA" }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={sheetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis
                dataKey={xAxis}
                stroke="#A0AEC0"
                tick={{ fill: "#A0AEC0", fontSize: 12 }}
              />
              <YAxis
                stroke="#A0AEC0"
                tick={{ fill: "#A0AEC0", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A202C",
                  borderColor: "#4C51BF",
                  borderRadius: "0.25rem",
                  color: "#E2E8F0",
                }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <Legend />
              <Bar dataKey={yAxis} fill="#4C51BF" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={sheetData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={60}
                paddingAngle={5}
                label
              >
                {sheetData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#667EEA", "#4C51BF", "#7F9CF5"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1A202C",
                  borderColor: "#4C51BF",
                  borderRadius: "0.25rem",
                  color: "#E2E8F0",
                }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="py-3 px-6 border-b border-indigo-400/20 flex justify-between items-center"
      >
        <div className="text-xl font-bold text-indigo-400 tracking-tight">
          <Link to="/">XLYZER</Link>
        </div>
        <div className="text-xs font-medium text-indigo-400/60 bg-indigo-400/10 px-2 py-1 rounded">
          DASHBOARD
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-16 border-r border-indigo-400/10 flex flex-col items-center py-6 space-y-6"
        >
          {Object.entries(TABS).map(([key, { icon: Icon, label }]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(key)}
              className={`p-2 rounded-lg flex flex-col items-center ${
                activeTab === key
                  ? "bg-indigo-400/20 text-indigo-400"
                  : "text-indigo-400/50 hover:text-indigo-400"
              }`}
              title={label}
            >
              <Icon size={20} />
              <span className="text-[8px] mt-1">{label}</span>
            </motion.button>
          ))}
        </motion.aside>

        {/* Main Panel */}
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          {activeTab === "visualize" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex-1 flex flex-col h-full"
            >
              {/* Chart Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  {Object.entries(GRAPH_TYPES).map(
                    ([key, { icon: Icon, label }]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setGraphType(key)}
                        className={`px-4 py-2 text-sm border rounded-lg flex items-center transition-all ${
                          graphType === key
                            ? "bg-indigo-500 border-indigo-600 text-white shadow-md"
                            : "bg-indigo-400/10 border-indigo-400/20 text-indigo-300 hover:bg-indigo-400/20"
                        }`}
                      >
                        <Icon size={16} className="mr-2" />
                        {label}
                      </motion.button>
                    )
                  )}
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => exportChart("png")}
                    disabled={!fileUploaded || !xAxis || !yAxis}
                    className={`px-3 py-1.5 text-xs bg-indigo-500 border border-indigo-600 text-white rounded-lg flex items-center ${
                      !fileUploaded || !xAxis || !yAxis
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Download size={14} className="mr-2" /> PNG
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => exportChart("pdf")}
                    disabled={!fileUploaded || !xAxis || !yAxis}
                    className={`px-3 py-1.5 text-xs bg-indigo-500 border border-indigo-600 text-white rounded-lg flex items-center ${
                      !fileUploaded || !xAxis || !yAxis
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Type size={14} className="mr-2" /> PDF
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={saveChart}
                    disabled={!fileUploaded || !xAxis || !yAxis}
                    className={`px-3 py-1.5 text-xs bg-indigo-500 border border-indigo-600 text-white rounded-lg flex items-center ${
                      !fileUploaded || !xAxis || !yAxis
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    💾 Save Chart
                  </motion.button>
                </div>
              </div>

              {/* Axis Selectors */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm text-indigo-300 mb-2">
                    X-Axis
                  </label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    className="w-full bg-indigo-900/30 border border-indigo-400/30 text-indigo-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select X-Axis</option>
                    {columns.map((col) => (
                      <option key={`x-${col}`} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-indigo-300 mb-2">
                    Y-Axis
                  </label>
                  <select
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                    className="w-full bg-indigo-900/30 border border-indigo-400/30 text-indigo-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select Y-Axis</option>
                    {columns.map((col) => (
                      <option key={`y-${col}`} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chart Area */}
              <div className="flex-1 border border-indigo-400/20 rounded-xl bg-indigo-900/10 backdrop-blur-sm overflow-hidden">
                <div id="chart-wrapper" className="w-full h-full p-4">
                  {renderChart()}
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-4 flex gap-5 justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetSession}
                  className="text-s px-3 py-1.5 bg-transparent border border-red-500/50 font-bold text-white rounded-lg hover:bg-red-500 transition"
                >
                  Reset Dashboard
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/history")}
                  className="text-s px-3 py-1.5 bg-transparent border border-red-500/50 font-bold text-white rounded-lg hover:bg-red-500 transition"
                >
                  View History
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "data" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col"
            >
              <h2 className="text-xl font-bold text-white mb-6">Upload Data</h2>

              <div className="bg-indigo-900/20 border border-indigo-400/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-400/30 rounded-lg cursor-pointer bg-indigo-900/10 hover:bg-indigo-900/20 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileInput className="h-8 w-8 text-indigo-400 mb-2" />
                      <p className="text-sm text-indigo-300">
                        {file ? file.name : "Click to upload Excel file"}
                      </p>
                      <p className="text-xs text-indigo-400/50 mt-1">
                        .xlsx, .xls files only
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center text-indigo-400"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing your file...
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center text-red-400 bg-red-900/20 px-3 py-2 rounded-lg"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {error}
                  </motion.div>
                )}

                {fileUploaded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center text-green-400 bg-green-900/20 px-3 py-2 rounded-lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    File uploaded successfully! Switch to Visualize tab to
                    explore your data.
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
