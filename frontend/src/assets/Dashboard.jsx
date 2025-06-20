import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const TABS = {
  visualize: { icon: LineChart },
  data: { icon: FileInput },
  stats: { icon: Sigma },
  history: { icon: Clock },
};

const GRAPH_TYPES = {
  line: { icon: LineChart },
  bar: { icon: BarChart },
  pie: { icon: PieChart },
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
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Must contain `_id`

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
  useEffect(() => {
    if (fileUploaded && xAxis && yAxis && sheetData.length > 0 && user?._id) {
      const lastSave = sessionStorage.getItem("lastChartSaved");
      const currentSignature = `${xAxis}_${yAxis}_${graphType}_${file?.name}`;

      if (lastSave !== currentSignature) {
        saveToHistory(); // Call your MongoDB+local function
        sessionStorage.setItem("lastChartSaved", currentSignature);
        console.log(
          "Triggering saveToHistory() with signature:",
          currentSignature
        );
      }
    }
  }, [fileUploaded, xAxis, yAxis, graphType, sheetData, file, user._id]);

  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setIsProcessing(true);
    setError(null);
    setFileUploaded(false);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setSheetData(data);
      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      }
      setTimeout(() => {
        setFileUploaded(true);
        setIsProcessing(false);
      }, 1000);
    };
    reader.readAsBinaryString(selected);
  };

  const exportChart = async (format) => {
    const chartContainer = document.getElementById("chart-wrapper");
    if (!chartContainer) return;

    const { toPng } = await import("html-to-image");

    const options = {
      cacheBust: true,
      skipFonts: true,
      style: {
        fontFamily: "sans-serif",
      },
    };

    try {
      const dataUrl = await toPng(chartContainer, options);

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `chart.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("chart.pdf");
      }
    } catch (err) {
      console.error("Error exporting chart:", err);
    }
  };

  const saveToHistory = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const localHistory = JSON.parse(
      sessionStorage.getItem("chartHistory") || "[]"
    );
    const newEntry = {
      timestamp: Date.now(),
      graphType,
      xAxis,
      yAxis,
      sheetData,
      filename: file?.name || "uploaded.xlsx",
    };

    localHistory.unshift(newEntry);
    sessionStorage.setItem("chartHistory", JSON.stringify(localHistory));

    // Now push to MongoDB
    try {
      const res = await fetch("http://localhost:5001/api/chart/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id, // ✅ must match MongoDB ObjectId of user
          filename: newEntry.filename,
          xAxis,
          yAxis,
          graphType,
          sheetData,
        }),
      });

      const data = await res.json();
      console.log("📤 Chart POST response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Error saving chart to DB:", err.message);
    }
  };

  const ExportButtons = () => (
    <div className="flex space-x-2">
      <button
        disabled={!fileUploaded}
        onClick={() => exportChart("png")}
        className="text-xs px-3 py-1 bg-indigo-400/20 border border-indigo-400/30 text-indigo-100 rounded-sm flex items-center"
      >
        <Download size={12} className="mr-1" /> PNG
      </button>
      <button
        disabled={!fileUploaded}
        onClick={() => exportChart("pdf")}
        className="text-xs px-3 py-1 bg-indigo-400/20 border border-indigo-400/30 text-indigo-100 rounded-sm flex items-center"
      >
        <Type size={12} className="mr-1" /> PDF
      </button>
    </div>
  );

  const renderChart = () => {
    if (!xAxis || !yAxis || sheetData.length === 0) return null;
    switch (graphType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={sheetData}>
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
            </ReLineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={sheetData}>
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#ccc" />
              <Bar dataKey={yAxis} fill="#82ca9d" />
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
                fill="#8884d8"
              >
                {sheetData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const resetSession = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col font-press-start overflow-hidden">
      <header className="pt-2 px-4 border-b border-indigo-400/20 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-400 tracking-wider">
          <a href="/">XLYZER</a>
        </div>
        <div className="text-xs text-indigo-400/50 tracking-wider">
          DASHBOARD
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-16 border-r border-indigo-400/10 flex flex-col items-center py-4 space-y-6">
          {Object.keys(TABS).map((tab) => {
            const Icon = TABS[tab].icon;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 rounded border ${
                  activeTab === tab
                    ? "bg-indigo-400/20 border-indigo-400/50"
                    : "border-indigo-400/10"
                }`}
              >
                <Icon className="text-indigo-400" size={18} />
              </button>
            );
          })}
        </aside>
        <section className="flex-1 flex flex-col overflow-hidden">
          {activeTab === "visualize" && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex space-x-2 mb-4">
                {Object.keys(GRAPH_TYPES).map((type) => {
                  const Icon = GRAPH_TYPES[type].icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setGraphType(type)}
                      className={`px-3 py-1 text-xs border rounded-sm flex items-center ${
                        graphType === type
                          ? "bg-indigo-400/20 border-indigo-400/50 text-indigo-100"
                          : "border-indigo-400/10 text-indigo-400/50"
                      }`}
                    >
                      <Icon size={14} className="mr-1" /> {type.toUpperCase()}
                    </button>
                  );
                })}
              </div>
              <div className="flex space-x-2 mb-4">
                <select
                  className="text-xs bg-gray-800 border border-indigo-400/30 text-indigo-100 rounded-sm px-2 py-1"
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  <option value="">Select X Axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <select
                  className="text-xs bg-gray-800 border border-indigo-400/30 text-indigo-100 rounded-sm px-2 py-1"
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                >
                  <option value="">Select Y Axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div
                id="chart-wrapper"
                className="flex-1 min-h-[300px] max-h-[500px] border border-indigo-400/20 rounded-sm bg-gray-900/30 relative overflow-hidden"
              >
                {renderChart()}
              </div>
              <div className="flex justify-between mt-4">
                <ExportButtons />
                <button
                  onClick={resetSession}
                  className="text-xs px-2 py-1 border border-red-500 text-red-400 rounded-sm hover:bg-red-500/10 transition"
                >
                  Clear Session
                </button>
                <button
                  onClick={() => navigate("/history")}
                  className="text-xs px-2 py-1 bg-indigo-500 text-white rounded"
                >
                  View History
                </button>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="p-4">
              <label className="block text-sm font-medium text-white mb-2">
                Upload Excel File (.xlsx)
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="text-xs bg-gray-800 text-indigo-100 border border-indigo-400/30 rounded-sm px-2 py-1"
              />
              {isProcessing && (
                <p className="text-xs text-indigo-400/60 mt-2">
                  Processing file...
                </p>
              )}
              {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
              {fileUploaded && (
                <p className="text-xs text-green-400 mt-2">
                  File uploaded and parsed successfully!
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
