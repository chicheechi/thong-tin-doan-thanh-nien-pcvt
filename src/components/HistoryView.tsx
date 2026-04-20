import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { mockHistory } from '../mockData';

export default function HistoryView() {
  const [filterMSNV, setFilterMSNV] = useState('');
  const [filterRound, setFilterRound] = useState('');
  const [selectedItem, setSelectedItem] = useState<{msnv:string, name:string, round:string, date:string} | null>(null);

  const filtered = mockHistory.filter(item => {
    const matchMsnv = item.msnv.toLowerCase().includes(filterMSNV.toLowerCase()) || item.name.toLowerCase().includes(filterMSNV.toLowerCase());
    const matchRound = filterRound === '' || item.round === filterRound;
    return matchMsnv && matchRound;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex-grow flex flex-col min-h-[50vh]">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <div>
           <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Lịch sử nộp bài</h2>
           <p className="text-[10px] text-slate-400 mt-1 uppercase">Dữ liệu cập nhật từ Google Sheets</p>
        </div>
        <div className="flex gap-2 items-center">
          <select 
            className="text-[11px] bg-slate-100 border-none rounded px-2 py-1.5 font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filterRound}
            onChange={e => setFilterRound(e.target.value)}
          >
            <option value="">Tất cả Vòng</option>
            <option value="Vòng 1">Vòng 1</option>
            <option value="Vòng 2">Vòng 2</option>
            <option value="Vòng 3">Vòng 3</option>
            <option value="Vòng 4">Vòng 4</option>
            <option value="Vòng 5">Vòng 5</option>
          </select>
          <input 
            type="text" 
            placeholder="Tìm MSNV..." 
            className="text-[11px] bg-slate-100 border-none rounded px-2 py-1.5 w-24 font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:font-normal"
            value={filterMSNV}
            onChange={e => setFilterMSNV(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow overflow-auto flex flex-col">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm font-medium">Không tìm thấy dữ liệu.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-slate-100">
              <tr className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                <th className="pb-3 pt-0 px-2 lg:px-4">Thời gian</th>
                <th className="pb-3 pt-0 px-2 lg:px-4 hidden sm:table-cell">MSNV</th>
                <th className="pb-3 pt-0 px-2 lg:px-4">Họ và tên</th>
                <th className="pb-3 pt-0 px-2 lg:px-4">Vòng</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 font-medium">
              {filtered.map((item, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors border-b border-slate-50 group"
                >
                  <td className="py-3 px-2 lg:px-4 text-slate-400 whitespace-nowrap">{item.date}</td>
                  <td className="py-3 px-2 lg:px-4 font-mono text-blue-600 hidden sm:table-cell">{item.msnv}</td>
                  <td className="py-3 px-2 lg:px-4 text-slate-800 font-semibold group-hover:text-blue-700">
                     {item.name}
                     <span className="sm:hidden block font-mono text-blue-600 text-[10px]">{item.msnv}</span>
                  </td>
                  <td className="py-3 px-2 lg:px-4 whitespace-nowrap">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border border-blue-100">{item.round}</span>
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
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg">
                 <span className="text-xs text-slate-500 font-bold uppercase">Ngày nộp</span>
                 <span className="font-medium">{selectedItem.date}</span>
              </div>
            </div>
            
            <div className="mt-5 border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center">
               <ExternalLink size={28} className="text-slate-300 mb-2" />
               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">(Mô phỏng đường dẫn Drive)</p>
            </div>
            
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 mt-5 rounded-xl uppercase text-xs tracking-widest transition-colors" onClick={() => setSelectedItem(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
