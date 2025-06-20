import React, { useState, useEffect } from "react";
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
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user._id) {
      console.error("❌ No user ID found in localStorage");
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/chart/history/${user._id}`
        );
        setHistory(res.data.charts || []);
      } catch (err) {
        console.error("Failed to fetch chart history:", err);
        setError("Failed to load chart history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user._id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-indigo-200">
        Loading chart history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 underline text-indigo-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="p-8 text-center text-gray-300">
        <p>No chart history found for your account.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 underline text-indigo-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 overflow-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-xs px-2 py-1 bg-indigo-500 text-white rounded"
      >
        Back to Dashboard
      </button>

      {history.map((item, idx) => (
        <div key={idx} className="border rounded p-4 bg-gray-800">
          <h3 className="text-sm text-indigo-200 mb-2">
            {new Date(item.createdAt).toLocaleString()} — {item.filename}
          </h3>
          <div className="w-full h-64">
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
