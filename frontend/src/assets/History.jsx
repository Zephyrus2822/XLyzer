import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart as ReLineChart, BarChart as ReBarChart, PieChart as RePieChart,
  Line, Bar, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('chartHistory') || '[]');
    setHistory(data);
  }, []);

  if (!history.length) {
    return (
      <div className="p-8 text-center">
        <p>No chart history yet.</p>
        <button onClick={() => navigate('/')} className="mt-4 underline">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 overflow-auto">
      <button onClick={() => navigate('/')} className="text-xs px-2 py-1 bg-indigo-500 text-white rounded">
        Back to Dashboard
      </button>

      {history.map((item, idx) => (
        <div key={idx} className="border rounded p-4 bg-gray-800">
          <h3 className="text-sm text-indigo-200 mb-2">
            {new Date(item.timestamp).toLocaleString()} — {item.filename}
          </h3>
          <div className="w-full h-64">
            {item.graphType === 'line' && (
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
            {item.graphType === 'bar' && (
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
            {item.graphType === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={item.sheetData}
                    dataKey={item.yAxis}
                    nameKey={item.xAxis}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {item.sheetData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={['#8884d8', '#82ca9d', '#ffc658'][i % 3]}
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
