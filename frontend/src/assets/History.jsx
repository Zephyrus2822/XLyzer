import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart as ReLineChart,
  BarChart as ReBarChart,
  PieChart as RePieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function History() {
  const [charts, setCharts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCharts, setFilteredCharts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user._id) {
      navigate("/signin");
      return;
    }

    const fetchCharts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/chart/history/${user._id}`
        );
        setCharts(res.data.charts || []);
        setFilteredCharts(res.data.charts || []);
      } catch (err) {
        console.error("Failed to load chart history:", err);
      }
    };

    fetchCharts();
  }, [user._id]);

  useEffect(() => {
    setFilteredCharts(
      charts.filter((chart) =>
        chart.filename.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, charts]);

  const handleExport = async (item, format) => {
    const chartElement = document.getElementById(`chart-${item._id}`);
    if (!chartElement) return;

    const { toPng } = await import("html-to-image");

    try {
      const dataUrl = await toPng(chartElement);
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${item.filename}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${item.filename}.pdf`);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 w-10 h-10 flex items-center justify-center text-white rounded-full text-lg">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold">{user.name}</h1>
            <p className="text-indigo-300 text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 text-sm bg-indigo-500 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>

      <input
        type="text"
        placeholder="Search charts by filename..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-2 rounded bg-gray-800 text-white border border-gray-700"
      />

      {filteredCharts.map((item) => (
        <div
          key={item._id}
          className="border border-gray-700 rounded p-4 mb-6 bg-gray-900"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-white text-sm font-medium">
                {item.filename} — {new Date(item.createdAt).toLocaleString()}
              </h2>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleExport(item, "png")}
                className="text-xs bg-indigo-500 text-white px-2 py-1 rounded"
              >
                Export PNG
              </button>
              <button
                onClick={() => handleExport(item, "pdf")}
                className="text-xs bg-purple-500 text-white px-2 py-1 rounded"
              >
                Export PDF
              </button>
            </div>
          </div>
          <div id={`chart-${item._id}`} className="w-full h-64">
            {item.graphType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={item.sheetData}>
                  <XAxis dataKey={item.xAxis} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#333" />
                  <Line dataKey={item.yAxis} stroke="#8884d8" />
                </ReLineChart>
              </ResponsiveContainer>
            )}
            {item.graphType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={item.sheetData}>
                  <XAxis dataKey={item.xAxis} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#333" />
                  <Bar dataKey={item.yAxis} fill="#82ca9d" />
                </ReBarChart>
              </ResponsiveContainer>
            )}
            {item.graphType === "pie" && (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={item.sheetData}
                    dataKey={item.yAxis}
                    nameKey={item.xAxis}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {item.sheetData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={["#8884d8", "#82ca9d", "#ffc658"][i % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
