import { useState } from 'react';
import { Upload, History } from 'lucide-react';
import FormView from './components/FormView';
import HistoryView from './components/HistoryView';

export default function App() {
  const [tab, setTab] = useState<'form' | 'history'>('form');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 flex-grow flex flex-col">
        <header className="flex items-center justify-between mb-6 flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/d/1saQ-Dwts6HvnqPMjM6xvQF7CWxGtddlN" 
                alt="Logo" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">Thu Thập Kết Quả Thi</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Đoàn Thanh niên PCVT</p>
            </div>
          </div>
          
          {/* Desktop Nav - visible lg only */}
          <div className="hidden lg:flex gap-2 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
            <button onClick={() => setTab('form')} className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'form' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}>Nộp kết quả</button>
            <button onClick={() => setTab('history')} className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'history' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}>Lịch sử nộp</button>
          </div>
        </header>

        <main className="flex-grow lg:grid lg:grid-cols-12 lg:gap-6 flex flex-col gap-6 pb-24 lg:pb-6">
          <section className={`lg:col-span-5 flex-col gap-6 ${tab === 'form' ? 'flex' : 'hidden lg:flex'}`}>
            <FormView />
          </section>
          <section className={`lg:col-span-7 flex-col gap-6 ${tab === 'history' ? 'flex' : 'hidden lg:flex'}`}>
            <HistoryView />
          </section>
        </main>
      </div>

      {/* Bottom Tabs - Mobile only */}
      <nav className="lg:hidden bg-white/80 backdrop-blur-md border-t border-slate-200 fixed bottom-0 w-full left-0 z-20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex justify-around py-2 px-2">
          <button 
             onClick={() => setTab('form')} 
             className={`flex flex-col items-center flex-1 py-1.5 px-2 rounded-xl transition-all ${tab === 'form' ? 'text-blue-600 font-bold bg-blue-50/80 scale-105' : 'text-slate-500 font-medium hover:text-slate-700'}`}
          >
             <Upload size={20} className="mb-1" strokeWidth={tab === 'form' ? 2.5 : 2} />
             <span className="text-[10px] tracking-wide uppercase">Nộp KQ</span>
          </button>
          <button 
             onClick={() => setTab('history')} 
             className={`flex flex-col items-center flex-1 py-1.5 px-2 rounded-xl transition-all ${tab === 'history' ? 'text-blue-600 font-bold bg-blue-50/80 scale-105' : 'text-slate-500 font-medium hover:text-slate-700'}`}
          >
             <History size={20} className="mb-1" strokeWidth={tab === 'history' ? 2.5 : 2} />
             <span className="text-[10px] tracking-wide uppercase">Lịch sử</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
