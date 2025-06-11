import React, { useState } from 'react';
import { LineChart, Sigma, Clock, BarChart, PieChart, Download, FileInput, X, Check, Type } from 'lucide-react';


export default function Dashboard() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('visualize');
  const [graphType, setGraphType] = useState('line');
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  // Sample statistics data
  const [stats, setStats] = useState({
    mean: 0.0,
    median: 0.0,
    mode: 0.0,
    min: 0.0,
    max: 0.0,
    stdDev: 0.0
  });

  

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);
    setFileUploaded(false);

    setTimeout(() => {
      setFileUploaded(true);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col font-press-start overflow-hidden">
      <header className="pt-2 px-4 border-b border-indigo-400/20 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-400 tracking-wider">XLYZER</div>
        <div className="text-xs text-indigo-400/50 tracking-wider">DASHBOARD</div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 border-r border-indigo-400/10 flex flex-col items-center py-4 space-y-6">
          <button 
            className={`p-2 rounded border ${activeTab === 'visualize' ? 'bg-indigo-400/20 border-indigo-400/50' : 'border-indigo-400/10'}`}
            onClick={() => setActiveTab('visualize')}
          >
            <LineChart className="text-indigo-400" size={18} />
          </button>
          <button 
            className={`p-2 rounded border ${activeTab === 'data' ? 'bg-indigo-400/20 border-indigo-400/50' : 'border-indigo-400/10'}`}
            onClick={() => setActiveTab('data')}
          >
            <FileInput className="text-indigo-400" size={18} />
          </button>
          <button 
            className={`p-2 rounded border ${activeTab === 'stats' ? 'bg-indigo-400/20 border-indigo-400/50' : 'border-indigo-400/10'}`}
            onClick={() => setActiveTab('stats')}
          >
            <Sigma className="text-indigo-400" size={18} />
          </button>
          <button 
            className={`p-2 rounded border ${activeTab === 'history' ? 'bg-indigo-400/20 border-indigo-400/50' : 'border-indigo-400/10'}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock className="text-indigo-400" size={18} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Visualizing Tab */}
          {activeTab === 'visualize' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex space-x-2 mb-4">
                <button 
                  className={`px-3 py-1 text-xs border rounded-sm flex items-center ${graphType === 'line' ? 'bg-indigo-400/20 border-indigo-400/50 text-indigo-100' : 'border-indigo-400/10 text-indigo-400/50'}`}
                  onClick={() => setGraphType('line')}
                >
                  <LineChart size={14} className="mr-1" /> LINE
                </button>
                <button 
                  className={`px-3 py-1 text-xs border rounded-sm flex items-center ${graphType === 'bar' ? 'bg-indigo-400/20 border-indigo-400/50 text-indigo-100' : 'border-indigo-400/10 text-indigo-400/50'}`}
                  onClick={() => setGraphType('bar')}
                >
                  <BarChart size={14} className="mr-1" /> BAR
                </button>
                <button 
                  className={`px-3 py-1 text-xs border rounded-sm flex items-center ${graphType === 'pie' ? 'bg-indigo-400/20 border-indigo-400/50 text-indigo-100' : 'border-indigo-400/10 text-indigo-400/50'}`}
                  onClick={() => setGraphType('pie')}
                >
                  <PieChart size={14} className="mr-1" /> PIE
                </button>
              </div>

              <div className="flex-1 border border-indigo-400/20 rounded-sm bg-gray-900/30 relative overflow-hidden">
                {!fileUploaded ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <FileInput className="mx-auto text-indigo-400/30 mb-2" size={24} />
                      <p className="text-xs text-indigo-400/50 tracking-wider">UPLOAD DATA TO VISUALIZE</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="w-full h-full flex items-center justify-center border border-dashed border-indigo-400/20 rounded-sm">
                      {graphType === 'line' && <LineChart className="text-indigo-400/30" size={48} />}
                      {graphType === 'bar' && <BarChart className="text-indigo-400/30" size={48} />}
                      {graphType === 'pie' && <PieChart className="text-indigo-400/30" size={48} />}
                      <p className="absolute text-xs text-indigo-400/50 mt-16">{graphType.toUpperCase()} CHART PREVIEW</p>
                    </div>
                  </div>
                )}
              </div>



              {/*Action btns*/}
              <div className="flex justify-between mt-4">
                {graphType === 'line' && (
                  <>
                    <div className="relative group inline-block">
                      <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px] transition-all duration-150"></div>
                      <button id='line-png'
                        className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 transition-all duration-150 flex items-center"
                        disabled={!fileUploaded}
                      >
                        <Download className="mr-1 h-3 w-3" /> EXPORT PNG
                      </button>
                    </div>
                    <div className="relative group inline-block">
                      <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px] transition-all duration-150"></div>
                      <button id='line-pdf'
                        className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 transition-all duration-150 flex items-center"
                        disabled={!fileUploaded}
                      >
                        <Type className="mr-1 h-2 w-2" /> EXPORT PDF
                      </button>
                    </div>
                  </>
                )}
                   {graphType === 'bar' && (
                  <>
                    <div className="relative group inline-block">
                      <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px] transition-all duration-150"></div>
                      <button id='bar-png'
                        className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 transition-all duration-150 flex items-center"
                        disabled={!fileUploaded}
                      >
                        <Download className="mr-1 h-3 w-3" /> EXPORT PNG
                      </button>
                    </div>
                    <div className="relative group inline-block">
                      <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px] transition-all duration-150"></div>
                      <button id='bar-pdf'
                        className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 transition-all duration-150 flex items-center"
                        disabled={!fileUploaded}
                      >
                        <Type className="mr-1 h-2 w-2" /> EXPORT PDF
                      </button>
                    </div>
                  </>
                )}
                   {graphType === 'pie' && (
                  <>
                    <div className="relative group inline-block">
                      <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px] transition-all duration-150"></div>
                      <button id='pie-png'
                        className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 transition-all duration-150 flex items-center"
                        disabled={!fileUploaded}
                      >
                        <Download className="mr-1 h-3 w-3" /> EXPORT PNG
                      </button>
                    </div>
                    <div className="relative group inline-block">
                      <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px] transition-all duration-150"></div>
                      <button id='pie-pdf'
                        className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 transition-all duration-150 flex items-center"
                        disabled={!fileUploaded}
                      >
                        <Type className="mr-1 h-2 w-2" /> EXPORT PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="flex-1 flex flex-col p-4 overflow-auto">
              <div className={`border rounded-sm p-4 mb-4 ${
                error ? 'border-red-400/50 bg-red-900/10' : 
                fileUploaded ? 'border-green-400/50 bg-green-900/10' : 
                'border-indigo-400/20 bg-gray-900/30'
              }`}>
                <h3 className="text-xs text-indigo-400 mb-3 tracking-wider">UPLOAD DATA</h3>
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <div className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                    isProcessing ? 'opacity-50' : 'opacity-100'
                  }`}>
                    {fileUploaded ? (
                      <Check className="mx-auto text-green-400 mb-2" size={24} />
                    ) : error ? (
                      <X className="mx-auto text-red-400 mb-2" size={24} />
                    ) : (
                      <FileInput className="mx-auto text-indigo-400 mb-2" size={24} />
                    )}
                    <p className={`mb-2 text-xs tracking-wider ${
                      fileUploaded ? 'text-green-400' : 
                      error ? 'text-red-400' : 
                      'text-indigo-400/50'
                    }`}>
                      {fileUploaded ? 'FILE UPLOADED SUCCESSFULLY' : 
                       error ? error : 'CLICK TO UPLOAD'}
                    </p>
                    <p className="text-[8px] text-indigo-400/30">
                      {fileUploaded && file ? file.name : 'XLSX, CSV (MAX. 5MB)'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx,.csv"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </label>
                {isProcessing && (
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse delay-100"></div>
                    <div className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse delay-200"></div>
                    <span className="text-xs text-indigo-400/50">PROCESSING...</span>
                  </div>
                )}
              </div>

              {fileUploaded && (
                <div className="border border-indigo-400/20 rounded-sm bg-gray-900/30 flex-1 overflow-auto">
                  <div className="p-2 border-b border-indigo-400/10 flex justify-between items-center">
                    <p className="text-xs text-indigo-400/80 tracking-wider">DATA PREVIEW</p>
                  </div>
                  <div className="p-2 overflow-auto">
                    <table className="w-full text-xs text-indigo-100">
                      <thead>
                        <tr className="border-b border-indigo-400/10">
                          <th className="p-2 text-left">COLUMN 1</th>
                          <th className="p-2 text-left">COLUMN 2</th>
                          <th className="p-2 text-left">COLUMN 3</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="flex-1 flex flex-col p-4 overflow-auto">
              <div className="border border-indigo-400/20 rounded-sm bg-gray-900/30 p-4 mb-4">
                <h3 className="text-xs text-indigo-400 mb-3 tracking-wider">DATA STATISTICS</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="border border-indigo-400/20 p-2 rounded-sm">
                      <p className="text-[10px] text-indigo-400/50 tracking-wider">{key.toUpperCase()}</p>
                      <p className="text-sm text-indigo-100">{value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="pb-2 px-4 text-center text-indigo-400/50 text-[8px] tracking-wider border-t border-indigo-400/10">
        <p>©{new Date().getFullYear()} XLYZER</p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-press-start {
          font-family: 'Press Start 2P', cursive;
        }
        html, body, #__next {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
        }
      `}</style>
    </div>
  );
}