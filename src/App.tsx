import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, ClipboardCheck, BarChart2 } from 'lucide-react';
import FormView from './components/FormView';
import HistoryView from './components/HistoryView';
import Overview from './components/Overview';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'main'>('overview');

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 z-0">
      {/* Premium ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-[#F8FAFC] to-[#F8FAFC] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay pointer-events-none -z-10"></div>
      
      <div className="max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden"
        >
          {/* Subtle background element */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 transition-all mb-8 w-full justify-center">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="bg-white p-2 rounded-[24px] border border-slate-100 flex items-center justify-center overflow-hidden w-16 h-16 sm:w-24 sm:h-24 shrink-0 shadow-xl shadow-blue-900/5"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1saQ-Dwts6HvnqPMjM6xvQF7CWxGtddlN" 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="text-center sm:text-left max-w-2xl">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight uppercase font-display italic text-balance bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
                Thu thập kết quả thi Tìm hiểu về cuộc đời và sự nghiệp của Tổng Bí thư Hà Huy Tập
              </h1>
              <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                <span className="w-10 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-sm"></span>
                <p className="text-[10px] sm:text-xs text-blue-600 font-black uppercase tracking-[0.3em]">Đoàn Thanh Niên PC Vũng Tàu</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100/60 p-1.5 rounded-full border border-slate-200 backdrop-blur-md self-center shadow-inner">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 sm:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'overview' ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02] ring-1 ring-white/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
            >
              <BarChart2 size={16} />
              Tổng quan thống kê
            </button>
            <button 
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-2 px-6 sm:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'main' ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02] ring-1 ring-white/20' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
            >
              <ClipboardCheck size={16} />
              Nộp bài & Lịch sử
            </button>
          </div>
        </motion.header>

        <main className="flex-grow pb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Overview />
              </motion.div>
            ) : (
              <motion.div 
                key="main"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-5 flex flex-col">
                  <div className="lg:sticky lg:top-8">
                    <FormView />
                  </div>
                </div>
                <div className="lg:col-span-7 flex flex-col">
                  <HistoryView />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
