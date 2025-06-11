import React from 'react';
import { LineChart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col font-press-start overflow-hidden">
      
      <header className="pt-2 px-4 border-b border-indigo-400/20">
        <div className="text-xl font-bold text-indigo-400 tracking-wider">XLYZER</div>
      </header>

      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 w-full max-w-xs">
          
          <div className="inline-flex items-center justify-center p-2 bg-indigo-400/10 rounded border border-indigo-400/30 mx-auto">
            <LineChart className="text-indigo-400" size={18} strokeWidth={2} />
          </div>
          
          
          <h1 className="text-xl font-bold text-indigo-100 leading-tight tracking-wider">
            <span className="text-xl font-bold text-indigo-400">DATA</span> CLARITY
          </h1>
          <h1 className="text-xl font-bold text-white tracking-wider">
            WITHOUT COMPLEXITY
          </h1>
          
          
          <p className="text-[10px] text-indigo-200/80 tracking-wide mb-3">
            ANALYTICS PLATFORM FOR THOSE WHO DEMAND PRECISION
          </p>
          
          
          <div className="relative group inline-block">
            <div className="absolute -inset-0.5 bg-indigo-400/30 rounded-sm blur-[2px] group-hover:blur-[3px] transition-all duration-150"></div>
            <div className="relative px-4 py-1 bg-indigo-400/10 border border-indigo-400/30 text-indigo-100 text-[10px] rounded-sm tracking-wider hover:bg-indigo-400/20 transition-all duration-150">
              <Link to ={'/signin'} className=" hover:cursor-pointer flex items-center justify-center">
                INITIATE
                <Zap className="ml-1 h-2 w-2 text-indigo-100 group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      
      <footer className="pb-2 px-4 text-center text-indigo-400/50 text-[8px] tracking-wider border-t border-indigo-400/10">
        <p>©{new Date().getFullYear()} XLYZER  </p>
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