import { useState } from 'react';
import { Upload, History, FileCode2 } from 'lucide-react';
import FormView from './components/FormView';
import HistoryView from './components/HistoryView';
import GasGuide from './components/GasGuide';

export default function App() {
  const [tab, setTab] = useState<'form' | 'history' | 'guide'>('form');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 flex-grow flex flex-col">
        <header className="flex items-center justify-between mb-6 flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Thu Thập Kết Quả Thi PCVT</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Cổng thông tin nội bộ cho Đoàn viên</p>
            </div>
          </div>
          
          {/* Desktop Nav - visible lg only */}
          <div className="hidden lg:flex gap-2 bg-white p-1 rounded-full border border-slate-200 shadow-sm">
            <button onClick={() => setTab('form')} className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'form' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}>Nộp kết quả</button>
            <button onClick={() => setTab('history')} className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'history' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}>Lịch sử nộp</button>
            <button onClick={() => setTab('guide')} className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'guide' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}>Mã Nguồn GAS</button>
          </div>
        </header>

        <main className="flex-grow lg:grid lg:grid-cols-12 lg:gap-6 flex flex-col gap-6 pb-24 lg:pb-6">
          <section className={`lg:col-span-5 flex-col gap-6 ${tab === 'form' ? 'flex' : 'hidden lg:flex'}`}>
            <FormView />
          </section>
          <section className={`lg:col-span-7 flex-col gap-6 ${tab === 'history' ? 'flex' : 'hidden lg:flex'}`}>
            <HistoryView />
          </section>
          <section className={`lg:col-span-12 flex-col gap-6 ${tab === 'guide' ? 'flex' : 'hidden lg:flex mt-0'}`}>
            <GasGuide />
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
          <button 
             onClick={() => setTab('guide')} 
             className={`flex flex-col items-center flex-1 py-1.5 px-2 rounded-xl transition-all ${tab === 'guide' ? 'text-blue-600 font-bold bg-blue-50/80 scale-105' : 'text-slate-500 font-medium hover:text-slate-700'}`}
          >
             <FileCode2 size={20} className="mb-1" strokeWidth={tab === 'guide' ? 2.5 : 2} />
             <span className="text-[10px] tracking-wide uppercase">Mã Nguồn</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
