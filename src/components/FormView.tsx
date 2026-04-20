import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { mockStaff } from '../mockData';

export default function FormView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex-grow flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Biểu mẫu nộp kết quả</h2>
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">TAB 1</span>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-5 text-sm font-medium border border-green-100">
          Nộp kết quả thành công! (Mô phỏng)
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase">Họ và tên / MSNV</label>
          <input 
            type="text" 
            list="staffListReact" 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Inter,sans-serif]"
            placeholder="Nhập để tìm kiếm..."
            required 
          />
          <datalist id="staffListReact">
            {mockStaff.map(s => (
              <option key={s.id} value={`${s.id} - ${s.name}`} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase">Vòng thi</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">-- Chọn vòng --</option>
              <option value="Vòng 1">Vòng 1</option>
              <option value="Vòng 2">Vòng 2</option>
              <option value="Vòng 3">Vòng 3</option>
              <option value="Vòng 4">Vòng 4</option>
              <option value="Vòng 5">Vòng 5</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase">Ngày thi</label>
            <input 
              type="date" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              defaultValue={new Date().toISOString().split('T')[0]}
              required 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600 uppercase">Ảnh minh chứng kết quả</label>
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:border-blue-400 group transition-colors overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              required 
            />
            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none py-4">
               <Upload className="mb-2" strokeWidth={1.5} size={32} />
               <span className="text-xs font-medium">Chạm để chụp màn hình hoặc chọn ảnh</span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-4 rounded-xl transition-colors shadow-lg shadow-blue-200 uppercase text-sm tracking-widest flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : null}
          {loading ? 'ĐANG GỬI...' : 'GỬI KẾT QUẢ NGAY'}
        </button>
      </form>
    </div>
  );
}
