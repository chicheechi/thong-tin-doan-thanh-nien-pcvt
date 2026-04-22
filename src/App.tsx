import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, ClipboardCheck, BarChart2 } from 'lucide-react';
import FormView from './components/FormView';
import HistoryView from './components/HistoryView';
import Overview from './components/Overview';

export default function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'overview'>('main');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-10 bg-white p-6 sm:p-8 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden"
        >
          {/* Subtle background element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 transition-all mb-8 w-full justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden w-16 h-16 sm:w-20 sm:h-20 shrink-0 shadow-lg shadow-slate-200"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1saQ-Dwts6HvnqPMjM6xvQF7CWxGtddlN" 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display italic">Thu Thập Kết Quả Thi</h1>
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
                <p className="text-[10px] sm:text-xs text-blue-600 font-black uppercase tracking-[0.3em]">Đoàn Thanh niên PCVT</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm self-center">
            <button 
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-2 px-6 sm:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'main' ? 'bg-blue-600 text-white shadow-xl shadow-blue-300 scale-[1.02]' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <ClipboardCheck size={16} />
              Nộp bài & Lịch sử
            </button>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 sm:px-10 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xl shadow-blue-300 scale-[1.02]' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <BarChart2 size={16} />
              Tổng quan thống kê
            </button>
          </div>
        </motion.header>

        <main className="flex-grow pb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'main' ? (
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
            ) : (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Overview />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
