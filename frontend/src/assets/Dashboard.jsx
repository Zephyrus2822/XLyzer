import React, { useState, useRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("visualize");
  const [graphType, setGraphType] = useState("line");
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const chartRef = useRef(null);

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

  const ExportButtons = ({ type }) => {
    const handleExport = async (format) => {
      if (!chartRef.current) return;
      const canvas = await html2canvas(chartRef.current);
      const dataURL = canvas.toDataURL("image/png");

      if (format === "png") {
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${type}-chart.png`;
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataURL);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataURL, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${type}-chart.pdf`);
      }
    };

    return (
      <>
        {["png", "pdf"].map((ext) => (
          <div key={ext} className="relative group inline-block">
            <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px]" />
            <button
              id={`${type}-${ext}`}
              disabled={!fileUploaded}
              onClick={() => handleExport(ext)}
              className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 flex items-center transition-all duration-150"
            >
              {ext === "png" ? (
                <Download className="mr-1 h-3 w-3" />
              ) : (
                <Type className="mr-1 h-2 w-2" />
              )}
              {`EXPORT ${ext.toUpperCase()}`}
            </button>
          </div>
        ))}
      </>
    );
  };

  const renderChart = () => {
  if (!xAxis || !yAxis || sheetData.length === 0) return null;

  const chartProps = {
    width: 600,
    height: 300,
    data: sheetData,
  };

  switch (graphType) {
    case "line":
      return (
        <div ref={chartRef}>
          <ReLineChart {...chartProps}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
          </ReLineChart>
        </div>
      );

    case "bar":
      return (
        <div ref={chartRef}>
          <ReBarChart {...chartProps}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#82ca9d" />
          </ReBarChart>
        </div>
      );

    case "pie":
      return (
        <div ref={chartRef}>
          <RePieChart width={600} height={300}>
            <Pie
              data={sheetData}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
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
        </div>
      );

    default:
      return null;
  }
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
                ref={chartRef}
                className="flex-1 border border-indigo-400/20 rounded-sm bg-gray-900/30 relative overflow-hidden"
              >
                {renderChart()}
              </div>
              <div className="flex justify-between mt-4">
                <ExportButtons type={graphType} />
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
