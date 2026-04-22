import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';

export default function FormView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState('');
  
  const [staffData, setStaffData] = useState<{msnv: string, name: string}[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [calculatedMsnv, setCalculatedMsnv] = useState('');
  
  const [round, setRound] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');

  useEffect(() => {
    apiService.getStaff().then(data => {
      // Dữ liệu API trả về bị lệch cột do data trên trang tính không có cột phòng ban
      // Row đầu tiên là Header (id: "STT", name: "Số hiệu", department: "Họ và tên")
      // Các row tiếp theo: department chứa Họ Tên, name chứa Số hiệu
      const cleanData = data.filter((s: any) => s.id !== "STT" && s.id !== "Số hiệu");
      
      const mappedStaff = cleanData.map((s: any) => ({
        msnv: s.name ? String(s.name).trim() : '',
        name: s.department ? String(s.department).trim() : ''
      })).filter((s: any) => s.name !== '');

      setStaffData(mappedStaff);
    });
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedName(val);
    const found = staffData.find(s => s.name === val);
    if (found) {
      setCalculatedMsnv(found.msnv);
    } else {
      setCalculatedMsnv('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1024;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImageBase64(compressedBase64);
          setPreviewSrc(compressedBase64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedName || !calculatedMsnv || !round) {
      alert("Vui lòng điền đầy đủ thông tin vào các trường bắt buộc!");
      return;
    }
    if (!imageBase64) {
      alert("Vui lòng tải lên ảnh minh chứng kết quả!");
      return;
    }

    setLoading(true);
    setMsg('');
    
    // Gửi payload, bỏ qua department vì data không có
    const payload = {
      msnv: calculatedMsnv,
      name: selectedName,
      department: '',
      round: round,
      date: '',
      imageBase64: imageBase64
    };

    const res = await apiService.submitResult(payload);
    
    setLoading(false);
    setSuccess(true);
    setMsg("Gửi kết quả thành công");
    
    // Reset form
    setSelectedName('');
    setCalculatedMsnv('');
    setRound('');
    setImageBase64('');
    setPreviewSrc('');
    
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white border border-white rounded-[40px] p-8 lg:p-10 shadow-2xl shadow-blue-900/5 flex-grow flex flex-col transition-all overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
      
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-black text-slate-800 uppercase text-base tracking-[0.1em] font-display">Nộp Kết Quả Mới</h2>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-emerald-100"
          >
            <CheckCircle2 size={18} />
            {msg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8 space-y-2.5">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">1</span>
                Họ và tên <span className="text-blue-500 ml-auto">*</span>
            </label>
            <div className="relative group text-sm">
                <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
                    value={selectedName}
                    onChange={handleNameChange}
                    disabled={staffData.length === 0}
                    required 
                >
                    <option value="">{staffData.length === 0 ? "Đang tải dữ liệu..." : "-- Chọn nhân sự --"}</option>
                    {staffData.map((s, idx) => (
                        <option key={idx} value={s.name}>{s.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={18} />
            </div>
          </div>

          <div className="md:col-span-4 space-y-2.5 font-bold">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">2. Số hiệu</label>
            <input 
              type="text" 
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-mono text-slate-500 focus:outline-none cursor-not-allowed italic font-black"
              placeholder="..."
              value={calculatedMsnv}
              readOnly
              required 
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Vòng thi <span className="text-blue-500 ml-auto">*</span>
          </label>
          <div className="relative group">
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all appearance-none cursor-pointer" 
              value={round}
              onChange={(e) => setRound(e.target.value)}
              required
            >
              <option value="">-- Chọn tuần thi hiện tại --</option>
              <option value="Tuần 01">Tuần 01 (15/4 - 22/4/2026)</option>
              <option value="Tuần 02">Tuần 02 (23/4 - 29/4/2026)</option>
              <option value="Tuần 03">Tuần 03 (30/4 - 06/5/2026)</option>
              <option value="Tuần 04">Tuần 04 (07/5 - 13/5/2026)</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={18} />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Ảnh minh chứng <span className="text-blue-500 ml-auto">*</span>
          </label>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative border-2 border-dashed rounded-[32px] p-6 text-center transition-all cursor-pointer group overflow-hidden ${previewSrc ? 'border-blue-500 bg-blue-50/50 shadow-inner' : 'border-slate-200 bg-gradient-to-b from-slate-50/50 to-slate-100/50 hover:border-blue-400 shadow-sm'}`}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              required={!previewSrc}
            />
            {!previewSrc ? (
              <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none py-10">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:shadow-blue-100 transition-all">
                    <Upload className="animate-bounce-slow" strokeWidth={2} size={28} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest">Chụp màn hình hoặc chọn ảnh</span>
                 <p className="text-[10px] mt-2 opacity-60">Hệ thống sẽ tự động nén ảnh để upload nhanh hơn</p>
              </div>
            ) : (
              <div className="relative z-0 py-2">
                <img src={previewSrc} alt="Preview" className="max-h-52 mx-auto rounded-2xl shadow-2xl border-4 border-white" />
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="mt-4 text-[10px] text-blue-600 font-black uppercase tracking-widest bg-white inline-block px-3 py-1 rounded-full shadow-sm"
                >
                    Đã lưu ảnh tạm thời
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.button 
          type="submit" 
          disabled={loading || !imageBase64}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 mt-6 rounded-[24px] shadow-2xl shadow-blue-500/30 uppercase text-sm tracking-[0.2em] flex justify-center items-center gap-3 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang Tải Lên...</span>
            </>
          ) : (
            'Xác nhận Nộp Kết Quả'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
