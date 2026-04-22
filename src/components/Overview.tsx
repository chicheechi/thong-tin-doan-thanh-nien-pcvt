import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, CheckCircle2, TrendingUp, Award, UserMinus, AlertCircle, X, Search } from 'lucide-react';
import { apiService } from '../services/api';

export default function Overview({ staffData, historyData }: { staffData: any[], historyData: any[] }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchUnsubmitted, setSearchUnsubmitted] = useState('');
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalSubmissions: 0,
    unsubmittedCount: 0,
    unsubmittedByDept: {} as Record<string, any[]>,
    rounds: [
      { name: 'Tuần 01', count: 0, percentage: 0 },
      { name: 'Tuần 02', count: 0, percentage: 0 },
      { name: 'Tuần 03', count: 0, percentage: 0 },
      { name: 'Tuần 04', count: 0, percentage: 0 },
    ]
  });

  useEffect(() => {
    const calculateStats = () => {
      const totalStaff = staffData.length;
      const totalSubmissions = historyData.length;
      
      // Find who hasn't submitted
      const submittedSet = new Set(historyData.map((h: any) => h.msnv));
      const unsubmittedStaff = staffData.filter((s: any) => !submittedSet.has(s.id));
      
      // Group by department
      const unsubmittedByDept = unsubmittedStaff.reduce((acc: any, curr: any) => {
        if (!acc[curr.department]) acc[curr.department] = [];
        acc[curr.department].push(curr);
        return acc;
      }, {});

      const roundCounts = historyData.reduce((acc: any, item: any) => {
        const r = item.round || '';
        if (r.includes('01')) acc['Tuần 01']++;
        else if (r.includes('02')) acc['Tuần 02']++;
        else if (r.includes('03')) acc['Tuần 03']++;
        else if (r.includes('04')) acc['Tuần 04']++;
        return acc;
      }, { 'Tuần 01': 0, 'Tuần 02': 0, 'Tuần 03': 0, 'Tuần 04': 0 });

      const rounds = [
        { name: 'Tuần 01', count: roundCounts['Tuần 01'], percentage: totalStaff ? Math.round((roundCounts['Tuần 01'] / totalStaff) * 100) : 0 },
        { name: 'Tuần 02', count: roundCounts['Tuần 02'], percentage: totalStaff ? Math.round((roundCounts['Tuần 02'] / totalStaff) * 100) : 0 },
        { name: 'Tuần 03', count: roundCounts['Tuần 03'], percentage: totalStaff ? Math.round((roundCounts['Tuần 03'] / totalStaff) * 100) : 0 },
        { name: 'Tuần 04', count: roundCounts['Tuần 04'], percentage: totalStaff ? Math.round((roundCounts['Tuần 04'] / totalStaff) * 100) : 0 },
      ];

      setStats({ totalStaff, totalSubmissions, unsubmittedCount: unsubmittedStaff.length, unsubmittedByDept, rounds });
    };

    calculateStats();
  }, [staffData, historyData]);

  if (loading) {
    return (
      <div className="bg-white border border-white rounded-[40px] p-12 shadow-2xl shadow-blue-900/5 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tổng hợp số liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-b from-white to-slate-50/50 p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-xl shadow-slate-200/40 border border-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 relative z-10">TỔNG ĐOÀN VIÊN</p>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight relative z-10">{stats.totalStaff}</h3>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-800 p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-blue-600/30 border border-blue-500 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover:scale-110 transition-transform">
            <CheckCircle2 size={80} />
          </div>
          <p className="text-[9px] sm:text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1 sm:mb-2 relative z-10">ĐÃ NỘP BÀI</p>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight relative z-10">{stats.totalSubmissions}</h3>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-br from-rose-500 to-rose-600 p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-rose-600/30 border border-rose-400 relative overflow-hidden group cursor-pointer col-span-2 lg:col-span-1"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover:scale-110 transition-transform">
            <UserMinus size={80} />
          </div>
          <p className="text-[9px] sm:text-[10px] font-black text-rose-100 uppercase tracking-widest mb-1 sm:mb-2 relative z-10">CHƯA NỘP BÀI</p>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight relative z-10 flex items-center gap-2">
            {stats.unsubmittedCount} 
            <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-bold animate-pulse">XEM DANH SÁCH</span>
          </h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-12 bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white flex flex-col relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-emerald-400 via-emerald-500 to-transparent"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner">
               <Award size={20} />
            </div>
            <div>
               <h2 className="font-black text-slate-800 uppercase text-lg sm:text-xl tracking-[0.1em] font-display">Chi tiết tuần</h2>
            </div>
          </div>
          
          <div className="space-y-4 flex-grow relative z-10">
            {stats.rounds.map((round, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-[24px] bg-slate-50 border border-slate-100 group hover:shadow-lg hover:shadow-slate-200/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{round.name}</span>
                  <span className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{round.percentage}%</span>
                </div>
                <div className="w-full h-3 md:h-4 bg-slate-200/60 rounded-full overflow-hidden shadow-inner flex mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${round.percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${round.percentage >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm text-slate-500 font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">{round.count} lượt nộp</span>
                  {round.percentage >= 80 && (
                    <span className="text-xs md:text-sm text-emerald-600 font-black uppercase flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 size={14} className="text-emerald-500" /> Đạt chỉ tiêu
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={() => setShowModal(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-[40px] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col relative z-10 shadow-2xl shadow-rose-900/20"
             >
                <div className="p-8 pb-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
                        <UserMinus size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nhân sự chưa nộp bài</h2>
                        <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">{stats.unsubmittedCount} người cần hoàn thành</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-500"
                   >
                     <X size={20} />
                   </button>
                </div>

                <div className="px-8 mb-6">
                   <div className="relative group">
                     <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text"
                       placeholder="Tìm kiếm theo tên hoặc mã số..."
                       value={searchUnsubmitted}
                       onChange={(e) => setSearchUnsubmitted(e.target.value)}
                       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/5 transition-all outline-none"
                     />
                   </div>
                </div>

                <div className="flex-grow overflow-auto px-8 pb-10 custom-scrollbar">
                   <div className="space-y-8">
                      {Object.entries(stats.unsubmittedByDept).map(([dept, list]) => {
                        const staffList = list as any[];
                        const filtered = staffList.filter(s => 
                          s.name.toLowerCase().includes(searchUnsubmitted.toLowerCase()) || 
                          s.id.includes(searchUnsubmitted)
                        );
                        if (filtered.length === 0) return null;

                        return (
                          <div key={dept}>
                             <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white py-2 z-10">
                               <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                               <h3 className="font-black text-slate-700 text-sm uppercase tracking-widest">{dept}</h3>
                               <span className="text-[10px] bg-rose-50 text-rose-500 px-2.5 py-0.5 rounded-full font-black">{filtered.length} người</span>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filtered.map(s => (
                                  <div key={s.id} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group hover:bg-rose-50 hover:border-rose-100 transition-all">
                                     <div>
                                        <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                                        <p className="font-mono text-[10px] text-slate-400 mt-1 font-bold">{s.id}</p>
                                     </div>
                                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-300 group-hover:text-rose-500 shadow-sm">
                                        <AlertCircle size={14} />
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
