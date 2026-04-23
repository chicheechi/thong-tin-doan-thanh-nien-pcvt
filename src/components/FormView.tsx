import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';

export default function FormView({ staffData, onSubmitted }: { staffData: any[], onSubmitted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState('');
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [calculatedMsnv, setCalculatedMsnv] = useState('');
  
  const [round, setRound] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (staffData.length > 0) {
      const depts = Array.from(new Set(staffData.map((s: any) => s.department))).filter(Boolean) as string[];
      setDepartments(depts);
    }
  }, [staffData]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
    setSelectedName('');
    setCalculatedMsnv('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedName(val);
    const found = staffData.find(s => s.department === selectedDept && s.name === val);
    if (found) {
      setCalculatedMsnv(found.id);
    } else {
      setCalculatedMsnv('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 3 - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach(file => {
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
            setImages(prev => [...prev, compressedBase64].slice(0, 3));
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const filteredStaff = staffData.filter(s => s.department === selectedDept);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !selectedName || !calculatedMsnv || !round) {
      alert("Vui lòng điền đầy đủ thông tin vào các trường bắt buộc!");
      return;
    }
    if (images.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 ảnh minh chứng kết quả!");
      return;
    }

    setLoading(true);
    setMsg('Đang gửi dữ liệu...');

    const payload = {
      msnv: calculatedMsnv,
      name: selectedName,
      department: selectedDept,
      round: round,
      date: '',
      images: images // Gửi danh sách ảnh
    };

    const res = await apiService.submitResult(payload);
    
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      setMsg("Gửi kết quả thành công");
      
      // Notify parent to fetch new history (optional, user asked for F5 but seeing own submission is good)
      onSubmitted();

      // Reset form
      setSelectedDept('');
      setSelectedName('');
      setCalculatedMsnv('');
      setRound('');
      setImages([]);
      
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Có lỗi xảy ra: " + res.message);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white border border-white rounded-[32px] sm:rounded-[40px] p-6 md:p-8 lg:p-10 shadow-2xl shadow-blue-900/5 flex-grow flex flex-col transition-all overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
      
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="font-black text-slate-800 uppercase text-sm sm:text-base tracking-[0.1em] font-display">Nộp Kết Quả Mới</h2>
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
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
            <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white shadow-md">1</span>
            Phòng ban <span className="text-blue-500 ml-auto">*</span>
          </label>
          <div className="relative group">
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-800 transition-all appearance-none cursor-pointer"
              value={selectedDept}
              onChange={handleDeptChange}
              disabled={departments.length === 0}
              required
            >
              <option value="">{departments.length === 0 ? "Đang tải dữ liệu..." : "-- Chọn đơn vị --"}</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={16} />
          </div>
          {departments.length === 0 && (
             <p className="text-[10px] text-blue-500 mt-1 font-bold italic animate-pulse flex items-center gap-1.5">
               <AlertCircle size={12} /> Đang kết nối dữ liệu từ hệ thống vtlc...
             </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-3">
            <label className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white shadow-md">2</span>
                Họ và tên <span className="text-blue-500 ml-auto">*</span>
            </label>
            <div className="relative group">
                <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-800 transition-all appearance-none cursor-pointer"
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
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={16} />
            </div>
          </div>

          <div className="md:col-span-4 space-y-3 font-bold">
            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest pl-1">3. Số hiệu</label>
            <input 
              type="text" 
              className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-mono text-blue-600 shadow-inner focus:outline-none cursor-not-allowed italic font-black text-center"
              placeholder="..."
              value={calculatedMsnv}
              readOnly
              required 
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
            Vòng thi <span className="text-blue-500 ml-auto">*</span>
          </label>
          <div className="relative group">
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-800 transition-all appearance-none cursor-pointer" 
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
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={16} />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">Ảnh minh chứng <span className="text-blue-500">*</span></span>
            <span className={images.length >= 3 ? "text-rose-500" : "text-blue-500"}>{images.length}/3 ảnh</span>
          </label>
          
          <div className="grid grid-cols-1 gap-4">
            {images.length < 3 && (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative border-2 border-dashed rounded-[32px] p-6 text-center transition-all cursor-pointer group overflow-hidden border-slate-200 bg-gradient-to-b from-slate-50/50 to-slate-100/50 hover:border-blue-400 shadow-sm"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  required={images.length === 0}
                />
                <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none py-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-3 group-hover:shadow-blue-100 transition-all">
                    <Upload strokeWidth={2} size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Thêm ảnh minh chứng</span>
                  <p className="text-[9px] mt-1 opacity-60">Tối đa 3 ảnh (JPG/PNG)</p>
                </div>
              </motion.div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <AnimatePresence>
                  {images.map((src, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-video sm:aspect-square group rounded-2xl overflow-hidden border-2 border-white shadow-md"
                    >
                      <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors"
                      >
                        <span className="text-[14px] leading-none">×</span>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <motion.button 
          type="submit" 
          disabled={loading || images.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 mt-6 rounded-[24px] shadow-2xl shadow-blue-500/30 uppercase text-sm tracking-[0.2em] flex justify-center items-center gap-3 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">{msg || 'Đang Tải Lên...'}</span>
            </>
          ) : (
            'Xác nhận Nộp Kết Quả'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
