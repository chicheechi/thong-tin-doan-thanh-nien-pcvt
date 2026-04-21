import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { mockStaff } from '../mockData';

export default function FormView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [calculatedMsnv, setCalculatedMsnv] = useState('');

  useEffect(() => {
    // Extract unique departments from mock data
    const depts = Array.from(new Set(mockStaff.map(s => s.department)));
    setDepartments(depts);
  }, []);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
    setSelectedName('');
    setCalculatedMsnv('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedName(val);
    const found = mockStaff.find(s => s.department === selectedDept && s.name === val);
    if (found) {
      setCalculatedMsnv(found.id);
    } else {
      setCalculatedMsnv('');
    }
  };

  const filteredStaff = mockStaff.filter(s => s.department === selectedDept);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatedMsnv) {
      alert("Vui lòng chọn Họ và tên có sẵn trong danh sách (để tự động điền Số hiệu) trước khi nộp!");
      return;
    }
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
          <label className="block text-[11px] font-semibold text-slate-600 uppercase">1. Phòng ban</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={selectedDept}
            onChange={handleDeptChange}
            required
          >
            <option value="">-- Chọn phòng ban --</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8 space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase">2. Họ và tên</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              value={selectedName}
              onChange={handleNameChange}
              disabled={!selectedDept}
              required 
            >
              <option value="">-- Chọn nhân sự --</option>
              {filteredStaff.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-4 space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase">3. Số hiệu</label>
            <input 
              type="text" 
              className="w-full bg-slate-100 border border-transparent rounded-lg px-3 py-2.5 text-sm font-mono text-slate-500 focus:outline-none"
              placeholder="Tự động..."
              value={calculatedMsnv}
              readOnly
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase">Vòng thi</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" required>
              <option value="">-- Chọn tuần thi --</option>
              <option value="Tuần 01">Tuần 01 (15/4 - 22/4/2026)</option>
              <option value="Tuần 02">Tuần 02 (23/4 - 29/4/2026)</option>
              <option value="Tuần 03">Tuần 03 (30/4 - 06/5/2026)</option>
              <option value="Tuần 04">Tuần 04 (07/5 - 13/5/2026)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase">Ngày thi</label>
            <input 
              type="date" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              defaultValue={new Date().toISOString().split('T')[0]}
              required 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase">Ảnh minh chứng kết quả</label>
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 mt-2 rounded-xl transition-colors shadow-lg shadow-blue-200 uppercase text-sm tracking-widest flex justify-center items-center gap-2"
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? 'ĐANG GỬI...' : 'GỬI KẾT QUẢ NGAY'}
        </button>
      </form>
    </div>
  );
}
