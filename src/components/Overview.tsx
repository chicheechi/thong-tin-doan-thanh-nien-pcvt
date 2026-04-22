import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { apiService } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalSubmissions: 0,
    rounds: [
      { name: 'Tuần 01', count: 0, percentage: 0 },
      { name: 'Tuần 02', count: 0, percentage: 0 },
      { name: 'Tuần 03', count: 0, percentage: 0 },
      { name: 'Tuần 04', count: 0, percentage: 0 },
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [staff, history] = await Promise.all([
          apiService.getStaff(),
          apiService.getHistory()
        ]);

        const totalStaff = staff.length;
        const totalSubmissions = history.length;

        const roundCounts = history.reduce((acc: any, item: any) => {
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

        setStats({ totalStaff, totalSubmissions, rounds });
      } catch (err) {
        console.error("Lỗi lấy thống kê:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-xl shadow-slate-200/40 border border-white relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-slate-100"></div>
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Users size={100} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Tổng số nhân sự</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight relative z-10">{stats.totalStaff}</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-2 font-bold tracking-tight relative z-10">Thành viên Đoàn thanh niên</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-800 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-blue-600/30 border border-blue-500 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-300"></div>
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover:scale-110 transition-transform">
            <CheckCircle2 size={100} />
          </div>
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 relative z-10">Tổng lượt nộp</p>
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight relative z-10">{stats.totalSubmissions}</h3>
          <p className="text-[10px] sm:text-xs text-blue-100/70 mt-2 font-bold tracking-tight relative z-10">Đã ghi nhận trên hệ thống</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-xl shadow-slate-200/40 border border-white relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-300"></div>
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <TrendingUp size={100} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Tỉ lệ trung bình</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight relative z-10">{Math.round(stats.rounds.reduce((a, b) => a + b.percentage, 0) / 4)}%</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-2 font-bold tracking-tight relative z-10">Hoàn thành qua các tuần</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-blue-400 via-blue-600 to-transparent"></div>
          
          <div className="flex items-center gap-3 mb-8 sm:mb-10 relative z-10">
            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
               <BarChart3 size={20} />
            </div>
            <div>
               <h2 className="font-black text-slate-800 uppercase text-sm sm:text-base tracking-[0.1em] font-display">Biểu đồ tiến độ nộp bài</h2>
               <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 uppercase font-black tracking-widest">Tỉ lệ hoàn thành theo từng tuần (%)</p>
            </div>
          </div>
          
          <div className="h-[250px] sm:h-[350px] w-full relative z-10 -ml-2 sm:ml-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.rounds} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 800 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 800 }}
                  unit="%"
                />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9', opacity: 0.4 }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '16px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#1E293B' }}
                />
                <Bar 
                  dataKey="percentage" 
                  name="Tỉ lệ hoàn thành" 
                  fill="url(#colorPercentage)" 
                  radius={[8, 8, 0, 0]} 
                  barSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-emerald-400 via-emerald-500 to-transparent"></div>
          
          <div className="flex items-center gap-3 mb-10 relative z-10">
            <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner">
               <Award size={20} />
            </div>
            <div>
               <h2 className="font-black text-slate-800 uppercase text-base tracking-[0.1em] font-display">Chi tiết tuần</h2>
               <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-black tracking-widest">Tiến độ chi tiết</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-grow relative z-10">
            {stats.rounds.map((round, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4.5 rounded-[24px] bg-slate-50/80 border border-slate-100 group hover:shadow-lg hover:shadow-slate-200/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{round.name}</span>
                  <span className="text-base font-black text-slate-800 tracking-tight">{round.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner flex mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${round.percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${round.percentage >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-100">{round.count} lượt nộp</span>
                  {round.percentage >= 80 && (
                    <span className="text-[9px] text-emerald-600 font-black uppercase flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full">
                      <CheckCircle2 size={12} className="text-emerald-500" /> Đạt chỉ tiêu
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
