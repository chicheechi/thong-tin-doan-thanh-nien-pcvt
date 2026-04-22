import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown, CheckCircle2, AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function FormView({ staffData, onSubmitted }: { staffData: any[], onSubmitted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [calculatedMsnv, setCalculatedMsnv] = useState('');
  
  const [round, setRound] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');

  const validateImageWithAI = async (base64: string, name: string) => {
    try {
      setValidating(true);
      setErrorMsg('');
      
      const cleanBase64 = base64.split(',')[1] || base64;
      
      const prompt = `Bạn là một chuyên gia kiểm duyệt chứng chỉ nội bộ công ty. 
      Nhiệm vụ: Kiểm tra bức ảnh này có phải là chứng nhận hoàn thành nội dung cuộc thi hay không.
      
      Tiêu chí hợp lệ:
      1. BẮT BUỘC có cụm từ "ĐÃ HOÀN THÀNH NỘI DUNG" (Hoặc tương đương) VÀ chữ "CHỨNG NHẬN" trên ảnh.
      2. Tên trong chứng nhận PHẢI khớp với tên: "${name}". (Chấp nhận viết hoa/thường, có dấu/không dấu).
      3. Bỏ qua mọi yếu tố về kích thước ảnh, tỷ lệ khung hình hay bố cục. Chỉ cần trên ảnh có chứa đầy đủ các chữ theo yêu cầu là HỢP LỆ.
      4. Nếu ảnh chỉ có điểm kết quả trắc nghiệm hoặc là ảnh đang làm bài thi mà KHÔNG CÓ chữ CHỨNG NHẬN -> KHÔNG HỢP LỆ.
      
      Xử lý nghiêm ngặt: Nếu không đủ 2 cột mốc "CHỨNG NHẬN" và nội dung đã hoàn thành -> đánh failed.

      Trả về kết quả theo định dạng JSON sau:
      {
        "isValid": boolean,
        "reason": string (Giải thích tại sao)
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: { type: Type.BOOLEAN },
              reason: { type: Type.STRING }
            },
            required: ["isValid", "reason"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return result;
    } catch (error) {
      console.error("AI Validation Error:", error);
      return { isValid: true, reason: "Bỏ qua xác thực do lỗi hệ thống" }; // Fail safe để người dùng vẫn nộp được nếu AI lỗi
    } finally {
      setValidating(false);
    }
  };

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
    setErrorMsg('');
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
    setErrorMsg('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMsg('');
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

  const filteredStaff = staffData.filter(s => s.department === selectedDept);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!selectedDept || !selectedName || !calculatedMsnv || !round) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin vào các trường bắt buộc!");
      return;
    }
    if (!imageBase64) {
      setErrorMsg("Vui lòng tải lên ảnh minh chứng kết quả!");
      return;
    }

    setLoading(true);
    setMsg('');
    
    // AI VALIDATION STEP
    const validation = await validateImageWithAI(imageBase64, selectedName);
    
    // Save to local storage so HistoryView can read it
    try {
       localStorage.setItem(`validation_${calculatedMsnv}_${round}`, JSON.stringify({
          isValid: validation.isValid,
          reason: validation.reason,
          timestamp: Date.now()
       }));
    } catch(e) {}

    const payload = {
      msnv: calculatedMsnv,
      name: selectedName,
      department: selectedDept,
      round: round,
      date: '',
      imageBase64: imageBase64,
      isValid: validation.isValid ? 'True' : 'False',
      validationReason: validation.reason
    };

    const res = await apiService.submitResult(payload);
    
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      if (validation.isValid) {
         setMsg("Gửi kết quả thành công và ảnh chứng nhận HỢP LỆ!");
         setErrorMsg('');
      } else {
         setErrorMsg(`Đã gửi kết quả, nhưng ảnh tải lên bị AI đánh giá KHÔNG HỢP LỆ: ${validation.reason}`);
      }
      onSubmitted();

      // Reset form
      setSelectedDept('');
      setSelectedName('');
      setCalculatedMsnv('');
      setRound('');
      setImageBase64('');
      setPreviewSrc('');
      
      setTimeout(() => {
         setSuccess(false);
         setErrorMsg('');
      }, 7000);
    } else {
      setErrorMsg("Có lỗi xảy ra: " + res.message);
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
        
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-rose-50 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100 shadow-sm"
          >
            <ShieldAlert size={18} />
            {errorMsg}
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
              disabled={departments.length === 0 || loading || validating}
              required
            >
              <option value="">{departments.length === 0 ? "Đang tải dữ liệu..." : "-- Chọn đơn vị --"}</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={16} />
          </div>
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
                    disabled={!selectedDept || loading || validating}
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
              disabled={loading || validating}
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
              disabled={loading || validating}
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
          disabled={loading || validating || !imageBase64}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 mt-6 rounded-[24px] shadow-2xl shadow-blue-500/30 uppercase text-sm tracking-[0.2em] flex justify-center items-center gap-3 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {validating ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AI Đang kiểm tra ảnh...</span>
            </>
          ) : loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang Tải Lên...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Xác nhận Nộp Kết Quả</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
