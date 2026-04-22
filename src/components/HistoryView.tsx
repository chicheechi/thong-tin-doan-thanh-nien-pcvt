import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Search, Filter, History, Calendar, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white border border-white rounded-[40px] p-8 lg:p-10 shadow-2xl shadow-blue-900/5 flex-grow flex flex-col h-full transition-all relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-blue-400 via-blue-600 to-transparent"></div>
      
      <div className="flex flex-wrap gap-6 items-center justify-between mb-10">
        <div className="flex items-center gap-3">
           <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
              <History size={20} />
           </div>
           <div>
              <h2 className="font-black text-slate-800 uppercase text-base tracking-[0.1em] font-display">Lịch Sử Hoàn Thành</h2>
              <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-black tracking-widest flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Dữ liệu trực tuyến
              </p>
           </div>
        </div>
        <div className="flex gap-3 items-center ml-auto">
          <div className="relative group hidden sm:block">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={14} />
            <select 
              className="text-[11px] bg-slate-50 border-2 border-slate-100 rounded-full pl-10 pr-4 py-3 font-bold text-slate-600 focus:border-blue-500 focus:bg-white transition-all cursor-pointer appearance-none min-w-[140px]"
              value={filterRound}
              onChange={e => setFilterRound(e.target.value)}
            >
              <option value="">Tất cả Tuần</option>
              <option value="Tuần 01">Tuần 01</option>
              <option value="Tuần 02">Tuần 02</option>
              <option value="Tuần 03">Tuần 03</option>
              <option value="Tuần 04">Tuần 04</option>
            </select>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Tìm nhân sự..." 
              className="text-[11px] bg-slate-50 border-2 border-slate-100 rounded-full pl-10 pr-4 py-3 w-40 font-bold text-slate-600 focus:border-blue-500 focus:bg-white placeholder:font-bold placeholder:text-slate-300 transition-all font-sans"
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
          <table className="w-full text-left border-separate border-spacing-y-3 font-sans">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] font-sans">
                <th className="pb-4 pt-0 px-6">Số hiệu</th>
                <th className="pb-4 pt-0 px-6 font-sans">Thông tin Nhân sự</th>
                <th className="pb-4 pt-0 px-6 font-sans text-right">Tuần thi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold font-sans">
              {filtered.map((item, idx) => (
                <motion.tr 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-slate-50/50 hover:bg-blue-50/80 cursor-pointer transition-all group border border-transparent hover:border-blue-100 rounded-2xl overflow-hidden font-sans"
                >
                  <td className="py-5 px-6 font-mono text-blue-600 first:rounded-l-2xl">
                     <span className="bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">{item.msnv}</span>
                  </td>
                  <td className="py-5 px-6">
                     <div className="flex flex-col">
                        <span className="text-slate-800 text-sm group-hover:text-blue-700 transition-colors uppercase font-display font-black">{item.name}</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5 font-sans font-bold">Xác nhận hoàn thành</span>
                     </div>
                  </td>
                  <td className="py-5 px-6 last:rounded-r-2xl text-right">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-500/20 font-sans">
                      {item.round}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
               onClick={() => setSelectedItem(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-sm p-8 relative shadow-2xl border border-white overflow-hidden font-sans" 
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
                      <Calendar size={20} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Thời điểm</span>
                      <span className="font-bold text-slate-800 text-sm whitespace-nowrap font-sans">{selectedItem.round}</span>
                   </div>
                </div>
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
