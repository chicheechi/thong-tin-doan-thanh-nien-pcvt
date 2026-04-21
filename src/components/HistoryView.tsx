import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';

export default function HistoryView() {
  const [filterMSNV, setFilterMSNV] = useState('');
  const [filterRound, setFilterRound] = useState('');
  const [selectedItem, setSelectedItem] = useState<{msnv:string, name:string, round:string, date:string, link:string} | null>(null);
  
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getHistory().then(data => {
      setHistoryData(data);
      setLoading(false);
    });
  }, []);

  const filtered = historyData.filter(item => {
    const matchMsnv = (item.msnv || '').toString().toLowerCase().includes(filterMSNV.toLowerCase()) || 
                      (item.name || '').toString().toLowerCase().includes(filterMSNV.toLowerCase());
    const matchRound = filterRound === '' || item.round === filterRound;
    return matchMsnv && matchRound;
  });

  return (
    <div className="bg-white border border-white rounded-[32px] p-6 lg:p-8 shadow-xl shadow-slate-200/60 flex-grow flex flex-col h-full">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div>
           <h2 className="font-black text-slate-800 uppercase text-sm tracking-[0.1em]">Lịch sử nộp bài</h2>
        </div>
        <div className="flex gap-3 items-center">
          <select 
            className="text-[11px] bg-slate-50 border border-slate-200 rounded-full px-4 py-2 font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            value={filterRound}
            onChange={e => setFilterRound(e.target.value)}
          >
            <option value="">Tất cả Tuần</option>
            <option value="Tuần 01">Tuần 01</option>
            <option value="Tuần 02">Tuần 02</option>
            <option value="Tuần 03">Tuần 03</option>
            <option value="Tuần 04">Tuần 04</option>
          </select>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm MSNV..." 
              className="text-[11px] bg-slate-50 border border-slate-200 rounded-full px-4 py-2 w-32 font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:font-normal transition-all"
              value={filterMSNV}
              onChange={e => setFilterMSNV(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto flex flex-col custom-scrollbar">
        {loading ? (
           <div className="text-center py-20 text-slate-400 text-sm font-medium flex flex-col items-center">
             <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             Đang tải dữ liệu phòng truyền thống...
           </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
            Chưa có dữ liệu nộp bài nào được ghi nhận.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-100">
                <th className="pb-4 pt-0 px-4">MSNV</th>
                <th className="pb-4 pt-0 px-4">Họ và tên</th>
                <th className="pb-4 pt-0 px-4">Vòng</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 font-medium">
              {filtered.map((item, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-all border-b border-slate-50 group hover:translate-x-1"
                >
                  <td className="py-4 px-4 font-mono font-bold text-blue-500">{item.msnv}</td>
                  <td className="py-4 px-4 text-slate-700 font-bold group-hover:text-blue-700">
                     {item.name}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter border border-blue-600/10">
                      {item.round}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl border border-slate-200" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full" onClick={() => setSelectedItem(null)}>
              <X size={18} />
            </button>
            <h3 className="font-bold text-sm tracking-wider uppercase mb-1 text-slate-800">Chi tiết bài nộp</h3>
            <p className="text-xs text-slate-500 mb-5 pb-5 border-b border-slate-100">Thông tin xác thực dữ liệu</p>
            
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg">
                 <span className="text-xs text-slate-500 font-bold uppercase">MSNV</span>
                 <span className="font-mono text-blue-700 font-semibold">{selectedItem.msnv}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg">
                 <span className="text-xs text-slate-500 font-bold uppercase">Họ tên</span>
                 <span className="font-semibold">{selectedItem.name}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg">
                 <span className="text-xs text-slate-500 font-bold uppercase">Vòng thi</span>
                 <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{selectedItem.round}</span>
              </div>
            </div>
            
            <a href={selectedItem.link || '#'} target="_blank" rel="noreferrer" className="mt-5 border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-xl p-6 bg-blue-50 flex flex-col items-center justify-center text-center group transition-colors block cursor-pointer">
               <ExternalLink size={28} className="text-blue-400 group-hover:text-blue-600 mb-2 transition-colors" />
               <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">Mở ảnh Drive</p>
            </a>
            
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 mt-5 rounded-xl uppercase text-xs tracking-widest transition-colors" onClick={() => setSelectedItem(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
