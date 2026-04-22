import { motion } from 'motion/react';
import FormView from './components/FormView';
import HistoryView from './components/HistoryView';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-10 bg-white p-6 rounded-[32px] shadow-2xl shadow-blue-900/5 border border-white"
        >
          <div className="flex items-center gap-4 sm:gap-8 transition-all">
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
        </motion.header>

        <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 flex flex-col"
          >
             <div className="lg:sticky lg:top-8">
               <FormView />
             </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 flex flex-col"
          >
             <HistoryView />
          </motion.section>
        </main>
      </div>
    </div>
  );
}
