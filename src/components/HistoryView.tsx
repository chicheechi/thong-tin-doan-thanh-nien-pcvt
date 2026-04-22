import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Search, Filter, History, Calendar, User, Info, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';

export default function HistoryView({ historyData }: { historyData: any[] }) {
  const [filterMSNV, setFilterMSNV] = useState('');
  const [filterRound, setFilterRound] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const loading = false; // Data is managed by parent App.tsx

  const filtered = historyData.filter(item => {
    const matchMsnv = (item.msnv || '').toString().toLowerCase().includes(filterMSNV.toLowerCase()) || 
                      (item.name || '').toString().toLowerCase().includes(filterMSNV.toLowerCase());
    const matchRound = filterRound === '' || item.round === filterRound;
    return matchMsnv && matchRound;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMSNV, filterRound]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white border border-white rounded-[32px] sm:rounded-[40px] p-6 lg:p-10 shadow-2xl shadow-blue-900/5 flex-grow flex flex-col h-full transition-all relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-blue-400 via-blue-600 to-transparent"></div>
      
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 items-start xl:items-center justify-between mb-8 sm:mb-10 w-full">
        <div className="flex items-center gap-3">
           <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
              <History size={20} />
           </div>
           <div>
              <h2 className="font-black text-slate-800 uppercase text-base tracking-[0.1em] font-display">Lịch Sử Hoàn Thành</h2>

           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-center w-full sm:w-auto h-full sm:ml-auto">
          <div className="relative group w-full sm:w-auto">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={14} />
            <select 
              className="w-full text-[11px] bg-slate-50 border-2 border-slate-100 rounded-full pl-10 pr-4 py-3 font-bold text-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all cursor-pointer appearance-none min-w-full sm:min-w-[140px]"
              value={filterRound}
              onChange={e => setFilterRound(e.target.value)}
            >
              <option value="">Tất cả Tuần</option>
              <option value="Tuần 01">Tuần 01</option>
              <option value="Tuần 02">Tuần 02</option>
              <option value="Tuần 03">Tuần 03</option>
              <option value="Tuần 04">Tuần 04</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={14} />
          </div>
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Tìm nhân sự..." 
              className="text-[11px] bg-slate-50 border-2 border-slate-100 rounded-full pl-10 pr-4 py-3 w-full sm:w-40 font-bold text-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:bg-white placeholder:font-bold placeholder:text-slate-300 transition-all font-sans"
              value={filterMSNV}
              onChange={e => setFilterMSNV(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto flex flex-col custom-scrollbar pr-2 -mr-2">
        {loading ? (
           <div className="text-center py-24 text-slate-400 text-sm font-bold flex flex-col items-center">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             ĐANG TRUY XUẤT DỮ LIỆU...
           </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 text-xs font-bold uppercase tracking-widest font-sans"
          >
            Không tìm thấy bản ghi phù hợp
          </motion.div>
        ) : (
          <table className="w-full min-w-[450px] text-left border-separate border-spacing-y-2 font-sans">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] font-sans">
                <th className="pb-3 pt-0 px-3 md:px-4">Số hiệu</th>
                <th className="pb-3 pt-0 px-3 md:px-4 font-sans">Nhân sự</th>
                <th className="pb-3 pt-0 px-3 md:px-4 font-sans text-center">Trạng Thái</th>
                <th className="pb-3 pt-0 px-3 md:px-4 font-sans text-right">Tuần</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold font-sans">
              {paginatedData.map((item, idx) => (
                <motion.tr 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-slate-50/50 hover:bg-blue-50/80 cursor-pointer transition-all group border border-transparent hover:border-blue-100 rounded-xl overflow-hidden font-sans"
                >
                  <td className="py-3 px-3 md:px-4 font-mono text-blue-600 first:rounded-l-xl">
                     <span className="bg-white px-1.5 py-0.5 rounded-lg border border-slate-100 shadow-sm text-[10px] md:text-xs">{item.msnv}</span>
                  </td>
                  <td className="py-3 px-3 md:px-4">
                     <div className="flex flex-col">
                        <span className="text-slate-800 text-xs md:text-sm group-hover:text-blue-700 transition-colors uppercase font-display font-black">{item.name}</span>
                        <span className="text-[8px] md:text-[9px] text-slate-400 uppercase tracking-widest mt-0.5 font-sans font-bold">{item.department || '...'}</span>
                     </div>
                  </td>
                  <td className="py-3 px-3 md:px-4 text-center">
                     {item.status ? (
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${item.status === 'Đã có chứng nhận' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                           {item.status}
                        </span>
                     ) : (
                        <span className="text-[9px] text-slate-300 italic">Chưa phân loại</span>
                     )}
                  </td>
                  <td className="py-3 px-3 md:px-4 last:rounded-r-xl text-right">
                    <span className="bg-blue-600 text-white px-2.5 py-1 rounded-full font-black text-[8px] md:text-[9px] uppercase tracking-widest shadow-md shadow-blue-500/10 font-sans">
                      {item.round}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > pageSize && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-white hover:text-blue-600 transition-all font-black text-[10px]"
          >
            TRƯỚC
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              // Only show 5 pages near current or edges
              if (totalPages > 5 && Math.abs(p - currentPage) > 1 && p !== 1 && p !== totalPages) {
                if (p === 2 || p === totalPages - 1) return <span key={p} className="text-slate-300">...</span>;
                return null;
              }
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-xl font-black text-[10px] transition-all ${currentPage === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-400 hover:bg-white hover:text-blue-600'}`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-white hover:text-blue-600 transition-all font-black text-[10px]"
          >
            SAU
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-20">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" 
               onClick={() => setSelectedItem(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] sm:rounded-[40px] w-full max-w-sm p-6 sm:p-8 relative shadow-2xl border border-white overflow-hidden font-sans" 
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
              
              <button className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all" onClick={() => setSelectedItem(null)}>
                <X size={20} />
              </button>

              <div className="mb-8">
                <h3 className="font-black text-lg tracking-tight uppercase text-slate-800 font-display">Chi Tiết Kết Quả</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 font-sans">Hồ sơ nộp bài trực tuyến</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                      <User size={20} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Nhân sự</span>
                      <span className="font-bold text-slate-800 text-sm font-sans">{selectedItem.name} ({selectedItem.msnv})</span>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                      <Info size={20} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Phòng ban</span>
                      <span className="font-bold text-slate-800 text-sm font-sans">{selectedItem.department || 'N/A'}</span>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                      <Calendar size={20} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Thời điểm</span>
                      <span className="font-bold text-slate-800 text-sm whitespace-nowrap font-sans">{selectedItem.round}</span>
                   </div>
                </div>

                {selectedItem.status && (
                  <div className={`flex items-center gap-4 p-4 rounded-2xl border ${selectedItem.status === 'Đã có chứng nhận' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                     <div className={`w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center ${selectedItem.status === 'Đã có chứng nhận' ? 'text-emerald-600' : 'text-red-500'}`}>
                        <Info size={20} />
                     </div>
                     <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 font-sans ${selectedItem.status === 'Đã có chứng nhận' ? 'text-emerald-700/60' : 'text-red-700/60'}`}>Trạng Thái AI</span>
                        <span className={`font-bold text-sm font-sans ${selectedItem.status === 'Đã có chứng nhận' ? 'text-emerald-700' : 'text-red-700'}`}>{selectedItem.status}</span>
                     </div>
                  </div>
                )}
              </div>
              
              <motion.a 
                whileHover={selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl ? { scale: 1.02 } : {}}
                whileTap={selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl ? { scale: 0.98 } : {}}
                href={selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl || '#'} 
                target="_blank" 
                rel="noreferrer" 
                className={`mt-8 border-2 border-dashed rounded-[24px] p-8 flex flex-col items-center justify-center text-center group transition-all block cursor-pointer group ${selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl ? 'border-blue-200 hover:border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'}`}
              >
                 <div className={`w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 transition-transform ${selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl ? 'text-blue-600 group-hover:scale-110' : 'text-slate-300'}`}>
                    <ExternalLink size={28} />
                 </div>
                 <p className={`text-xs font-black uppercase tracking-[0.2em] font-sans ${selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl ? 'text-blue-700' : 'text-slate-400'}`}>
                   {selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl ? 'Xem Ảnh Minh Chứng' : 'Chưa có liên kết ảnh'}
                 </p>
                 <p className="text-[9px] text-blue-400 mt-2 font-bold italic tracking-wide font-sans">
                   {selectedItem.link || selectedItem.imageUrl || selectedItem.driveLink || selectedItem.fileUrl ? 'Mở rộng trong cửa sổ Drive mới' : 'Dữ liệu đang được đồng bộ...'}
                 </p>
              </motion.a>
              
              <button 
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 mt-8 rounded-2xl uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-slate-900/10 font-sans" 
                onClick={() => setSelectedItem(null)}
              >
                Đóng thông tin
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
