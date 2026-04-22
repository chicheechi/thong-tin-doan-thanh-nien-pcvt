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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-8 rounded-[32px] shadow-xl shadow-blue-900/5 border border-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tổng số nhân sự</p>
          <h3 className="text-4xl font-black text-slate-800">{stats.totalStaff}</h3>
          <p className="text-xs text-slate-400 mt-2 font-bold tracking-tight">Thành viên Đoàn thanh niên</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-600/20 border border-blue-500 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover:scale-110 transition-transform">
            <CheckCircle2 size={80} />
          </div>
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2">Tổng lượt nộp</p>
          <h3 className="text-4xl font-black text-white">{stats.totalSubmissions}</h3>
          <p className="text-xs text-blue-100/70 mt-2 font-bold tracking-tight">Đã ghi nhận trên hệ thống</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-8 rounded-[32px] shadow-xl shadow-blue-900/5 border border-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tỉ lệ trung bình</p>
          <h3 className="text-4xl font-black text-slate-800">{Math.round(stats.rounds.reduce((a, b) => a + b.percentage, 0) / 4)}%</h3>
          <p className="text-xs text-slate-400 mt-2 font-bold tracking-tight">Hoàn thành qua các tuần</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
               <BarChart3 size={20} />
            </div>
            <div>
               <h2 className="font-black text-slate-800 uppercase text-base tracking-[0.1em] font-display">Biểu đồ tiến độ nộp bài</h2>
               <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-black tracking-widest">Tỉ lệ hoàn thành theo từng tuần (%)</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.rounds} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                  unit="%"
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar 
                  dataKey="percentage" 
                  name="Tỉ lệ hoàn thành" 
                  fill="#2563EB" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
               <Award size={20} />
            </div>
            <div>
               <h2 className="font-black text-slate-800 uppercase text-base tracking-[0.1em] font-display">Chi tiết tuần</h2>
            </div>
          </div>
          
          <div className="space-y-4 flex-grow">
            {stats.rounds.map((round, idx) => (
              <div key={idx} className="p-4 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-blue-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{round.name}</span>
                  <span className="text-xs font-black text-slate-800">{round.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${round.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-[9px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">{round.count} lượt nộp</span>
                  {round.percentage >= 80 && (
                    <span className="text-[9px] text-emerald-500 font-black uppercase flex items-center gap-1">
                      <CheckCircle2 size={10} /> Đạt chỉ tiêu
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
