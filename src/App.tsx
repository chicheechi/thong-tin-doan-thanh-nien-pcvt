import { useState } from 'react';
import { Upload, History } from 'lucide-react';
import FormView from './components/FormView';
import HistoryView from './components/HistoryView';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
        <header className="flex items-center justify-center mb-10 bg-white p-4 sm:p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-white">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden w-12 h-12 sm:w-16 sm:h-16 shrink-0 shadow-inner">
              <img 
                src="https://lh3.googleusercontent.com/d/1saQ-Dwts6HvnqPMjM6xvQF7CWxGtddlN" 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-tight uppercase">Thu Thập Kết Quả Thi</h1>
              <p className="text-[10px] sm:text-xs text-blue-600 font-black uppercase tracking-[0.2em]">Đoàn Thanh niên PCVT</p>
            </div>
          </div>
        </header>

        <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          <section className="lg:col-span-5 flex flex-col">
             <div className="lg:sticky lg:top-8">
               <FormView />
             </div>
          </section>

          <section className="lg:col-span-7 flex flex-col">
             <HistoryView />
          </section>
        </main>
      </div>
    </div>
  );
}
